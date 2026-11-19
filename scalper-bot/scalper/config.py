from __future__ import annotations

import tomllib
from dataclasses import dataclass, field, fields
from pathlib import Path


@dataclass(frozen=True)
class StrategyConfig:
    symbol: str = "XAUUSDm"
    lot: float = 0.01
    contract_size: float = 100.0  # XAUUSD: 1 lot = 100 oz, so 0.01 lot moves $1 per $1
    # Signal: time-weighted EMAs of the mid price. Enter in the direction of
    # (fast - slow) once the gap exceeds entry_threshold (price units).
    fast_halflife_s: float = 20.0
    slow_halflife_s: float = 120.0
    entry_threshold: float = 0.15
    warmup_s: float = 300.0
    allow_short: bool = True
    # Exits, as price distances from entry.
    take_profit: float = 0.30  # close as soon as net profit covers this move
    stop_loss: float | None = 0.90  # None = no stop (do not do this live)
    max_hold_s: float | None = 600.0  # close stale positions at market
    # Stacking.
    max_positions: int = 4
    min_entry_interval_s: float = 5.0


@dataclass(frozen=True)
class RiskConfig:
    max_spread: float = 0.30  # skip entries when the spread is wider than this
    daily_loss_limit: float = 10.0  # account currency; flatten and stop for the day
    max_consecutive_losses: int = 4
    cooldown_s: float = 900.0  # pause after max_consecutive_losses
    trade_start_hour_utc: int = 0
    trade_end_hour_utc: int = 24
    max_slippage: float = 0.05  # live only: reject fills worse than this (price units)


@dataclass(frozen=True)
class CostConfig:
    """Execution costs. Commission also feeds the live "is it in profit yet" check."""

    commission_per_lot: float = 0.0  # round trip, account currency
    slippage: float = 0.0  # backtest only: adverse slippage on every market fill


@dataclass(frozen=True)
class Config:
    strategy: StrategyConfig = field(default_factory=StrategyConfig)
    risk: RiskConfig = field(default_factory=RiskConfig)
    costs: CostConfig = field(default_factory=CostConfig)


def _build(cls, data: dict):
    known = {f.name for f in fields(cls)}
    unknown = set(data) - known
    if unknown:
        raise ValueError(f"unknown {cls.__name__} keys: {sorted(unknown)}")
    return cls(**data)


def load_config(path: str | Path | None) -> Config:
    if path is None:
        return Config()
    with open(path, "rb") as fh:
        raw = tomllib.load(fh)
    unknown = set(raw) - {"strategy", "risk", "costs"}
    if unknown:
        raise ValueError(f"unknown config sections: {sorted(unknown)}")
    cfg = Config(
        strategy=_build(StrategyConfig, raw.get("strategy", {})),
        risk=_build(RiskConfig, raw.get("risk", {})),
        costs=_build(CostConfig, raw.get("costs", {})),
    )
    validate(cfg)
    return cfg


def validate(cfg: Config) -> None:
    s, r = cfg.strategy, cfg.risk
    if s.lot <= 0 or s.contract_size <= 0:
        raise ValueError("lot and contract_size must be positive")
    if s.take_profit <= 0:
        raise ValueError("take_profit must be positive")
    if s.stop_loss is not None and s.stop_loss <= 0:
        raise ValueError("stop_loss must be positive (or omitted)")
    if s.fast_halflife_s >= s.slow_halflife_s:
        raise ValueError("fast_halflife_s must be shorter than slow_halflife_s")
    if s.max_positions < 1:
        raise ValueError("max_positions must be at least 1")
    if r.daily_loss_limit <= 0:
        raise ValueError("daily_loss_limit must be positive")
