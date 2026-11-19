import pytest

from scalper.backtest import run_backtest, summarize
from scalper.broker import PaperBroker
from scalper.config import Config, CostConfig, RiskConfig, StrategyConfig, load_config
from scalper.data import load_ticks_csv, synthetic_ticks
from scalper.engine import Engine
from scalper.models import Side, Tick
from scalper.strategy import MomentumSignal

SPREAD = 0.2


def tick(t, mid, spread=SPREAD):
    return Tick(float(t), mid - spread / 2, mid + spread / 2)


def make_engine(**strategy):
    risk = strategy.pop("risk", RiskConfig())
    costs = strategy.pop("costs", CostConfig())
    base = dict(warmup_s=0, fast_halflife_s=1, slow_halflife_s=10, entry_threshold=0.1)
    cfg = Config(StrategyConfig(**{**base, **strategy}), risk, costs)
    broker = PaperBroker(cfg.strategy.contract_size, cfg.costs)
    return Engine(cfg, broker), broker


def ramp(engine, start_t, start, end, steps):
    """Feed a linear price move, one tick per second. Returns the next time."""
    for i in range(steps):
        engine.on_tick(tick(start_t + i, start + (end - start) * i / (steps - 1)))
    return start_t + steps


def test_paper_broker_pays_the_spread():
    broker = PaperBroker(100.0)
    pos = broker.open(Side.BUY, 0.01, None, tick(0, 100.0))
    assert pos.entry_price == pytest.approx(100.1)
    assert pos.profit(tick(1, 100.0), 100.0) == pytest.approx(-SPREAD)
    trade = broker.close(pos, tick(2, 100.5), "x")
    assert trade.profit == pytest.approx(0.3)
    assert broker.positions() == []
    assert broker.close(pos, tick(3, 100.5), "x") is None


def test_stop_loss_fills_at_the_gapped_quote():
    broker = PaperBroker(100.0)
    broker.open(Side.SELL, 0.01, 0.5, tick(0, 100.0))  # sold at 99.9, stop 100.4
    assert broker.on_tick(tick(1, 100.2)) == []  # ask 100.3
    (trade,) = broker.on_tick(tick(2, 102.0))  # ask 102.1, far through the stop
    assert trade.reason == "stop_loss"
    assert trade.profit == pytest.approx(-2.2)


def test_commission_and_slippage_reduce_profit():
    broker = PaperBroker(100.0, CostConfig(commission_per_lot=7.0, slippage=0.01))
    pos = broker.open(Side.BUY, 0.01, None, tick(0, 100.0))
    trade = broker.close(pos, tick(1, 101.0), "x")
    assert trade.profit == pytest.approx(0.8 - 0.02 - 0.07)


def test_signal_follows_direction_after_warmup():
    sig = MomentumSignal(StrategyConfig(warmup_s=5, fast_halflife_s=1, slow_halflife_s=10,
                                        entry_threshold=0.1))
    for i in range(4):
        sig.update(tick(i, 100 + i))
    assert sig.direction(tick(4, 104)) is None  # still warming up
    for i in range(4, 10):
        sig.update(tick(i, 100 + i))
    assert sig.direction(tick(10, 110)) is Side.BUY
    for i in range(10, 40):
        sig.update(tick(i, 110 - (i - 10)))
    assert sig.direction(tick(40, 80)) is Side.SELL


def test_shorts_can_be_disabled():
    sig = MomentumSignal(StrategyConfig(warmup_s=0, fast_halflife_s=1, slow_halflife_s=10,
                                        entry_threshold=0.1, allow_short=False))
    for i in range(20):
        sig.update(tick(i, 100 - i))
    assert sig.direction(tick(20, 80)) is None


def test_engine_closes_as_soon_as_target_profit_is_reached():
    engine, broker = make_engine(take_profit=0.3, stop_loss=5.0, max_positions=1)
    ramp(engine, 0, 100.0, 103.0, 31)
    wins = [t for t in engine.trades if t.reason == "take_profit"]
    assert wins
    target = 0.3 * 0.01 * 100
    assert all(t.profit >= target - 1e-9 for t in wins)
    assert all(t.side is Side.BUY for t in wins)


def test_engine_stacks_up_to_max_positions_with_spacing():
    engine, broker = make_engine(take_profit=50.0, stop_loss=50.0, max_positions=3,
                                 min_entry_interval_s=2)
    ramp(engine, 0, 100.0, 103.0, 31)
    positions = broker.positions()
    assert len(positions) == 3
    times = sorted(p.open_time for p in positions)
    assert all(b - a >= 2 for a, b in zip(times, times[1:]))


def test_engine_times_out_stale_positions():
    engine, broker = make_engine(take_profit=50.0, stop_loss=50.0, max_positions=1,
                                 max_hold_s=20)
    t = ramp(engine, 0, 100.0, 101.0, 11)
    for i in range(40):
        engine.on_tick(tick(t + i, 101.0))
    assert engine.trades[0].reason == "timeout"
    assert engine.trades[0].close_time - engine.trades[0].open_time >= 20


