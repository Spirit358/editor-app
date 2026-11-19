from __future__ import annotations

import argparse
import logging
import sys
from dataclasses import replace

from .backtest import run_backtest
from .config import load_config
from .data import load_ticks_csv, synthetic_ticks


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="scalper", description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    bt = sub.add_parser("backtest", help="replay ticks through the strategy")
    bt.add_argument("--config")
    src = bt.add_mutually_exclusive_group(required=True)
    src.add_argument("--ticks", help="CSV with time,bid,ask columns")
    src.add_argument("--synthetic", action="store_true", help="made-up ticks (not market data)")
    bt.add_argument("--days", type=float, default=5.0)
    bt.add_argument("--seed", type=int, default=1)
    bt.add_argument("--drift", type=float, default=0.0, help="synthetic trend strength")
    bt.add_argument("--compare-no-stop", action="store_true",
                    help="also run with no stop loss, timeout or loss limit")
    bt.add_argument("--verbose", action="store_true", help="log every trade")

    live = sub.add_parser("live", help="trade through a running MT5 terminal")
    live.add_argument("--config")
    live.add_argument("--allow-real-account", action="store_true")

    ex = sub.add_parser("export-ticks", help="save MT5 tick history to CSV")
    ex.add_argument("--symbol", default="XAUUSDm")
    ex.add_argument("--days", type=float, default=5.0)
    ex.add_argument("--out", required=True)

    args = parser.parse_args(argv)
    verbose = getattr(args, "verbose", False) or args.command != "backtest"
    logging.basicConfig(
        level=logging.INFO if verbose else logging.WARNING,
        format="%(asctime)s %(message)s", datefmt="%H:%M:%S",
    )

    if args.command == "backtest":
        cfg = load_config(args.config)

        def ticks():
            if args.ticks:
                return load_ticks_csv(args.ticks)
            return synthetic_ticks(args.days, args.seed, drift_strength=args.drift)

        report, _ = run_backtest(cfg, ticks())
        print("As configured:")
        print(report.format())
        if args.compare_no_stop:
            loose = replace(
                cfg,
                strategy=replace(cfg.strategy, stop_loss=None, max_hold_s=None),
                risk=replace(cfg.risk, daily_loss_limit=float("inf"),
                             max_consecutive_losses=10**9),
            )
            report, _ = run_backtest(loose, ticks())
            print("\nClose only when green (no stop, no timeout, no loss limit):")
            print(report.format())
        return 0

    from .mt5_broker import MT5Error, export_ticks, run_live

    try:
        if args.command == "live":
            run_live(load_config(args.config), args.allow_real_account)
        else:
            count = export_ticks(args.symbol, args.days, args.out)
            print(f"wrote {count} ticks to {args.out}")
    except MT5Error as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
