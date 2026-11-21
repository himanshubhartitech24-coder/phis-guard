"""
SQLite Database Layer for PhishGuard.
Manages scan history, analytics aggregations, and seed demo records.
"""

import sqlite3
import json
import os
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "phishguard.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database schema and seeds initial demonstration history if empty."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS email_scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            subject TEXT,
            sender TEXT,
            preview_text TEXT NOT NULL,
            raw_text TEXT NOT NULL,
            classification TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            confidence REAL NOT NULL,
            indicators_json TEXT,
            urls_json TEXT,
            explanation TEXT
        )
    """)
    conn.commit()

    # Check if empty, then seed realistic demo scans so Dashboard looks ready immediately
    cursor.execute("SELECT COUNT(*) FROM email_scans")
    count = cursor.fetchone()[0]
    if count == 0:
        seed_demo_data(cursor, conn)

    conn.close()

def seed_demo_data(cursor, conn):
    """Seeds historical records spanning the last 7 days."""
    now = datetime.now()
    demo_records = [
        (
            (now - timedelta(days=6, hours=3)).strftime("%Y-%m-%d %H:%M:%S"),
            "Critical Security Alert: PayPal Account Limited",
            "support@paypal-sec-verify.xyz",
            "URGENT: Your PayPal account has been temporarily restricted due to unauthorized login attempts...",
            "URGENT: Your PayPal account has been temporarily restricted due to unauthorized login attempts. You must confirm your identity within 24 hours: http://paypal-security-update-center.com/login?token=8923",
            "Phishing",
            94,
            96.8,
            json.dumps([{"title": "Urgent Language", "severity": "High"}, {"title": "Fake Login", "severity": "High"}, {"title": "Suspicious Links", "severity": "High"}]),
            json.dumps(["http://paypal-security-update-center.com/login?token=8923"]),
            "Malicious credentials harvesting campaign impersonating PayPal with urgent panic lure."
        ),
        (
            (now - timedelta(days=5, hours=7)).strftime("%Y-%m-%d %H:%M:%S"),
            "Sprint Planning & Retrospective Agenda",
            "dev-lead@company.internal",
            "Hi team, Hope everyone had a great weekend. Please find the agenda for tomorrow's sprint planning meeting...",
            "Hi team, Hope everyone had a great weekend. Please find the agenda for tomorrow's sprint planning meeting attached. See you at 10:00 AM on Google Meet: https://meet.google.com/abc-defg-hij",
            "Safe",
            8,
            94.5,
            json.dumps([]),
            json.dumps(["https://meet.google.com/abc-defg-hij"]),
            "Standard internal collaboration communication with verified enterprise domains."
        ),
        (
            (now - timedelta(days=4, hours=1)).strftime("%Y-%m-%d %H:%M:%S"),
            "Overdue Invoice #INV-8891 Attached",
            "billing@global-invoice-hub.net",
            "Dear Customer, Attached is your outstanding invoice from last month. Please review and remit payment...",
            "Dear Customer, Attached is your outstanding invoice from last month. Please review the details and remit payment to avoid late penalties: http://invoice-viewer-redirect.net/pay?id=88291",
            "Suspicious",
            58,
            82.0,
            json.dumps([{"title": "Unsolicited Invoice", "severity": "Medium"}, {"title": "Generic Greeting", "severity": "Medium"}]),
            json.dumps(["http://invoice-viewer-redirect.net/pay?id=88291"]),
            "Vague billing notice with external redirect link and generic recipient salutation."
        ),
        (
            (now - timedelta(days=3, hours=5)).strftime("%Y-%m-%d %H:%M:%S"),
            "Immediate Action: Microsoft 365 License Deactivation",
            "admin@192.168.1.105",
            "Final Warning: Your Microsoft Office 365 license has expired. All your files will be deleted...",
            "Final Warning: Your Microsoft Office 365 license has expired. All your OneDrive files and Outlook emails will be deleted today. Update your password now: http://192.168.1.105/ms-office/login.php",
            "Phishing",
            98,
            98.5,
            json.dumps([{"title": "Urgent Language", "severity": "High"}, {"title": "Password Solicitation", "severity": "High"}, {"title": "IP Hostname URL", "severity": "High"}]),
            json.dumps(["http://192.168.1.105/ms-office/login.php"]),
            "Credential harvesting lure hosted on direct raw IP endpoint utilizing deletion scare tactics."
        ),
        (
            (now - timedelta(days=2, hours=4)).strftime("%Y-%m-%d %H:%M:%S"),
            "GitHub: Pull Request #142 Merged",
            "notifications@github.com",
            "User @sarah-dev has merged pull request #142 into main: feat: add rate limiting middleware...",
            "User @sarah-dev has merged pull request #142 into main. View changes at https://github.com/company/api-gateway/pull/142",
            "Safe",
            5,
            97.0,
            json.dumps([]),
            json.dumps(["https://github.com/company/api-gateway/pull/142"]),
            "Legitimate automated developer activity update from verified GitHub infrastructure."
        ),
        (
            (now - timedelta(days=1, hours=8)).strftime("%Y-%m-%d %H:%M:%S"),
            "Exclusive 85% Discount Voucher - Limited Stock",
            "promos@daily-super-deals.shop",
            "You have been selected for an 85% discount on top brand watches and electronics...",
            "You have been selected for an 85% discount on top brand watches and electronics. Limited stock remaining. Click here: http://daily-super-deals.shop/promo",
            "Suspicious",
            62,
            78.4,
            json.dumps([{"title": "Promotional Lure", "severity": "Medium"}, {"title": "Suspicious TLD", "severity": "Medium"}]),
            json.dumps(["http://daily-super-deals.shop/promo"]),
            "Unsolicited spam campaign utilizing deceptive discount promises on low-reputation .shop TLD."
        ),
        (
            (now - timedelta(hours=3)).strftime("%Y-%m-%d %H:%M:%S"),
            "Urgent Wire Transfer Request",
            "ceo-office@company-corp-secure.top",
            "Are you at your desk? I am in a board meeting and cannot take calls. I need you to immediately process a confidential wire...",
            "Are you at your desk? I am in a board meeting and cannot take calls. I need you to immediately process a confidential wire transfer of $24,500 to our vendor.",
            "Phishing",
            91,
            93.2,
            json.dumps([{"title": "Executive Impersonation", "severity": "High"}, {"title": "Financial Wire Transfer", "severity": "High"}, {"title": "Urgency", "severity": "High"}]),
            json.dumps([]),
            "Classic CEO Fraud (Business Email Compromise) attempting unauthorized immediate funds transfer."
        )
    ]

    cursor.executemany("""
        INSERT INTO email_scans (
            timestamp, subject, sender, preview_text, raw_text,
            classification, risk_score, confidence, indicators_json,
            urls_json, explanation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, demo_records)
    conn.commit()

