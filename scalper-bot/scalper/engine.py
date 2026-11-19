from __future__ import annotations

import logging

from .broker import Broker
from .config import Config
from .models import ClosedTrade, Tick
from .risk import RiskManager
from .strategy import MomentumSignal

log = logging.getLogger("scalper")


class Engine:
    """Tick handler shared by the backtest and live trading.

    Order of work on every tick: sync broker-side closes, take profits and
    time out stale positions, enforce the daily loss limit, then consider one
    new entry.
    """

    def __init__(self, cfg: Config, broker: Broker):
        self.cfg = cfg
        self.broker = broker
        self.signal = MomentumSignal(cfg.strategy)
        self.risk = RiskManager(cfg.risk)
        self.trades: list[ClosedTrade] = []
        self._last_entry_time = float("-inf")

    def on_tick(self, tick: Tick) -> None:
        s = self.cfg.strategy
        self.risk.on_tick(tick)
        self.signal.update(tick)

        for trade in self.broker.on_tick(tick):
            self._record(trade)

        target = s.take_profit * s.lot * s.contract_size
        for pos in self.broker.positions():
            profit = pos.profit(tick, s.contract_size)
            if profit >= target:
                self._close(pos, tick, "take_profit")
            elif s.max_hold_s is not None and tick.time - pos.open_time >= s.max_hold_s:
                self._close(pos, tick, "timeout")

        open_positions = self.broker.positions()
        floating = sum(p.profit(tick, s.contract_size) for p in open_positions)
        if self.risk.breached_daily_limit(floating):
            for pos in open_positions:
                self._close(pos, tick, "daily_limit")
            return

        self._maybe_enter(tick, open_positions)

    def flatten(self, tick: Tick, reason: str = "shutdown") -> None:
        for pos in self.broker.positions():
            self._close(pos, tick, reason)

    def _maybe_enter(self, tick: Tick, open_positions) -> None:
        s = self.cfg.strategy
        if len(open_positions) >= s.max_positions:
            return
        if tick.time - self._last_entry_time < s.min_entry_interval_s:
            return
        side = self.signal.direction(tick)
        if side is None:
            return
        # Never hold both directions at once: that only pays the spread twice.
        if any(p.side is not side for p in open_positions):
            return
        if self.risk.entry_block_reason(tick) is not None:
            return
        pos = self.broker.open(side, s.lot, s.stop_loss, tick)
        # Space out retries too, so a rejecting broker is not hammered every tick.
        self._last_entry_time = tick.time
        if pos is not None:
            log.info("open  #%s %s %.2f @ %.3f", pos.ticket, side.name, pos.lots, pos.entry_price)

    def _close(self, pos, tick: Tick, reason: str) -> None:
        trade = self.broker.close(pos, tick, reason)
        if trade is not None:
            self._record(trade)

    def _record(self, trade: ClosedTrade) -> None:
        self.trades.append(trade)
        self.risk.record(trade)
        log.info(
            "close #%s %s @ %.3f  %+.2f  (%s)",
            trade.ticket, trade.side.name, trade.exit_price, trade.profit, trade.reason,
        )
