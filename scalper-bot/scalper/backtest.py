from __future__ import annotations

from collections import Counter
from collections.abc import Iterable
from dataclasses import dataclass

from .broker import PaperBroker
from .config import Config
from .engine import Engine
from .models import ClosedTrade, Tick


@dataclass(frozen=True)
class Report:
    trades: int
    win_rate: float
    net_profit: float
    avg_win: float
    avg_loss: float
    worst_trade: float
    profit_factor: float
    max_drawdown: float
    reasons: dict[str, int]
    halted_days: int

    def format(self) -> str:
        reasons = ", ".join(f"{k}={v}" for k, v in sorted(self.reasons.items()))
        return "\n".join([
            f"  trades          {self.trades}",
            f"  win rate        {self.win_rate:.1%}",
            f"  net profit      {self.net_profit:+.2f}",
            f"  avg win / loss  {self.avg_win:+.2f} / {self.avg_loss:+.2f}",
            f"  worst trade     {self.worst_trade:+.2f}",
            f"  profit factor   {self.profit_factor:.2f}",
            f"  max drawdown    {self.max_drawdown:.2f}",
            f"  days halted     {self.halted_days}",
            f"  exits           {reasons}",
        ])


def run_backtest(cfg: Config, ticks: Iterable[Tick]) -> tuple[Report, list[ClosedTrade]]:
    broker = PaperBroker(cfg.strategy.contract_size, cfg.costs)
    engine = Engine(cfg, broker)
    last = None
    for tick in ticks:
        engine.on_tick(tick)
        last = tick
    if last is not None:
        # Mark anything still open at the final quote: open losers are losses.
        engine.flatten(last, "end_of_data")
    return summarize(engine.trades, engine.risk.halt_count), engine.trades


def summarize(trades: list[ClosedTrade], halted_days: int = 0) -> Report:
    wins = [t.profit for t in trades if t.profit > 0]
    losses = [t.profit for t in trades if t.profit <= 0]
    equity = peak = drawdown = 0.0
    for t in sorted(trades, key=lambda t: t.close_time):
        equity += t.profit
        peak = max(peak, equity)
        drawdown = max(drawdown, peak - equity)
    gross_loss = -sum(losses)
    return Report(
        trades=len(trades),
        win_rate=len(wins) / len(trades) if trades else 0.0,
        net_profit=sum(wins) - gross_loss,
        avg_win=sum(wins) / len(wins) if wins else 0.0,
        avg_loss=sum(losses) / len(losses) if losses else 0.0,
        worst_trade=min((t.profit for t in trades), default=0.0),
        profit_factor=sum(wins) / gross_loss if gross_loss else float("inf"),
        max_drawdown=drawdown,
        reasons=dict(Counter(t.reason for t in trades)),
        halted_days=halted_days,
    )