def save_scan(data: dict) -> int:
    """Inserts a new scan record and returns the new ID."""
    conn = get_db_connection()
    cursor = conn.cursor()

    preview = data.get("preview_text", "")
    if not preview and data.get("raw_text"):
        preview = data["raw_text"][:140].replace("\n", " ").strip() + ("..." if len(data["raw_text"]) > 140 else "")

    cursor.execute("""
        INSERT INTO email_scans (
            timestamp, subject, sender, preview_text, raw_text,
            classification, risk_score, confidence, indicators_json,
            urls_json, explanation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        data.get("subject", "Unspecified Subject"),
        data.get("sender", "Unknown Sender"),
        preview,
        data.get("raw_text", ""),
        data.get("classification", "Safe"),
        data.get("risk_score", 0),
        data.get("confidence", 0.0),
        json.dumps(data.get("indicators", [])),
        json.dumps([u.get("url") if isinstance(u, dict) else u for u in data.get("url_analysis", [])]),
        data.get("explanation", "")
    ))

    scan_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return scan_id

def get_history(limit=50, offset=0, filter_type=None, search=None):
    """Retrieves paginated scan history with optional filters."""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM email_scans WHERE 1=1"
    params = []

    if filter_type and filter_type.lower() != "all":
        query += " AND LOWER(classification) = LOWER(?)"
        params.append(filter_type)

    if search:
        query += " AND (subject LIKE ? OR preview_text LIKE ? OR sender LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term])

    query += " ORDER BY id DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor.execute(query, params)
    rows = cursor.fetchall()

    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "timestamp": r["timestamp"],
            "subject": r["subject"],
            "sender": r["sender"],
            "preview_text": r["preview_text"],
            "classification": r["classification"],
            "risk_score": r["risk_score"],
            "confidence": r["confidence"],
            "indicators": json.loads(r["indicators_json"] or "[]"),
            "urls": json.loads(r["urls_json"] or "[]"),
            "explanation": r["explanation"]
        })

    cursor.execute("SELECT COUNT(*) FROM email_scans")
    total_count = cursor.fetchone()[0]

    conn.close()
    return {"items": results, "total": total_count}

def get_scan_by_id(scan_id: int):
    """Fetches full details of a specific scan."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM email_scans WHERE id = ?", (scan_id,))
    r = cursor.fetchone()
    conn.close()
    if not r:
        return None
    return {
        "id": r["id"],
        "timestamp": r["timestamp"],
        "subject": r["subject"],
        "sender": r["sender"],
        "preview_text": r["preview_text"],
        "raw_text": r["raw_text"],
        "classification": r["classification"],
        "risk_score": r["risk_score"],
        "confidence": r["confidence"],
        "indicators": json.loads(r["indicators_json"] or "[]"),
        "urls": json.loads(r["urls_json"] or "[]"),
        "explanation": r["explanation"]
    }

