# scalper-bot

A tick scalper for MetaTrader 5 (built around gold, `XAUUSDm`). It opens small
positions in the direction of short-term momentum, stacks up to a few of them,
and closes each one as soon as it is in profit by a set amount.

It is separate from the EDITOR app in the parent directory.

**It has no demonstrated edge.** On the test data it loses money, for the
reason explained under [Results](#results). Run it on a demo account.

## How it trades

- **Entry**: two time-weighted EMAs of the mid price. When the fast one is
  above the slow one by `entry_threshold` it buys; below, it sells. One new
  position at most every `min_entry_interval_s`, up to `max_positions`, never
  both directions at once.
- **Exit in profit**: each position is closed at market once its net profit
  covers a `take_profit` price move (0.30 on 0.01 lot of gold is $0.30).
- **Exit at a loss**: a server-side stop at `stop_loss`, a `max_hold_s`
  timeout, a daily loss limit that flattens everything and stops until the
  next UTC day, and a cooldown after a run of losses.
- **Filters**: no entries when the spread is above `max_spread` or outside the
  configured hours.

## Use

```bash
pip install -r requirements.txt
python -m pytest                      # 17 tests

# Backtest on made-up ticks, or on real ones exported from MT5
python -m scalper backtest --synthetic --days 5 --compare-no-stop
python -m scalper backtest --ticks ticks.csv --config config.toml
```

Live trading needs Windows, the MT5 terminal, and `pip install MetaTrader5`:

```bash
python -m scalper export-ticks --symbol XAUUSDm --days 5 --out ticks.csv
python -m scalper live --config config.toml
```

`live` uses the account the terminal is logged in to, or `MT5_LOGIN`,
`MT5_PASSWORD` and `MT5_SERVER` if set. It refuses non-demo accounts unless
you pass `--allow-real-account`, and refuses to run without a stop loss.
Ctrl-C closes the bot's positions and exits. It only touches positions it
opened itself (magic number `20261119`).

The MT5 code path (`scalper/mt5_broker.py`) has not been run against a
terminal: it could not be, on the Linux machine this was written on.

## Results

Five days of **synthetic** ticks (a random walk with gold-like spread; not
market data), 0.01 lot:

| seed | as configured | close only when green, no stop |
|------|---------------|--------------------------------|
| 1 | 51% wins, **-63.73** | 98% wins, **+76.81** |
| 2 | 50% wins, **-70.04** | 95% wins, **-21.91** |
| 3 | 44% wins, **-60.45** | 78% wins, **-334.92**, worst trade -86 |

Two things to take from this:

1. A random walk has nothing to predict, so the bot pays the spread on every
   trade and loses about that much. Whether real gold ticks give this signal
   anything to work with is the open question, and only a backtest on real
   ticks (`export-ticks`) and then a demo run can answer it.
2. "Close when green and never take a loss" produces a very high win rate,
   and sometimes a profit, until the price leaves and does not come back.
   The win rate says nothing about whether the strategy makes money.
