"""
Machine Learning Classifier & Hybrid Threat Scoring for PhishGuard.
Uses Scikit-Learn TF-IDF vectorization combined with calibrated classification
and heuristic indicator fusion.
"""

import os
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from dataset import TRAINING_DATA
from feature_extractor import extract_features_and_indicators

MODEL_FILE = os.path.join(os.path.dirname(__file__), "phishguard_model.joblib")

class PhishGuardClassifier:
    def __init__(self):
        self.model = None
        self.classes_ = ["safe", "suspicious", "phishing"]
        self.load_or_train()

    def train(self):
        """Trains the ML pipeline on the curated training dataset."""
        texts = [item["text"] for item in TRAINING_DATA]
        labels = [item["label"] for item in TRAINING_DATA]

        pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                sublinear_tf=True,
                stop_words="english",
                max_features=3000
            )),
            ("clf", LogisticRegression(
                C=2.5,
                max_iter=1000,
                random_state=42,
                class_weight="balanced"
            ))
        ])

        pipeline.fit(texts, labels)
        self.model = pipeline
        joblib.dump(self.model, MODEL_FILE)
        return True

    def load_or_train(self):
        """Loads saved model if available, else trains fresh."""
        if os.path.exists(MODEL_FILE):
            try:
                self.model = joblib.load(MODEL_FILE)
                return
            except Exception:
                pass
        self.train()

    def predict(self, text: str) -> dict:
        """
        Analyzes an email text string.
        Combines TF-IDF machine learning prediction with heuristic extraction
        to yield a robust, calibrated risk assessment.
        """
        if not text or not text.strip():
            return {
                "classification": "Safe",
                "risk_score": 0,
                "confidence": 100.0,
                "probabilities": {"safe": 100.0, "suspicious": 0.0, "phishing": 0.0},
                "indicators": [],
                "explanation": "Empty email content analyzed.",
                "recommended_actions": ["No action required for empty text."],
                "url_analysis": [],
                "highlight_spans": []
            }

        # 1. Feature & Heuristic Extraction
        heuristics = extract_features_and_indicators(text)
        h_score = heuristics["heuristic_risk_score"]

        # 2. ML Prediction Probabilities
        probs = self.model.predict_proba([text])[0]
        class_prob_map = dict(zip(self.model.classes_, probs))

        prob_safe = float(class_prob_map.get("safe", 0.0))
        prob_suspicious = float(class_prob_map.get("suspicious", 0.0))
        prob_phishing = float(class_prob_map.get("phishing", 0.0))

        # 3. Hybrid Risk Fusion (0 to 100)
        # ML predicted risk factor: phishing is 1.0 weight, suspicious is 0.5 weight
        ml_risk_raw = (prob_phishing * 100.0) + (prob_suspicious * 50.0)
        
        # Weighted combination: 55% ML + 45% Heuristics
        combined_risk = (0.55 * ml_risk_raw) + (0.45 * h_score)

        # Strongly penalize credential harvesting or IP-based URLs
        if h_score >= 60:
            combined_risk = max(combined_risk, 72.0)
        elif h_score >= 35:
            combined_risk = max(combined_risk, 45.0)

        risk_score = int(round(min(100.0, max(0.0, combined_risk))))

        # 4. Final Classification
        if risk_score >= 68:
            classification = "Phishing"
            confidence = round(max(prob_phishing * 100.0, 75.0 + (risk_score - 68) * 0.7), 1)
        elif risk_score >= 35:
            classification = "Suspicious"
            confidence = round(max(prob_suspicious * 100.0, 70.0 + (risk_score - 35) * 0.5), 1)
        else:
            classification = "Safe"
            confidence = round(max(prob_safe * 100.0, 85.0 - (risk_score * 0.4)), 1)

        confidence = min(99.8, max(55.0, confidence))

        # 5. Build Contextual Explanation
        explanation_points = []
        if classification == "Phishing":
            explanation_points.append("This email demonstrates strong malicious intent matching known phishing attack vectors.")
            if heuristics["urls_detected_count"] > 0:
                explanation_points.append(f"Contains {heuristics['urls_detected_count']} embedded links, including suspicious or masked endpoints.")
            if "urgent_language" in heuristics["matched_categories"]:
                explanation_points.append("Utilizes high-pressure urgency cues designed to trigger panic and hasty compliance.")
            if "fake_login" in heuristics["matched_categories"] or "password_otp" in heuristics["matched_categories"]:
                explanation_points.append("Directly attempts to harvest confidential authentication credentials, OTPs, or passwords.")
            if "financial_scams" in heuristics["matched_categories"]:
                explanation_points.append("Exhibits wire fraud, fake prize/refund, or advance fee scam semantics.")
        elif classification == "Suspicious":
            explanation_points.append("This email contains anomalous characteristics that warrant caution before interacting.")
            if heuristics["urls_detected_count"] > 0:
                explanation_points.append("Embedded links should be carefully examined before clicking.")
            if heuristics["matched_categories"]:
                explanation_points.append(f"Flagged for: {', '.join(heuristics['matched_categories']).replace('_', ' ')}.")
        else:
            explanation_points.append("No active malicious indicators or deceptive lures were identified in this message.")
            explanation_points.append("The linguistic syntax, domain mentions, and structural flow align with standard legitimate correspondence.")

        explanation = " ".join(explanation_points)

        # 6. Actionable Recommended Security Actions
        if classification == "Phishing":
            recommendations = [
                "DO NOT click any links, open attachments, or reply to this message.",
                "Verify the sender's authentic address by contacting them through an official, out-of-band channel.",
                "Report this email immediately to your organization's IT Security / SOC department.",
                "If credentials were submitted, immediately change passwords and revoke active login sessions."
            ]
        elif classification == "Suspicious":
            recommendations = [
                "Exercise caution: hover over links to inspect actual destination URLs before clicking.",
                "Confirm requests for invoices, meetings, or sensitive info directly with known contacts.",
                "Do not forward this email to colleagues without security verification.",
                "Watch out for unexpected follow-ups claiming urgency or shifting to personal messaging apps."
            ]
        else:
            recommendations = [
                "This email appears legitimate, but always remain vigilant regarding unexpected requests.",
                "Ensure Multi-Factor Authentication (MFA) remains enabled across your accounts.",
                "Verify that embedded links lead to verified corporate HTTPS domains."
            ]

        return {
            "classification": classification,
            "risk_score": risk_score,
            "confidence": confidence,
            "probabilities": {
                "safe": round(prob_safe * 100, 1),
                "suspicious": round(prob_suspicious * 100, 1),
                "phishing": round(prob_phishing * 100, 1)
            },
            "heuristic_score": h_score,
            "indicators": heuristics["indicators"],
            "url_analysis": heuristics["url_analysis"],
            "urls_detected_count": heuristics["urls_detected_count"],
            "highlight_spans": heuristics["highlight_spans"],
            "explanation": explanation,
            "recommended_actions": recommendations
        }

# Global singleton classifier instance
classifier = PhishGuardClassifier()
