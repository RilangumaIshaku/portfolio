import os
import requests
import json

UPSTASH_URL = os.getenv("KV_REST_API_URL") or os.getenv("UPSTASH_REDIS_REST_URL")
UPSTASH_TOKEN = os.getenv("KV_REST_API_TOKEN") or os.getenv("UPSTASH_REDIS_REST_TOKEN")

def _redis_req(command, *args):
    if not UPSTASH_URL or not UPSTASH_TOKEN:
        return None
    url = UPSTASH_URL.rstrip('/')
    try:
        # Use POST to the root endpoint with the command array
        payload = [command] + list(args)
        resp = requests.post(url, headers={"Authorization": f"Bearer {UPSTASH_TOKEN}"}, json=payload)
        return resp.json().get("result")
    except Exception as e:
        print(f"Redis request failed: {e}")
        return None

def init_db():
    if not UPSTASH_URL:
        print("[WARNING] KV_REST_API_URL/UPSTASH_REDIS_REST_URL not set. Redis calls will fail.")

def is_seen(job_id: str) -> bool:
    res = _redis_req("SISMEMBER", "portfolio:seen_jobs", job_id)
    return res == 1

def mark_seen(job_id: str, source: str, title: str, company: str, url: str):
    _redis_req("SADD", "portfolio:seen_jobs", job_id)

def get_portfolio_jobs():
    res = _redis_req("GET", "portfolio:jobs")
    if not res:
        return []
    try:
        if isinstance(res, str):
            return json.loads(res)
        return res
    except Exception:
        return []

def set_portfolio_jobs(jobs_list):
    _redis_req("SET", "portfolio:jobs", json.dumps(jobs_list))

def set_bot_status(status_str, logs_list, last_scan_result=None):
    status_obj = {
        "status": status_str,
        "logs": logs_list[-20:], # keep last 20 logs
        "lastScanResult": last_scan_result
    }
    _redis_req("SET", "portfolio:bot_status", json.dumps(status_obj))

def is_bot_enabled() -> bool:
    res = _redis_req("GET", "portfolio:bot_enabled")
    if not res:
        return False
    try:
        if isinstance(res, str):
            return json.loads(res)
        return bool(res)
    except Exception:
        return False
