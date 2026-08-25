"""
Job Bot — runs from portfolio/scripts/job-bot/
Scrapes job platforms, filters by keywords, exports to data/jobs.json
"""
import json
import os
import sys
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
# Load .env.local from portfolio root (2 levels up)
load_dotenv(dotenv_path=str(Path(__file__).resolve().parent.parent.parent / ".env.local"))

# Ensure we can import sibling modules
sys.path.insert(0, str(Path(__file__).resolve().parent))

from db import init_db, is_seen, mark_seen, get_portfolio_jobs, set_portfolio_jobs, set_bot_status, is_bot_enabled
from sources import fetch_all
from matcher import filter_and_rank
from notifier import send_job_batch
from config import MATCH_KEYWORDS, ENABLED_SOURCES

# Portfolio root is 2 levels up from this file
PORTFOLIO_ROOT = Path(__file__).resolve().parent.parent.parent
PORTFOLIO_JOBS_PATH = PORTFOLIO_ROOT / "data" / "jobs.json"


def export_to_portfolio(all_matched: list, new_matches: list):
    """Write matched jobs to the portfolio's Upstash Redis database for the admin dashboard."""
    existing = get_portfolio_jobs()
    existing_ids = {j["id"] for j in existing}

    for job in new_matches:
        if job["id"] not in existing_ids:
            existing.append({
                "id": job["id"],
                "source": job["source"],
                "title": job["title"],
                "company": job.get("company", ""),
                "url": job["url"],
                "description": job.get("description", "")[:500],
                "score": job.get("score", 0),
                "high_priority": job.get("high_priority", False),
                "keywords_matched": _extract_matched_keywords(job),
                "salary": job.get("salary", ""),
                "location": job.get("location", ""),
                "tags": job.get("tags", []),
                "found_at": datetime.now().isoformat(),
            })

    set_portfolio_jobs(existing)
    print(f"Exported {len(existing)} total jobs to Redis")


def _extract_matched_keywords(job: dict) -> list:
    text = (job.get("title", "") + " " + job.get("description", "")).lower()
    return [kw for kw in MATCH_KEYWORDS if kw.lower() in text]


def run_once():
    logs = []
    def log(msg):
        print(msg)
        logs.append(msg)
        
    if not is_bot_enabled():
        print("Bot is stopped via Admin Panel. Exiting.")
        return
        
    set_bot_status("running", ["Starting job bot scan..."])
    
    log(f"Fetching jobs from: {', '.join(ENABLED_SOURCES)}")
    init_db()
    
    set_bot_status("scanning", ["Fetching jobs from sources..."])
    all_jobs = fetch_all(ENABLED_SOURCES)
    log(f"Fetched {len(all_jobs)} total listings.")

    matched = filter_and_rank(all_jobs)
    log(f"{len(matched)} matched your keywords.")

    new_matches = []
    for job in matched:
        if not is_seen(job["id"]):
            new_matches.append(job)
            mark_seen(job["id"], job["source"], job["title"], job.get("company", ""), job["url"])

    log(f"{len(new_matches)} are new (not seen before).")
    
    set_bot_status("running", logs)
    
    send_job_batch(new_matches)
    export_to_portfolio(matched, new_matches)

    sources_count = {}
    for job in matched:
        src = job["source"]
        sources_count[src] = sources_count.get(src, 0) + 1
        
    log("\n── Summary ──")
    for src, count in sorted(sources_count.items(), key=lambda x: -x[1]):
        log(f"  {src}: {count} jobs")
    log(f"  TOTAL: {len(matched)} matched, {len(new_matches)} new")
    log("Done.\n")
    
    set_bot_status("idle", logs, last_scan_result={"new_matches": len(new_matches), "total_matched": len(matched)})


if __name__ == "__main__":
    run_once()
