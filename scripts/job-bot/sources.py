"""
Job sources — each function returns a list of dicts with a common shape:
{
    "id": unique string,
    "source": platform name,
    "title": str,
    "company": str,
    "url": str,
    "description": str,   # used for keyword matching
    "salary": str,         # if available
    "location": str,       # if available
    "tags": list[str],     # if available
}

Enable/disable sources in config.py via ENABLED_SOURCES.
API keys for Jooble/Adzuna go in .env as JOOBLE_API_KEY, ADZUNA_APP_ID, ADZUNA_APP_KEY.
"""

import os
import requests
import feedparser
from datetime import datetime, timedelta


# ═══════════════════════════════════════════════════════════════
#  1. RemoteOK  (no auth)
# ═══════════════════════════════════════════════════════════════
def fetch_remoteok():
    jobs = []
    try:
        resp = requests.get(
            "https://remoteok.com/api",
            headers={"User-Agent": "Mozilla/5.0 (job-bot/2.0)"},
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"[remoteok] fetch failed: {e}")
        return jobs

    for item in data:
        if "id" not in item or "position" not in item:
            continue
        jobs.append({
            "id": f"remoteok_{item['id']}",
            "source": "remoteok",
            "title": item.get("position", ""),
            "company": item.get("company", ""),
            "url": item.get("url", f"https://remoteok.com/remote-jobs/{item['id']}"),
            "description": " ".join([
                item.get("position", ""),
                item.get("description", ""),
                " ".join(item.get("tags", [])),
            ]),
            "salary": item.get("salary", ""),
            "location": item.get("location", "Remote"),
            "tags": item.get("tags", []),
        })
    print(f"[remoteok] fetched {len(jobs)} jobs")
    return jobs


# ═══════════════════════════════════════════════════════════════
#  2. We Work Remotely  (RSS, no auth)
# ═══════════════════════════════════════════════════════════════
def fetch_wwr():
    jobs = []
    feeds = [
        "https://weworkremotely.com/categories/remote-programming-jobs.rss",
        "https://weworkremotely.com/categories/remote-design-jobs.rss",
        "https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss",
    ]
    for feed_url in feeds:
        try:
            parsed = feedparser.parse(feed_url)
        except Exception as e:
            print(f"[wwr] fetch failed for {feed_url}: {e}")
            continue

        for entry in parsed.entries:
            job_id = f"wwr_{entry.get('id', entry.get('link', ''))}"
            title = entry.get("title", "")
            company = title.split(":")[0].strip() if ":" in title else ""
            jobs.append({
                "id": job_id,
                "source": "wwr",
                "title": title,
                "company": company,
                "url": entry.get("link", ""),
                "description": " ".join([title, entry.get("summary", "")]),
                "salary": "",
                "location": "Remote",
                "tags": [],
            })
    print(f"[wwr] fetched {len(jobs)} jobs")
    return jobs


