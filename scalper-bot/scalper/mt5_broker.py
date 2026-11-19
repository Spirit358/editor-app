"""MetaTrader 5 execution. Requires the `MetaTrader5` package (Windows only)
and a running MT5 terminal. Not exercised by the test suite: try it on a demo
account before anything else.
"""
from __future__ import annotations

import csv
import logging
import os
import time
from datetime import datetime, timedelta, timezone

from .config import Config
from .models import ClosedTrade, Position, Side, Tick

log = logging.getLogger("scalper.mt5")

MAGIC = 20261119  # tags this bot's orders so it never touches other positions


class MT5Error(RuntimeError):
    pass


def connect():
    """Start the MT5 API session. Credentials come from MT5_LOGIN, MT5_PASSWORD
    and MT5_SERVER if set; otherwise the terminal's logged-in account is used."""
    try:
        import MetaTrader5 as mt5
    except ImportError as exc:
        raise MT5Error("pip install MetaTrader5 (Windows only, needs the MT5 terminal)") from exc
    kwargs = {}
    if os.environ.get("MT5_LOGIN"):
        kwargs = {
            "login": int(os.environ["MT5_LOGIN"]),
            "password": os.environ.get("MT5_PASSWORD", ""),
            "server": os.environ.get("MT5_SERVER", ""),
        }
    if not mt5.initialize(**kwargs):
        raise MT5Error(f"MT5 initialize failed: {mt5.last_error()}")
    return mt5


class MT5Broker:
    def __init__(self, cfg: Config, mt5, allow_real_account: bool = False):
        self.cfg = cfg
        self.mt5 = mt5
        self.symbol = cfg.strategy.symbol
        account = mt5.account_info()
        if account is None:
            raise MT5Error(f"no account: {mt5.last_error()}")
        if account.trade_mode != mt5.ACCOUNT_TRADE_MODE_DEMO and not allow_real_account:
            raise MT5Error("this is not a demo account; pass --allow-real-account to trade it")
        if not mt5.symbol_select(self.symbol, True):
            raise MT5Error(f"symbol {self.symbol} unavailable: {mt5.last_error()}")
        info = mt5.symbol_info(self.symbol)
        if abs(info.trade_contract_size - cfg.strategy.contract_size) > 1e-9:
            raise MT5Error(
                f"contract_size is {info.trade_contract_size} at the broker, "
                f"{cfg.strategy.contract_size} in the config"
            )
        if cfg.strategy.lot < info.volume_min:
            raise MT5Error(f"lot {cfg.strategy.lot} is below the broker minimum {info.volume_min}")
        self._point = info.point
        self._digits = info.digits
        self._min_stop = info.trade_stops_level * info.point
        if info.filling_mode & 1:
            self._filling = mt5.ORDER_FILLING_FOK
        elif info.filling_mode & 2:
            self._filling = mt5.ORDER_FILLING_IOC
        else:
            self._filling = mt5.ORDER_FILLING_RETURN
        self._deviation = max(int(round(cfg.risk.max_slippage / info.point)), 1)
        self._known: dict[int, Position] = {}
        self._last_msc = 0
        self._server_offset = 0.0  # broker server clock minus UTC, in seconds
        log.info("connected: account %s on %s, balance %.2f %s",
                 account.login, account.server, account.balance, account.currency)

    # -- quotes ---------------------------------------------------------
    def next_tick(self) -> Tick | None:
        """Latest quote if it changed since the last call. Time is local UTC."""
        raw = self.mt5.symbol_info_tick(self.symbol)
        if raw is None or raw.time_msc == self._last_msc or raw.bid <= 0 or raw.ask <= 0:
            return None
        self._last_msc = raw.time_msc
        now = time.time()
        # Server clocks sit on a UTC offset in whole half hours.
        self._server_offset = round((raw.time_msc / 1000 - now) / 1800) * 1800
        return Tick(now, raw.bid, raw.ask)

    # -- Broker protocol --------------------------------------------------
    def positions(self) -> list[Position]:
        return list(self._known.values())

    def on_tick(self, tick: Tick) -> list[ClosedTrade]:
        raw = self.mt5.positions_get(symbol=self.symbol)
        if raw is None:
            log.warning("positions_get failed: %s", self.mt5.last_error())
            return []
        live = {p.ticket: p for p in raw if p.magic == MAGIC}
        closed = []
        for ticket in list(self._known):
            if ticket not in live:  # closed at the broker: stop loss or by hand
                pos = self._known.pop(ticket)
                closed.append(self._closed_trade(pos, tick, "closed_at_broker"))
        for ticket, p in live.items():
            if ticket not in self._known:  # opened before a restart
                side = Side.BUY if p.type == self.mt5.POSITION_TYPE_BUY else Side.SELL
                self._known[ticket] = Position(
                    ticket=ticket, side=side, lots=p.volume, entry_price=p.price_open,
                    open_time=p.time - self._server_offset, stop_loss=p.sl or None,
                    commission=self.cfg.costs.commission_per_lot * p.volume,
                )
        return closed

    def open(self, side: Side, lots: float, stop_distance: float | None, tick: Tick) -> Position | None:
        mt5 = self.mt5
        price = tick.ask if side is Side.BUY else tick.bid
        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": self.symbol,
            "volume": lots,
            "type": mt5.ORDER_TYPE_BUY if side is Side.BUY else mt5.ORDER_TYPE_SELL,
            "price": price,
            "deviation": self._deviation,
            "magic": MAGIC,
            "comment": "scalper",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": self._filling,
        }
        stop = None
        if stop_distance is not None:
            # Measure from the far side of the spread so the stop clears the
            # broker's minimum distance from the current close-out quote.
            distance = max(stop_distance, self._min_stop + tick.spread)
            stop = round(price - side.value * distance, self._digits)
            request["sl"] = stop
        result = mt5.order_send(request)
        if result is None or result.retcode != mt5.TRADE_RETCODE_DONE:
            log.warning("open rejected: %s", _describe(result, mt5))
            return None
        ticket = result.order  # in MT5 the position ticket is the opening order's ticket
        pos = Position(
            ticket=ticket, side=side, lots=lots, entry_price=result.price or price,
            open_time=tick.time, stop_loss=stop,
            commission=self.cfg.costs.commission_per_lot * lots,
        )
        self._known[ticket] = pos
        return pos

    def close(self, position: Position, tick: Tick, reason: str) -> ClosedTrade | None:
        mt5 = self.mt5
        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": self.symbol,
            "position": position.ticket,
            "volume": position.lots,
            "type": mt5.ORDER_TYPE_SELL if position.side is Side.BUY else mt5.ORDER_TYPE_BUY,
            "price": position.exit_price(tick),
            "deviation": self._deviation,
            "magic": MAGIC,
            "comment": reason[:31],
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": self._filling,
        }
        result = mt5.order_send(request)
        if result is None or result.retcode != mt5.TRADE_RETCODE_DONE:
            # Leave it tracked; the engine retries on the next tick.
            log.warning("close #%s rejected: %s", position.ticket, _describe(result, mt5))
            return None
        self._known.pop(position.ticket, None)
        return self._closed_trade(position, tick, reason, fill_price=result.price or None)

    # -- helpers ------------------------------------------------------------
    def _closed_trade(self, pos: Position, tick: Tick, reason: str,
                      fill_price: float | None = None) -> ClosedTrade:
        """Build the trade record, preferring the broker's own numbers."""
        price = fill_price or pos.exit_price(tick)
        gross = (price - pos.entry_price) * pos.side.value * pos.lots * self.cfg.strategy.contract_size
        profit = gross - pos.commission
        deals = self.mt5.history_deals_get(position=pos.ticket)
        exits = [d for d in deals or () if d.entry == self.mt5.DEAL_ENTRY_OUT]
        if exits:
            profit = sum(d.profit + d.commission + d.swap for d in deals)
            price = exits[-1].price
            if reason == "closed_at_broker" and exits[-1].reason == self.mt5.DEAL_REASON_SL:
                reason = "stop_loss"
        return ClosedTrade(
            ticket=pos.ticket, side=pos.side, lots=pos.lots, entry_price=pos.entry_price,
            exit_price=price, open_time=pos.open_time, close_time=tick.time,
            profit=profit, reason=reason,
        )