def test_daily_loss_limit_flattens_and_halts_until_next_day():
    risk = RiskConfig(daily_loss_limit=1.0, max_consecutive_losses=99)
    engine, broker = make_engine(take_profit=50.0, stop_loss=50.0, max_positions=2,
                                 max_hold_s=None, risk=risk)
    t = ramp(engine, 0, 100.0, 101.0, 11)
    assert broker.positions()
    t = ramp(engine, t, 101.0, 97.0, 41)  # crash through the limit
    assert broker.positions() == []
    assert {tr.reason for tr in engine.trades} == {"daily_limit"}
    assert engine.risk.halted_for_day
    count = len(engine.trades)
    ramp(engine, t, 97.0, 90.0, 60)  # strong signal, but halted
    assert len(engine.trades) == count and broker.positions() == []
    ramp(engine, 86400 + 10, 90.0, 80.0, 60)  # next UTC day
    assert not engine.risk.halted_for_day
    assert len(engine.trades) > count or broker.positions()


def test_cooldown_after_consecutive_losses():
    risk = RiskConfig(daily_loss_limit=1e9, max_consecutive_losses=2, cooldown_s=1000)
    engine, broker = make_engine(take_profit=50.0, stop_loss=0.3, max_positions=1,
                                 max_hold_s=None, min_entry_interval_s=0, risk=risk)
    t = 0
    for _ in range(6):  # whipsaw: up to trigger a buy, then down through the stop
        t = ramp(engine, t, 100.0, 101.0, 11)
        t = ramp(engine, t, 101.0, 100.0, 4)
    losses = [tr for tr in engine.trades if tr.reason == "stop_loss"]
    assert len(losses) == 2  # third entry blocked by the cooldown


def test_wide_spread_blocks_entries():
    engine, broker = make_engine(risk=RiskConfig(max_spread=0.1))
    ramp(engine, 0, 100.0, 103.0, 31)
    assert broker.positions() == [] and engine.trades == []


def test_no_hedging_against_open_positions():
    engine, broker = make_engine(take_profit=50.0, stop_loss=50.0, max_positions=4,
                                 max_hold_s=None,
                                 risk=RiskConfig(daily_loss_limit=1e9))
    t = ramp(engine, 0, 100.0, 101.0, 11)
    ramp(engine, t, 101.0, 95.0, 61)
    assert {p.side for p in broker.positions()} == {Side.BUY}


def test_backtest_marks_open_positions_at_end():
    cfg = Config(StrategyConfig(warmup_s=0, fast_halflife_s=1, slow_halflife_s=10,
                                entry_threshold=0.1, take_profit=50.0, stop_loss=None,
                                max_hold_s=None, max_positions=1))
    ticks = [tick(i, 100 + i * 0.1) for i in range(11)] + [tick(11 + i, 101 - i * 0.2) for i in range(10)]
    report, trades = run_backtest(cfg, ticks)
    assert [t.reason for t in trades] == ["end_of_data"]
    assert report.net_profit < 0 and report.win_rate == 0


def test_summarize_drawdown_and_profit_factor():
    engine, broker = make_engine()
    assert summarize([]).trades == 0
    p = broker.open(Side.BUY, 0.01, None, tick(0, 100))
    a = broker.close(p, tick(1, 101.2), "x")  # +1.0
    p = broker.open(Side.BUY, 0.01, None, tick(2, 100))
    b = broker.close(p, tick(3, 98.2), "x")  # -2.0
    report = summarize([a, b])
    assert report.net_profit == pytest.approx(-1.0)
    assert report.max_drawdown == pytest.approx(2.0)
    assert report.profit_factor == pytest.approx(0.5)
    assert report.win_rate == 0.5


def test_synthetic_ticks_are_deterministic_and_sane():
    a = list(synthetic_ticks(days=0.01, seed=3))
    b = list(synthetic_ticks(days=0.01, seed=3))
    assert a == b and len(a) > 1000
    assert all(t.ask > t.bid for t in a)
    assert all(y.time > x.time for x, y in zip(a, a[1:]))


def test_csv_loader_accepts_epoch_and_iso(tmp_path):
    path = tmp_path / "t.csv"
    path.write_text("time,bid,ask\n1760000000.5,4050.1,4050.3\n2025-10-09T08:53:21,4050.2,4050.4\n")
    first, second = load_ticks_csv(path)
    assert first == Tick(1760000000.5, 4050.1, 4050.3)
    assert second.time == pytest.approx(1760000001.0)


def test_config_rejects_unknown_and_invalid_keys(tmp_path):
    path = tmp_path / "c.toml"
    path.write_text("[strategy]\ntake_proft = 1\n")
    with pytest.raises(ValueError, match="take_proft"):
        load_config(path)
    path.write_text("[strategy]\ntake_profit = -1\n")
    with pytest.raises(ValueError):
        load_config(path)
    path.write_text("[strategy]\nlot = 0.02\n[risk]\nmax_spread = 0.25\n")
    cfg = load_config(path)
    assert cfg.strategy.lot == 0.02 and cfg.risk.max_spread == 0.25
