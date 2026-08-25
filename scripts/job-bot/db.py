import sqlite3
from pathlib import Path

# Store DB inside the job-bot scripts folder
DB_PATH = Path(__file__).resolve().parent / "jobs.db"


def init_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS seen_jobs (
            job_id TEXT PRIMARY KEY,
            source TEXT,
            title TEXT,
            company TEXT,
            url TEXT,
            seen_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def is_seen(job_id: str) -> bool:
    conn = sqlite3.connect(str(DB_PATH))
    cur = conn.execute("SELECT 1 FROM seen_jobs WHERE job_id = ?", (job_id,))
    result = cur.fetchone() is not None
    conn.close()
    return result


def mark_seen(job_id: str, source: str, title: str, company: str, url: str):
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute(
        "INSERT OR IGNORE INTO seen_jobs (job_id, source, title, company, url) VALUES (?, ?, ?, ?, ?)",
        (job_id, source, title, company, url),
    )
    conn.commit()
    conn.close()
