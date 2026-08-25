"""
Edit this file to tune what jobs the bot looks for.
No need to touch any other file for day-to-day tweaking.
"""

# ── Job Sources ──────────────────────────────────────────────
# Enable/disable sources here. Remove a source to stop fetching from it.
# ✅ Sources that work immediately (no API key needed):
#    remoteok, wwr, himalayas, remotive, jobicy, arbeitnow, remotefirstjobs, remotejobs_org
# 🔑 Sources that need an API key (get free keys, then add to ENABLED_SOURCES):
#    jooble (https://jooble.org/api/about)
#    adzuna (https://developer.adzuna.com)
ENABLED_SOURCES = [
    "remoteok",          # RemoteOK - no key needed
    "wwr",               # We Work Remotely - no key needed
    "himalayas",         # Himalayas.app - no key needed
    "remotive",          # Remotive - no key needed
    "remotefirstjobs",   # RemoteFirstJobs.com - no key needed
    "remotejobs_org",    # RemoteJobs.org - no key needed
]

# ── Keywords ─────────────────────────────────────────────────
# Keywords that MUST appear (case-insensitive) for a job to be considered a match.
# A job matches if it contains AT LEAST ONE of these in its title or description.
MATCH_KEYWORDS = [
    # Core roles
    "web developer",
    "web development",
    "frontend developer",
    "front-end developer",
    "backend developer",
    "back-end developer",
    "full stack",
    "fullstack",
    "full-stack",
    # Frameworks & tools
    "react developer",
    "react",
    "next.js",
    "nextjs",
    "vue",
    "nuxt",
    "angular",
    "node.js",
    "nodejs",
    "python developer",
    "python",
    "fastapi",
    "django",
    "flask",
    "typescript",
    "javascript",
    # Design
    "ui designer",
    "ui/ux",
    "product designer",
    "figma",
    # General
    "software engineer",
    "software developer",
    "devops",
    "cloud engineer",
]

# If a job contains any of these, it gets excluded even if it matched above.
EXCLUDE_KEYWORDS = [
    "senior",
    "10+ years",
    "8+ years",
    "wordpress only",
    "no code",
    "unpaid",
    "internship",
    "junior",       # remove this if you want junior roles
    "lead",
    "principal",
    "staff",
    "director",
    "vp of",
]

# Minimum keyword matches before a job is considered "high priority" (sent first / flagged)
HIGH_PRIORITY_THRESHOLD = 2

# ── Scheduling ───────────────────────────────────────────────
# How far back to look on each run (in hours) - avoids re-scanning ancient listings
LOOKBACK_HOURS = 48

# How often the scheduler runs (in hours)
RUN_INTERVAL_HOURS = 6
