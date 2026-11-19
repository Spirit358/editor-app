from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class Side(Enum):
    BUY = 1
    SELL = -1


@dataclass(frozen=True)
class Tick:
    time: float  # epoch seconds (UTC)
    bid: float
    ask: float

    @property
    def mid(self) -> float:
        return (self.bid + self.ask) / 2

    @property
    def spread(self) -> float:
        return self.ask - self.bid


@dataclass
class Position:
    ticket: int
    side: Side
    lots: float
    entry_price: float
    open_time: float
    stop_loss: float | None = None  # price level held by the broker
    commission: float = 0.0  # round-trip cost in account currency

    def exit_price(self, tick: Tick) -> float:
        """Price this position would close at right now."""
        return tick.bid if self.side is Side.BUY else tick.ask

    def profit(self, tick: Tick, contract_size: float) -> float:
        """Net floating profit in account currency, after commission."""
        move = (self.exit_price(tick) - self.entry_price) * self.side.value
        return move * self.lots * contract_size - self.commission


@dataclass(frozen=True)
class ClosedTrade:
    ticket: int
    side: Side
    lots: float
    entry_price: float
    exit_price: float
    open_time: float
    close_time: float
    profit: float  # net, account currency
    reason: str
