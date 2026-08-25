from config import MATCH_KEYWORDS, EXCLUDE_KEYWORDS, HIGH_PRIORITY_THRESHOLD


def score_job(job: dict) -> int:
    """Returns number of matched keywords. 0 means no match."""
    text = (job.get("title", "") + " " + job.get("description", "")).lower()

    for exclude in EXCLUDE_KEYWORDS:
        if exclude.lower() in text:
            return 0

    matches = sum(1 for kw in MATCH_KEYWORDS if kw.lower() in text)
    return matches


def filter_and_rank(jobs: list) -> list:
    """Returns jobs that matched at least one keyword, sorted best-match first."""
    scored = []
    for job in jobs:
        score = score_job(job)
        if score > 0:
            job["score"] = score
            job["high_priority"] = score >= HIGH_PRIORITY_THRESHOLD
            scored.append(job)

    scored.sort(key=lambda j: j["score"], reverse=True)
    return scored