def delete_scan(scan_id: int) -> bool:
    """Deletes a single scan by ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM email_scans WHERE id = ?", (scan_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def clear_history() -> bool:
    """Deletes all scan records."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM email_scans")
    conn.commit()
    conn.close()
    return True

def get_dashboard_stats():
    """Calculates summary statistics and chart series for the Dashboard & Analytics."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM email_scans")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM email_scans WHERE classification = 'Safe'")
    safe_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM email_scans WHERE classification = 'Phishing'")
    phishing_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM email_scans WHERE classification = 'Suspicious'")
    suspicious_count = cursor.fetchone()[0]

    cursor.execute("SELECT AVG(risk_score) FROM email_scans")
    avg_risk = cursor.fetchone()[0] or 0.0

    cursor.execute("SELECT AVG(confidence) FROM email_scans")
    avg_confidence = cursor.fetchone()[0] or 0.0

    # Recent scans (up to 6)
    cursor.execute("SELECT id, timestamp, subject, classification, risk_score, confidence FROM email_scans ORDER BY id DESC LIMIT 6")
    recent_rows = cursor.fetchall()
    recent_scans = [
        {
            "id": r["id"],
            "timestamp": r["timestamp"],
            "subject": r["subject"],
            "classification": r["classification"],
            "risk_score": r["risk_score"],
            "confidence": r["confidence"]
        }
        for r in recent_rows
    ]

    # Attack vector breakdown by tallying indicators
    cursor.execute("SELECT indicators_json FROM email_scans")
    indicator_tally = {
        "Urgent Language": 0,
        "Fake Login": 0,
        "Password & OTP": 0,
        "Financial Scams": 0,
        "Suspicious URLs": 0,
        "Sender Impersonation": 0
    }
    for row in cursor.fetchall():
        if row[0]:
            try:
                items = json.loads(row[0])
                for itm in items:
                    t = itm.get("title", "")
                    if "Urgent" in t:
                        indicator_tally["Urgent Language"] += 1
                    elif "Login" in t or "Credential" in t:
                        indicator_tally["Fake Login"] += 1
                    elif "OTP" in t or "Password" in t:
                        indicator_tally["Password & OTP"] += 1
                    elif "Financial" in t or "Wire" in t or "Voucher" in t:
                        indicator_tally["Financial Scams"] += 1
                    elif "Link" in t or "URL" in t:
                        indicator_tally["Suspicious URLs"] += 1
                    elif "Sender" in t or "Impersonation" in t or "Greeting" in t:
                        indicator_tally["Sender Impersonation"] += 1
            except Exception:
                pass

    conn.close()

    return {
        "total_scans": total,
        "safe_count": safe_count,
        "phishing_count": phishing_count,
        "suspicious_count": suspicious_count,
        "avg_risk_score": round(avg_risk, 1),
        "avg_confidence": round(avg_confidence, 1),
        "distribution": {
            "safe": safe_count,
            "suspicious": suspicious_count,
            "phishing": phishing_count
        },
        "attack_vectors": indicator_tally,
        "recent_scans": recent_scans
    }
