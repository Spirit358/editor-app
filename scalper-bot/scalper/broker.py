from __future__ import annotations

from typing import Protocol

from .config import CostConfig
from .models import ClosedTrade, Position, Side, Tick


class Broker(Protocol):
    def on_tick(self, tick: Tick) -> list[ClosedTrade]:
        """Sync with the venue; return trades closed there (e.g. stop-loss hits)."""

    def positions(self) -> list[Position]: ...

    def open(self, side: Side, lots: float, stop_distance: float | None, tick: Tick) -> Position | None: ...

    def close(self, position: Position, tick: Tick, reason: str) -> ClosedTrade | None: ...


class PaperBroker:
    """Simulated execution: buys fill at ask, sells at bid, plus configured costs.

    Stops are filled at the stop level or the quote, whichever is worse, so a
    gap through the stop costs more than the nominal stop distance.
    """

    def __init__(self, contract_size: float, costs: CostConfig | None = None):
        self.contract_size = contract_size
        self.costs = costs or CostConfig()
        self._positions: dict[int, Position] = {}
        self._next_ticket = 1

    def positions(self) -> list[Position]:
        return list(self._positions.values())

    def open(self, side: Side, lots: float, stop_distance: float | None, tick: Tick) -> Position:
        price = (tick.ask if side is Side.BUY else tick.bid) + side.value * self.costs.slippage
        stop = None if stop_distance is None else price - side.value * stop_distance
        pos = Position(
            ticket=self._next_ticket,
            side=side,
            lots=lots,
            entry_price=price,
            open_time=tick.time,
            stop_loss=stop,
            commission=self.costs.commission_per_lot * lots,
        )
        self._next_ticket += 1
        self._positions[pos.ticket] = pos
        return pos

    def close(self, position: Position, tick: Tick, reason: str) -> ClosedTrade | None:
        if position.ticket not in self._positions:
            return None
        price = position.exit_price(tick) - position.side.value * self.costs.slippage
        return self._settle(position, price, tick.time, reason)

    def on_tick(self, tick: Tick) -> list[ClosedTrade]:
        closed = []
        for pos in self.positions():
            if pos.stop_loss is None:
                continue
            quote = pos.exit_price(tick)
            if (quote - pos.stop_loss) * pos.side.value <= 0:
                price = quote - pos.side.value * self.costs.slippage
                closed.append(self._settle(pos, price, tick.time, "stop_loss"))
        return closed

    def _settle(self, pos: Position, price: float, time: float, reason: str) -> ClosedTrade:
        del self._positions[pos.ticket]
        gross = (price - pos.entry_price) * pos.side.value * pos.lots * self.contract_size
        return ClosedTrade(
            ticket=pos.ticket,
            side=pos.side,
            lots=pos.lots,
            entry_price=pos.entry_price,
            exit_price=price,
            open_time=pos.open_time,
            close_time=time,
            profit=gross - pos.commission,
            reason=reason,
        )
