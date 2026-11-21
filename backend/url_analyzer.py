"""
URL Security Engine for PhishGuard.
Performs safe, non-invasive heuristic and lexical inspection on URLs.
Strictly offline/passive: does NOT make outgoing HTTP requests or resolve domains.
"""

import re
import math
from urllib.parse import urlparse

# Suspicious TLDs frequently associated with phishing campaigns
SUSPICIOUS_TLDS = {
    "xyz", "top", "buzz", "club", "icu", "ru", "cc", "work", "online",
    "site", "click", "link", "biz", "info", "bid", "monster", "cfd", "rest"
}

# Known URL shortener services
SHORTENER_DOMAINS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "ow.ly",
    "buff.ly", "rebrand.ly", "cutt.ly", "shorte.st"
}

# High-risk keywords commonly found in phishing URLs
PHISHING_KEYWORDS = [
    "login", "signin", "verify", "verification", "secure", "security",
    "account", "banking", "authenticate", "auth", "confirm", "recovery",
    "update", "billing", "password", "credential", "suspend", "unlock",
    "wallet", "claim", "refund", "paypal", "microsoft", "office365",
    "appleid", "google", "amazon", "netflix", "wellsfargo", "coinbase"
]

# Regex for IPv4 hostnames
IP_PATTERN = re.compile(r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")

# Regex for extracting URLs from raw text
URL_REGEX = re.compile(
    r"""(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))""",
    re.VERBOSE
)

def calculate_entropy(string: str) -> float:
    """Calculates Shannon entropy of a string."""
    if not string:
        return 0.0
    prob = [float(string.count(c)) / len(string) for c in dict.fromkeys(list(string))]
    entropy = -sum([p * math.log(p) / math.log(2.0) for p in prob])
    return round(entropy, 2)

def extract_urls(text: str) -> list[str]:
    """Extracts unique URLs from text."""
    if not text:
        return []
    matches = URL_REGEX.findall(text)
    urls = []
    for match in matches:
        raw_url = match[0]
        if not raw_url.startswith("http://") and not raw_url.startswith("https://"):
            raw_url = "http://" + raw_url
        if raw_url not in urls:
            urls.append(raw_url)
    return urls

def analyze_url(url: str) -> dict:
    """
    Performs comprehensive, passive security inspection of a single URL.
    Returns risk score (0-100), classification, and identified risk factors.
    """
    normalized_url = url.strip()
    if not normalized_url.startswith("http://") and not normalized_url.startswith("https://"):
        normalized_url = "http://" + normalized_url

    try:
        parsed = urlparse(normalized_url)
    except Exception:
        return {
            "url": url,
            "risk_score": 85,
            "classification": "Dangerous",
            "findings": ["Malformed URL syntax detected"]
        }

    hostname = (parsed.hostname or "").lower()
    path = (parsed.path or "").lower()
    query = (parsed.query or "").lower()
    full_target = f"{hostname}{path}{query}"

    findings = []
    risk_score = 0

    # 1. IP address instead of domain name
    if IP_PATTERN.match(hostname):
        risk_score += 45
        findings.append({
            "code": "IP_HOSTNAME",
            "severity": "High",
            "description": f"Direct IP address used as hostname ({hostname}), commonly used in malicious servers."
        })

    # 2. Suspicious / Low-reputation TLD
    parts = hostname.split(".")
    tld = parts[-1] if len(parts) > 1 else ""
    if tld in SUSPICIOUS_TLDS:
        risk_score += 30
        findings.append({
            "code": "SUSPICIOUS_TLD",
            "severity": "Medium",
            "description": f"Domain utilizes a high-risk TLD (.{tld}) with elevated phishing frequency."
        })

    # 3. Known URL Shortener
    if hostname in SHORTENER_DOMAINS:
        risk_score += 25
        findings.append({
            "code": "URL_SHORTENER",
            "severity": "Medium",
            "description": f"URL shortener ({hostname}) masks the real final destination."
        })

    # 4. Insecure protocol with sensitive targets
    if parsed.scheme == "http" and any(k in full_target for k in ["login", "auth", "account", "banking", "verify", "pay"]):
        risk_score += 30
        findings.append({
            "code": "INSECURE_AUTH",
            "severity": "High",
            "description": "Unencrypted HTTP protocol used on authentication or payment endpoint."
        })

    # 5. Phishing keywords in path or subdomain
    detected_keywords = [k for k in PHISHING_KEYWORDS if k in full_target]
    if detected_keywords:
        weight = min(40, len(detected_keywords) * 15)
        risk_score += weight
        findings.append({
            "code": "SUSPICIOUS_PATH_KEYWORDS",
            "severity": "High" if weight >= 30 else "Medium",
            "description": f"Contains security-sensitive lure keywords: {', '.join(detected_keywords[:4])}."
        })

    # 6. Excessive subdomains
    if len(parts) >= 4 and not IP_PATTERN.match(hostname):
        risk_score += 20
        findings.append({
            "code": "EXCESSIVE_SUBDOMAINS",
            "severity": "Medium",
            "description": f"High number of subdomain layers ({len(parts)} segments), a common brand-spoofing tactic."
        })

    # 7. High entropy (randomized DGA string)
    domain_label = parts[0] if parts else ""
    entropy = calculate_entropy(domain_label)
    if len(domain_label) > 12 and entropy > 3.6:
        risk_score += 20
        findings.append({
            "code": "HIGH_ENTROPY",
            "severity": "Medium",
            "description": f"High character entropy ({entropy}) indicates algorithmically generated or obfuscated domain."
        })

    # 8. Suspicious hyphens / brand mimicry
    if "-" in hostname and any(brand in hostname for brand in ["paypal", "apple", "google", "microsoft", "amazon", "netflix", "chase", "bank"]):
        risk_score += 35
        findings.append({
            "code": "BRAND_SPOOF_DOMAIN",
            "severity": "High",
            "description": f"Hyphenated brand impersonation pattern detected in host '{hostname}'."
        })

    # Cap risk score between 0 and 100
    risk_score = min(100, max(0, risk_score))

    if risk_score >= 65:
        classification = "Dangerous"
    elif risk_score >= 30:
        classification = "Suspicious"
    else:
        classification = "Safe"

    return {
        "url": url,
        "hostname": hostname,
        "protocol": parsed.scheme or "http",
        "tld": tld,
        "entropy": entropy,
        "risk_score": risk_score,
        "classification": classification,
        "findings": findings
    }
