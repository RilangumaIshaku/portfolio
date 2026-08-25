"""
Run this instead of main.py if you want the bot to keep running continuously
and check for new jobs on a fixed interval (e.g. every 6 hours).

Usage: python scheduler.py
Leave it running in a terminal, tmux session, or as a background service.
"""

from apscheduler.schedulers.blocking import BlockingScheduler
from main import run_once
from config import RUN_INTERVAL_HOURS

if __name__ == "__main__":
    scheduler = BlockingScheduler()
    scheduler.add_job(run_once, "interval", hours=RUN_INTERVAL_HOURS, next_run_time=None)

    print(f"Scheduler started. Running every {RUN_INTERVAL_HOURS} hours.")
    print("Running first scan now...")
    run_once()

    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        print("Scheduler stopped.")
