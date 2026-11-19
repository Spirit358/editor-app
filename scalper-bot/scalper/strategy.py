from __future__ import annotations

import math

from .config import StrategyConfig
from .models import Side, Tick


class MomentumSignal:
    """Direction from two time-weighted EMAs of the mid price.

    Time weighting (rather than per-tick weighting) keeps the signal the same
    whether the feed delivers 2 or 20 ticks a second.
    """

    def __init__(self, cfg: StrategyConfig):
        self.cfg = cfg
        self.fast: float | None = None
        self.slow: float | None = None
        self._first_time: float | None = None
        self._last_time: float | None = None

    def update(self, tick: Tick) -> None:
        mid = tick.mid
        if self.fast is None or self.slow is None or self._last_time is None:
            self.fast = self.slow = mid
            self._first_time = self._last_time = tick.time
            return
        dt = max(tick.time - self._last_time, 0.0)
        self._last_time = tick.time
        self.fast += (mid - self.fast) * _alpha(dt, self.cfg.fast_halflife_s)
        self.slow += (mid - self.slow) * _alpha(dt, self.cfg.slow_halflife_s)

    @property
    def momentum(self) -> float:
        if self.fast is None or self.slow is None:
            return 0.0
        return self.fast - self.slow

    def direction(self, tick: Tick) -> Side | None:
        if self._first_time is None or tick.time - self._first_time < self.cfg.warmup_s:
            return None
        m = self.momentum
        if m > self.cfg.entry_threshold:
            return Side.BUY
        if m < -self.cfg.entry_threshold and self.cfg.allow_short:
            return Side.SELL
        return None


def _alpha(dt: float, halflife: float) -> float:
    return 1.0 - math.exp(-math.log(2) * dt / halflife)
