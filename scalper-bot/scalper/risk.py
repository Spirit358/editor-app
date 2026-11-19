from __future__ import annotations

from datetime import datetime, timezone

from .config import RiskConfig
from .models import ClosedTrade, Tick


class RiskManager:
    """Decides whether new entries are allowed and when to stop for the day."""

    def __init__(self, cfg: RiskConfig):
        self.cfg = cfg
        self.realized_today = 0.0
        self.halted_for_day = False
        self.halt_count = 0
        self._day: int | None = None
        self._loss_streak = 0
        self._cooldown_until = 0.0

    def on_tick(self, tick: Tick) -> None:
        day = int(tick.time // 86400)
        if day != self._day:
            self._day = day
            self.realized_today = 0.0
            self.halted_for_day = False
            self._loss_streak = 0

    def record(self, trade: ClosedTrade) -> None:
        self.realized_today += trade.profit
        if trade.profit < 0:
            self._loss_streak += 1
            if self._loss_streak >= self.cfg.max_consecutive_losses:
                self._cooldown_until = trade.close_time + self.cfg.cooldown_s
                self._loss_streak = 0
        else:
            self._loss_streak = 0

    def breached_daily_limit(self, floating: float) -> bool:
        """True (and latches the halt) once realized + floating loss hits the limit."""
        if not self.halted_for_day and self.realized_today + floating <= -self.cfg.daily_loss_limit:
            self.halted_for_day = True
            self.halt_count += 1
        return self.halted_for_day

    def entry_block_reason(self, tick: Tick) -> str | None:
        if self.halted_for_day:
            return "daily loss limit"
        if tick.time < self._cooldown_until:
            return "cooldown after losses"
        if tick.spread > self.cfg.max_spread:
            return "spread too wide"
        hour = datetime.fromtimestamp(tick.time, tz=timezone.utc).hour
        if not (self.cfg.trade_start_hour_utc <= hour < self.cfg.trade_end_hour_utc):
            return "outside trading hours"
        return None