# ═══════════════════════════════════════════════════════════════
#  3. Himalayas.app  (free public API, no auth)
# ═══════════════════════════════════════════════════════════════
def fetch_himalayas():
    jobs = []
    try:
        # Fetch multiple pages (max 20 per page, get up to 100)
        for page in range(1, 6):
            resp = requests.get(
                "https://himalayas.app/jobs/api/search",
                params={"q": "developer", "sort": "recent", "page": page},
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()
            page_jobs = data.get("jobs", [])
            if not page_jobs:
                break
            for j in page_jobs:
                salary = ""
                if j.get("minSalary") and j.get("maxSalary"):
                    currency = j.get("currency", "USD")
                    period = j.get("salaryPeriod", "annual")
                    salary = f"{currency} {j['minSalary']:,} - {j['maxSalary']:,} / {period}"
                elif j.get("minSalary"):
                    salary = f"From {j.get('currency', 'USD')} {j['minSalary']:,}"

                jobs.append({
                    "id": f"himalayas_{j.get('applicationLink', j.get('title', ''))}",
                    "source": "himalayas",
                    "title": j.get("title", ""),
                    "company": j.get("companyName", ""),
                    "url": j.get("applicationLink", ""),
                    "description": " ".join([
                        j.get("title", ""),
                        j.get("excerpt", ""),
                        j.get("description", "")[:500],
                    ]),
                    "salary": salary,
                    "location": ", ".join(j.get("locationRestrictions", [])) or "Worldwide",
                    "tags": j.get("categories", []),
                })
    except Exception as e:
        print(f"[himalayas] fetch failed: {e}")
    print(f"[himalayas] fetched {len(jobs)} jobs")
    return jobs


# ═══════════════════════════════════════════════════════════════
#  4. Remotive  (free public API, no auth)
# ═══════════════════════════════════════════════════════════════
def fetch_remotive():
    jobs = []
    categories = ["software-dev", "design", "product", "customer-support", "marketing"]
    seen_ids = set()

    for cat in categories:
        try:
            resp = requests.get(
                "https://remotive.com/api/remote-jobs",
                params={"category": cat, "limit": 50},
                headers={"User-Agent": "Mozilla/5.0 (job-bot/2.0)"},
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()
            for j in data.get("jobs", []):
                if j["id"] in seen_ids:
                    continue
                seen_ids.add(j["id"])
                # Strip HTML from description
                import re
                desc = re.sub(r"<[^>]+>", " ", j.get("description", ""))
                desc = re.sub(r"\s+", " ", desc).strip()[:500]

                jobs.append({
                    "id": f"remotive_{j['id']}",
                    "source": "remotive",
                    "title": j.get("title", ""),
                    "company": j.get("company_name", ""),
                    "url": j.get("url", ""),
                    "description": f"{j.get('title', '')} {desc}",
                    "salary": j.get("salary", ""),
                    "location": j.get("candidate_required_location", "Worldwide"),
                    "tags": [j.get("category", "")],
                })
        except Exception as e:
            print(f"[remotive] fetch failed for {cat}: {e}")
    print(f"[remotive] fetched {len(jobs)} jobs")
    return jobs


# ═══════════════════════════════════════════════════════════════
#  5. Jobicy  (free public API, no auth)
# ═══════════════════════════════════════════════════════════════
def fetch_jobicy():
    jobs = []
    try:
        resp = requests.get(
            "https://jobicy.com/api/v2/remote-jobs",
            params={"count": 50},
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        for j in data.get("jobs", []):
            salary_min = j.get("annualSalaryMin", "")
            salary_max = j.get("annualSalaryMax", "")
            salary = ""
            if salary_min and salary_max:
                salary = f"${salary_min:,} - ${salary_max:,}"
            elif salary_min:
                salary = f"From ${salary_min:,}"

            jobs.append({
                "id": f"jobicy_{j.get('jobId', '')}",
                "source": "jobicy",
                "title": j.get("jobTitle", ""),
                "company": j.get("companyName", ""),
                "url": j.get("url", ""),
                "description": " ".join([
                    j.get("jobTitle", ""),
                    j.get("jobDescription", "")[:500],
                ]),
                "salary": salary,
                "location": j.get("jobGeo", "Remote"),
                "tags": [j.get("jobIndustry", "")],
            })
    except Exception as e:
        print(f"[jobicy] fetch failed: {e}")
    print(f"[jobicy] fetched {len(jobs)} jobs")
    return jobs


# ═══════════════════════════════════════════════════════════════
#  6. Arbeitnow  (free public API, no auth)
# ═══════════════════════════════════════════════════════════════
def fetch_arbeitnow():
    jobs = []
    try:
        for page in range(1, 4):
            resp = requests.get(
                "https://www.arbeitnow.com/api/job-board-api",
                params={"page": page},
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()
            page_jobs = data.get("data", [])
            if not page_jobs:
                break
            for j in page_jobs:
                jobs.append({
                    "id": f"arbeitnow_{j.get('id', '')}",
                    "source": "arbeitnow",
                    "title": j.get("title", ""),
                    "company": j.get("company_name", ""),
                    "url": j.get("url", ""),
                    "description": " ".join([
                        j.get("title", ""),
                        j.get("description", "")[:500],
                    ]),
                    "salary": "",
                    "location": j.get("location", "Remote"),
                    "tags": j.get("tags", []),
                })
    except Exception as e:
        print(f"[arbeitnow] fetch failed: {e}")
    print(f"[arbeitnow] fetched {len(jobs)} jobs")
    return jobs


# ═══════════════════════════════════════════════════════════════
#  7. Jooble  (needs free API key from jooble.org/api/about)
# ═══════════════════════════════════════════════════════════════
def fetch_jooble():
    jobs = []
    api_key = os.getenv("JOOBLE_API_KEY", "")
    if not api_key:
        print("[jooble] JOOBLE_API_KEY not set, skipping. Get one free at https://jooble.org/api/about")
        return jobs

    try:
        resp = requests.post(
            f"https://jooble.org/api/{api_key}",
            json={"keywords": "web developer frontend backend fullstack react nextjs python", "location": "remote"},
            headers={"Content-Type": "application/json"},
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        for j in data.get("jobs", []):
            jobs.append({
                "id": f"jooble_{j.get('id', '')}",
                "source": "jooble",
                "title": j.get("title", ""),
                "company": j.get("company", ""),
                "url": j.get("link", ""),
                "description": " ".join([
                    j.get("title", ""),
                    j.get("snippet", ""),
                    j.get("description", "")[:500],
                ]),
                "salary": j.get("salary", ""),
                "location": j.get("location", "Remote"),
                "tags": [],
            })
    except Exception as e:
        print(f"[jooble] fetch failed: {e}")
    print(f"[jooble] fetched {len(jobs)} jobs")
    return jobs


# ═══════════════════════════════════════════════════════════════
#  8. Adzuna  (needs free app_id + app_key from developer.adzuna.com)
# ═══════════════════════════════════════════════════════════════
def fetch_adzuna():
    jobs = []
    app_id = os.getenv("ADZUNA_APP_ID", "")
    app_key = os.getenv("ADZUNA_APP_KEY", "")
    if not app_id or not app_key:
        print("[adzuna] ADZUNA_APP_ID / ADZUNA_APP_KEY not set, skipping. Get them free at https://developer.adzuna.com")
        return jobs

    countries = ["us", "gb"]
    for country in countries:
        try:
            resp = requests.get(
                f"https://api.adzuna.com/v1/api/jobs/{country}/search/1",
                params={
                    "app_id": app_id,
                    "app_key": app_key,
                    "results_per_page": 50,
                    "what": "web developer frontend react python",
                    "where": "remote",
                    "content-type": "application/json",
                },
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()
            for j in data.get("results", []):
                jobs.append({
                    "id": f"adzuna_{j.get('id', '')}",
                    "source": "adzuna",
                    "title": j.get("title", ""),
                    "company": j.get("company", {}).get("display_name", ""),
                    "url": j.get("redirect_url", ""),
                    "description": " ".join([
                        j.get("title", ""),
                        j.get("description", "")[:500],
                    ]),
                    "salary": j.get("salary_is_predicted", ""),
                    "location": j.get("location", {}).get("display_name", "Remote"),
                    "tags": [c.get("tag", "") for c in j.get("category", {}).get("label", [])] if isinstance(j.get("category"), dict) else [],
                })
        except Exception as e:
            print(f"[adzuna] fetch failed for {country}: {e}")
    print(f"[adzuna] fetched {len(jobs)} jobs")
    return jobs


# ═══════════════════════════════════════════════════════════════
#  9. RemoteFirstJobs.com  (free public API, no auth)
# ═══════════════════════════════════════════════════════════════
def fetch_remotefirstjobs():
    jobs = []
    categories = ["software-development", "design"]
    seen_ids = set()

    for cat in categories:
        for page in range(0, 3):  # pages 0-2
            try:
                resp = requests.get(
                    "https://remotefirstjobs.com/api/search-jobs",
                    params={"category": cat, "page": page},
                    timeout=15,
                )
                resp.raise_for_status()
                data = resp.json()
                page_jobs = data.get("jobs", [])
                if not page_jobs:
                    break
                for j in page_jobs:
                    job_id = j.get("id", "")
                    if job_id in seen_ids:
                        continue
                    seen_ids.add(job_id)

                    salary = ""
                    if j.get("salary_min") and j.get("salary_max"):
                        salary = f"${j['salary_min']:,} - ${j['salary_max']:,}"
                    elif j.get("salary_min"):
                        salary = f"From ${j['salary_min']:,}"

                    import re
                    desc = re.sub(r"<[^>]+>", " ", j.get("description", ""))
                    desc = re.sub(r"\s+", " ", desc).strip()[:500]

                    locations = j.get("locations", [])
                    location = ", ".join(locations) if locations else "Remote"

                    jobs.append({
                        "id": f"remotefirstjobs_{job_id}",
                        "source": "remotefirstjobs",
                        "title": j.get("title", ""),
                        "company": j.get("company_name", ""),
                        "url": j.get("url", ""),
                        "description": f"{j.get('title', '')} {desc}",
                        "salary": salary,
                        "location": location,
                        "tags": [j.get("category", "")],
                    })
            except Exception as e:
                print(f"[remotefirstjobs] fetch failed for {cat} page {page}: {e}")
    print(f"[remotefirstjobs] fetched {len(jobs)} jobs")
    return jobs


# ═══════════════════════════════════════════════════════════════
#  10. RemoteJobs.org  (free public API, no auth, no key)
# ═══════════════════════════════════════════════════════════════
def fetch_remotejobs_org():
    jobs = []
    categories = ["programming", "design"]

    for cat in categories:
        offset = 0
        for _ in range(3):  # up to 3 pages of 50 per category
            try:
                resp = requests.get(
                    "https://remotejobs.org/api/v1/jobs",
                    params={"category": cat, "limit": 50, "offset": offset},
                    timeout=15,
                )
                resp.raise_for_status()
                data = resp.json()
                page_jobs = data.get("data", [])
                if not page_jobs:
                    break
                for j in page_jobs:
                    salary = j.get("salary_text", "")
                    if not salary and j.get("salary_min") and j.get("salary_max"):
                        salary = f"${j['salary_min']:,} - ${j['salary_max']:,}"

                    company = j.get("company", {})
                    company_name = company.get("name", "") if isinstance(company, dict) else str(company)

                    jobs.append({
                        "id": f"remotejobsorg_{j.get('id', '')}",
                        "source": "remotejobs_org",
                        "title": j.get("title", ""),
                        "company": company_name,
                        "url": j.get("apply_url", j.get("url", "")),
                        "description": " ".join([
                            j.get("title", ""),
                            j.get("description", "")[:500],
                        ]),
                        "salary": salary,
                        "location": j.get("location", "Remote"),
                        "tags": [j.get("category", {}).get("name", "") if isinstance(j.get("category"), dict) else ""],
                    })
                pagination = data.get("pagination", {})
                if not pagination.get("has_more", False):
                    break
                offset += 50
            except Exception as e:
                print(f"[remotejobs_org] fetch failed for {cat}: {e}")
                break
    print(f"[remotejobs_org] fetched {len(jobs)} jobs")
    return jobs


# ═══════════════════════════════════════════════════════════════
#  Source registry — maps source name to fetch function
# ═══════════════════════════════════════════════════════════════
SOURCE_REGISTRY = {
    "remoteok": fetch_remoteok,
    "wwr": fetch_wwr,
    "himalayas": fetch_himalayas,
    "remotive": fetch_remotive,
    "jobicy": fetch_jobicy,
    "arbeitnow": fetch_arbeitnow,
    "remotefirstjobs": fetch_remotefirstjobs,
    "remotejobs_org": fetch_remotejobs_org,
    "jooble": fetch_jooble,
    "adzuna": fetch_adzuna,
}


def fetch_all(enabled_sources: list[str] | None = None):
    """Fetch jobs from all enabled sources.
    
    Args:
        enabled_sources: List of source names to use. If None, uses all registered sources.
    """
    if enabled_sources is None:
        enabled_sources = list(SOURCE_REGISTRY.keys())

    all_jobs = []
    for source_name in enabled_sources:
        if source_name not in SOURCE_REGISTRY:
            print(f"[sources] Unknown source: {source_name}, skipping")
            continue
        try:
            source_jobs = SOURCE_REGISTRY[source_name]()
            all_jobs.extend(source_jobs)
        except Exception as e:
            print(f"[sources] Error fetching {source_name}: {e}")

    return all_jobs
