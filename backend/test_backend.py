"""
Test suite for PhishGuard Backend.
Validates ML model inference, feature extraction, URL engine, and API routes.
"""

import unittest
import json
from app import app
from model import classifier
from url_analyzer import analyze_url, extract_urls
import database

class PhishGuardBackendTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_health_check(self):
        response = self.app.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["status"], "healthy")
        self.assertTrue(data["model_loaded"])

    def test_phishing_email_detection(self):
        phish_text = (
            "URGENT: Your PayPal account has been suspended! You must verify your password "
            "and enter your OTP within 24 hours at http://192.168.1.1/login or your account "
            "will be closed permanently."
        )
        res = classifier.predict(phish_text)
        self.assertEqual(res["classification"], "Phishing")
        self.assertGreaterEqual(res["risk_score"], 70)
        self.assertTrue(len(res["indicators"]) > 0)
        self.assertTrue(any(ind["id"] == "urgent_language" for ind in res["indicators"]))

    def test_safe_email_detection(self):
        safe_text = (
            "Hi team, Here is the weekly project update. The release is scheduled for Friday. "
            "Please review the PR on GitHub when you have a chance: https://github.com/company/repo/pull/12"
        )
        res = classifier.predict(safe_text)
        self.assertEqual(res["classification"], "Safe")
        self.assertLess(res["risk_score"], 35)

    def test_suspicious_email_detection(self):
        suspicious_text = (
            "Dear Customer, Please find attached your overdue invoice. Remit payment today at "
            "http://invoice-link.biz/pay to prevent late penalties."
        )
        res = classifier.predict(suspicious_text)
        self.assertIn(res["classification"], ["Suspicious", "Phishing"])
        self.assertGreaterEqual(res["risk_score"], 35)

    def test_url_analyzer(self):
        # Malicious IP URL
        url_res = analyze_url("http://192.168.1.50/paypal/login.php")
        self.assertEqual(url_res["classification"], "Dangerous")
        self.assertGreaterEqual(url_res["risk_score"], 65)

        # Safe URL
        safe_url_res = analyze_url("https://github.com/torvalds/linux")
        self.assertEqual(safe_url_res["classification"], "Safe")
        self.assertLess(safe_url_res["risk_score"], 25)

    def test_api_analyze_endpoint(self):
        payload = {
            "subject": "Urgent Security Verification",
            "sender": "sec-alert@paypal-update.xyz",
            "text": "Your account has been restricted. Sign in with your password immediately to unlock."
        }
        response = self.app.post(
            "/api/analyze",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn("classification", data)
        self.assertIn("risk_score", data)
        self.assertIn("id", data)

    def test_api_stats_endpoint(self):
        response = self.app.get("/api/stats")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn("total_scans", data)
        self.assertIn("distribution", data)

    def test_api_history_endpoint(self):
        response = self.app.get("/api/history")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn("items", data)
        self.assertIn("total", data)

if __name__ == "__main__":
    unittest.main()
