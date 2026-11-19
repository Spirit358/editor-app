from __future__ import annotations

import csv
from collections.abc import Iterator
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

from .models import Tick


def load_ticks_csv(path: str | Path) -> Iterator[Tick]:
    """Read ticks from a CSV with columns time,bid,ask.

    `time` is epoch seconds or an ISO-8601 timestamp (taken as UTC if naive).
    """
    with open(path, newline="") as fh:
        for row in csv.DictReader(fh):
            yield Tick(_parse_time(row["time"]), float(row["bid"]), float(row["ask"]))


def _parse_time(value: str) -> float:
    try:
        return float(value)
    except ValueError:
        dt = datetime.fromisoformat(value)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.timestamp()


def synthetic_ticks(
    days: float = 5.0,
    seed: int = 1,
    start_price: float = 4050.0,
    start_time: float = 1_760_000_000.0,
    drift_strength: float = 0.0,
) -> Iterator[Tick]:
    """Made-up gold-like ticks for exercising the code. NOT market data.

    A random walk with volatility that clusters, occasional jumps, and a
    spread that widens when volatility does. `drift_strength` adds short
    trending regimes; at 0 the walk has no exploitable structure, so any
    strategy's expected profit is the negative of its trading costs.
    """
    rng = np.random.default_rng(seed)
    n = int(days * 86400 / 0.5)  # ~2 ticks per second
    dt = rng.exponential(0.5, n)
    # Log-volatility follows a slow mean-reverting process (volatility clusters).
    log_vol = np.empty(n)
    shocks = rng.normal(0, 0.02, n)
    lv = 0.0
    for i in range(n):
        lv += -0.0005 * lv + shocks[i]
        log_vol[i] = lv
    vol = 0.04 * np.exp(np.clip(log_vol, -1.5, 2.0))  # price units per sqrt(second)
    steps = rng.normal(0, 1, n) * vol * np.sqrt(dt)
    jumps = (rng.random(n) < 2e-5) * rng.normal(0, 3.0, n)
    drift = np.zeros(n)
    if drift_strength:
        regime = 0.0
        flips = rng.random(n) < 1 / 600  # regime changes every ~5 minutes
        picks = rng.choice([-1.0, 0.0, 0.0, 1.0], n)
        for i in range(n):
            if flips[i]:
                regime = picks[i]
            drift[i] = regime * drift_strength * vol[i] * dt[i]
    mid = start_price + np.cumsum(steps + jumps + drift)
    spread = np.round(0.16 + 1.5 * vol + np.abs(rng.normal(0, 0.01, n)), 3)
    times = start_time + np.cumsum(dt)
    for t, m, sp in zip(times, mid, spread):
        yield Tick(float(t), round(float(m - sp / 2), 3), round(float(m + sp / 2), 3))
