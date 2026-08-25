import os
import requests

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")


def send_telegram_message(text: str):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("[notifier] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID, skipping send.")
        print(text)
        return

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    resp = requests.post(url, data={
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    })
    if resp.status_code != 200:
        print(f"[notifier] Telegram send failed: {resp.text}")


def format_job_message(job: dict) -> str:
    flag = "🔥" if job.get("high_priority") else "•"
    lines = [f"{flag} <b>{job['title']}</b>"]
    parts = []
    if job.get("company"):
        parts.append(job["company"])
    if job.get("location"):
        parts.append(job["location"])
    if parts:
        lines.append(" — ".join(parts))
    if job.get("salary"):
        lines.append(f"💰 {job['salary']}")
    lines.append(f"📡 {job['source']} | ⭐ {job.get('score', 0)} keywords matched")
    lines.append(job["url"])
    return "\n".join(lines)


def send_job_batch(jobs: list):
    if not jobs:
        return

    header = f"📋 {len(jobs)} new job match(es) found:\n"
    send_telegram_message(header)

    # Telegram has a message length cap; send one job per message to keep it simple and reliable
    for job in jobs:
        send_telegram_message(format_job_message(job))
