"""
Phishing Feature & Heuristic Extractor for PhishGuard.
Detects urgency triggers, credential harvesting lures, OTP requests,
financial scam patterns, sender anomalies, and embedded URL threats.
"""

import re
from url_analyzer import extract_urls, analyze_url

# Keyword & Regex patterns categorized by threat vector
INDICATOR_PATTERNS = {
    "urgent_language": {
        "title": "Urgent or Threatening Language",
        "severity": "High",
        "patterns": [
            r"\b(?:urgent|immediately|immediate action required|action required)\b",
            r"\b(?:within 24 hours|within 48 hours|in 15 minutes|today only)\b",
            r"\b(?:account (?:will be|has been) (?:suspended|restricted|closed|terminated|locked))\b",
            r"\b(?:final warning|critical security alert|unauthorized login attempts?)\b",
            r"\b(?:legal action|penalties|failure to validate)\b",
            r"\b(?:asap|respond immediately|time sensitive)\b"
        ],
        "explanation": "Threat actors manufacture artificial urgency to panic victims into acting impulsively before verifying authenticity."
    },
    "fake_login": {
        "title": "Fake Login & Credential Harvesting",
        "severity": "High",
        "patterns": [
            r"\b(?:verify your (?:credentials|identity|account|details))\b",
            r"\b(?:sign in with your (?:corporate|email|work|google|microsoft) password)\b",
            r"\b(?:login here|log in to confirm|re-enter your password|update your billing)\b",
            r"\b(?:authenticate your|validate your username and password)\b",
            r"\b(?:view document now by authenticating|sign in to review)\b",
            r"\b(?:restore your account access|confirm your password)\b"
        ],
        "explanation": "Direct requests to enter authentication credentials, frequently leading to credential-harvesting phishing proxy pages."
    },
    "password_otp": {
        "title": "Password, PIN or OTP Solicitation",
        "severity": "High",
        "patterns": [
            r"\b(?:otp|one-time password|verification code|pin code)\b",
            r"\b(?:recovery (?:seed|phrase)|private key|security code)\b",
            r"\b(?:social security number|ssn|card number and cvv|passport scan)\b",
            r"\b(?:enter your current password and phone verification code)\b",
            r"\b(?:send your (?:cell|mobile) number)\b"
        ],
        "explanation": "Legitimate organizations never solicit passwords, PINs, or Multi-Factor Authentication (MFA) OTP codes over unverified email."
    },
    "financial_scams": {
        "title": "Financial Scam & Wire Fraud Keywords",
        "severity": "High",
        "patterns": [
            r"\b(?:wire transfer|confidential wire transfer|remit payment)\b",
            r"\b(?:unclaimed (?:tax )?refund|tax return|inheritance fund)\b",
            r"\b(?:lottery|cash prize|won \$|jackpot|mega lottery)\b",
            r"\b(?:western union|moneygram|escrow account|bitcoin wallet)\b",
            r"\b(?:unusual withdrawal detected|unauthorized transaction)\b",
            r"\b(?:redelivery fee|processing fee|customs clearance fee)\b"
        ],
        "explanation": "Commonly associated with Advance Fee Fraud (419 scams), Business Email Compromise (BEC), or fraudulent invoice redirection."
    },
    "suspicious_sender": {
        "title": "Suspicious Sender or Impersonation Patterns",
        "severity": "Medium",
        "patterns": [
            r"\b(?:dear customer|dear user|dear client|dear employee|undisclosed recipients)\b",
            r"\b(?:from: ceo|executive office|it helpdesk|human resources department)\b",
            r"\b(?:are you at your desk|i am in a board meeting|cannot take calls)\b",
            r"\b(?:kindly reply|kindly update|do the needful)\b"
        ],
        "explanation": "Generic impersonal greetings and executive authority impersonation tactics designed to bypass conventional scrutiny."
    }
}

def extract_features_and_indicators(text: str) -> dict:
    """
    Extracts heuristic threat indicators, computes heuristic risk score,
    and identifies exact string tokens to highlight in the UI.
    """
    indicators = []
    highlight_spans = []
    matched_categories = set()
    category_counts = {}

    lower_text = text.lower()

    # 1. Regex Heuristic Indicators
    for cat_key, info in INDICATOR_PATTERNS.items():
        found_matches = []
        for pattern_str in info["patterns"]:
            pattern = re.compile(pattern_str, re.IGNORECASE)
            for m in pattern.finditer(text):
                match_text = m.group()
                if match_text not in found_matches:
                    found_matches.append(match_text)
                highlight_spans.append({
                    "start": m.start(),
                    "end": m.end(),
                    "text": match_text,
                    "category": cat_key
                })

        if found_matches:
            matched_categories.add(cat_key)
            category_counts[cat_key] = len(found_matches)
            indicators.append({
                "id": cat_key,
                "title": info["title"],
                "severity": info["severity"],
                "matches": found_matches[:6],
                "explanation": info["explanation"],
                "count": len(found_matches)
            })

    # 2. URL Analysis
    raw_urls = extract_urls(text)
    url_results = []
    high_risk_urls = 0
    shortened_urls = 0
    ip_urls = 0

    for u in raw_urls:
        res = analyze_url(u)
        url_results.append(res)
        if res["risk_score"] >= 60:
            high_risk_urls += 1
        for finding in res["findings"]:
            if finding["code"] == "IP_HOSTNAME":
                ip_urls += 1
            if finding["code"] == "URL_SHORTENER":
                shortened_urls += 1

    if raw_urls:
        worst_url_score = max([r["risk_score"] for r in url_results], default=0)
        if high_risk_urls > 0 or worst_url_score >= 50:
            indicators.append({
                "id": "suspicious_urls",
                "title": f"Suspicious Links Detected ({len(raw_urls)} URL{'s' if len(raw_urls) > 1 else ''})",
                "severity": "High" if high_risk_urls > 0 else "Medium",
                "matches": [r["url"] for r in url_results if r["risk_score"] >= 40][:4],
                "explanation": f"Identified {len(raw_urls)} embedded link(s). {high_risk_urls} exhibit severe phishing indicators such as low-reputation TLDs, IP hostnames, or deceptive paths.",
                "count": len(raw_urls)
            })
        elif len(raw_urls) > 0:
            indicators.append({
                "id": "legit_urls",
                "title": f"Standard Embedded Link(s) ({len(raw_urls)})",
                "severity": "Low",
                "matches": [r["url"] for r in url_results][:3],
                "explanation": "URLs analyzed conform to legitimate domains and protocols.",
                "count": len(raw_urls)
            })

    # 3. Compute Structured Heuristic Score (0 - 100)
    score = 0
    if "urgent_language" in matched_categories:
        score += min(30, category_counts["urgent_language"] * 12)
    if "fake_login" in matched_categories:
        score += min(35, category_counts["fake_login"] * 18)
    if "password_otp" in matched_categories:
        score += min(35, category_counts["password_otp"] * 20)
    if "financial_scams" in matched_categories:
        score += min(30, category_counts["financial_scams"] * 15)
    if "suspicious_sender" in matched_categories:
        score += min(20, category_counts["suspicious_sender"] * 10)

    if high_risk_urls > 0:
        score += min(40, high_risk_urls * 25)
    if ip_urls > 0:
        score += 30
    if shortened_urls > 0:
        score += 15

    heuristic_risk_score = min(100, max(0, score))

    return {
        "indicators": indicators,
        "matched_categories": list(matched_categories),
        "heuristic_risk_score": heuristic_risk_score,
        "url_analysis": url_results,
        "urls_detected_count": len(raw_urls),
        "highlight_spans": highlight_spans
    }