def _describe(result, mt5) -> str:
    if result is None:
        return str(mt5.last_error())
    return f"retcode {result.retcode} {result.comment}"


def run_live(cfg: Config, allow_real_account: bool = False, poll_s: float = 0.05) -> None:
    from .engine import Engine

    if cfg.strategy.stop_loss is None:
        raise MT5Error("refusing to trade live without a stop_loss")
    mt5 = connect()
    engine = None
    last_tick = None
    try:
        broker = MT5Broker(cfg, mt5, allow_real_account)
        engine = Engine(cfg, broker)
        log.info("trading %s; Ctrl-C closes all bot positions and exits", cfg.strategy.symbol)
        while True:
            tick = broker.next_tick()
            if tick is None:
                time.sleep(poll_s)
                continue
            last_tick = tick
            engine.on_tick(tick)
    except KeyboardInterrupt:
        log.info("stopping")
    finally:
        if engine is not None and last_tick is not None:
            engine.flatten(last_tick)
            left = engine.broker.positions()
            if left:
                log.error("%d position(s) could NOT be closed; close them in the terminal", len(left))
            net = sum(t.profit for t in engine.trades)
            log.info("session: %d trades, net %+.2f", len(engine.trades), net)
        mt5.shutdown()


def export_ticks(symbol: str, days: float, out_path: str) -> int:
    """Save recent tick history to CSV (time,bid,ask) for backtesting."""
    mt5 = connect()
    try:
        if not mt5.symbol_select(symbol, True):
            raise MT5Error(f"symbol {symbol} unavailable: {mt5.last_error()}")
        end = datetime.now(timezone.utc) + timedelta(days=1)  # covers server clock offsets
        start = end - timedelta(days=days + 1)
        ticks = mt5.copy_ticks_range(symbol, start, end, mt5.COPY_TICKS_INFO)
        if ticks is None or len(ticks) == 0:
            raise MT5Error(f"no ticks returned: {mt5.last_error()}")
        with open(out_path, "w", newline="") as fh:
            writer = csv.writer(fh)
            writer.writerow(["time", "bid", "ask"])
            for t in ticks:
                writer.writerow([t["time_msc"] / 1000, t["bid"], t["ask"]])
        return len(ticks)
    finally:
        mt5.shutdown()
