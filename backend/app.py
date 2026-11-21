"""
PhishGuard - AI-Powered Email Phishing Detection System
Backend Flask API Server.
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import classifier
from url_analyzer import analyze_url, extract_urls
import database

app = Flask(__name__)
# Enable CORS for frontend Vite dev server (usually localhost:5173 or localhost:3000)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize SQLite database on startup
database.init_db()

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify backend status."""
    return jsonify({
        "status": "healthy",
        "service": "PhishGuard API",
        "version": "1.0.0",
        "model_loaded": classifier.model is not None
    })

@app.route("/api/analyze", methods=["POST"])
def analyze_email():
    """
    Main endpoint for email threat detection.
    Expects JSON: { "text": "...", "subject": "...", "sender": "..." }
    """
    data = request.get_json(force=True, silent=True) or {}
    text = data.get("text", "").strip()
    subject = data.get("subject", "").strip()
    sender = data.get("sender", "").strip()

    if not text:
        return jsonify({"error": "Email content is required."}), 400

    # Combine subject and text for comprehensive context if subject provided
    full_analysis_text = f"Subject: {subject}\n\n{text}" if subject and not text.lower().startswith("subject:") else text

    # Run ML and heuristic analysis
    result = classifier.predict(full_analysis_text)

    # Save to SQLite history
    scan_id = database.save_scan({
        "subject": subject or "Email Analysis",
        "sender": sender or "Unknown Sender",
        "raw_text": full_analysis_text,
        "classification": result["classification"],
        "risk_score": result["risk_score"],
        "confidence": result["confidence"],
        "indicators": result["indicators"],
        "url_analysis": result["url_analysis"],
        "explanation": result["explanation"]
    })

    result["id"] = scan_id
    result["subject"] = subject or "Email Analysis"
    result["sender"] = sender or "Unknown Sender"
    result["disclaimer"] = "Automated AI assessment for informational purposes. Verify through standard organizational security protocols."

    return jsonify(result), 200

@app.route("/api/scan-url", methods=["POST"])
def scan_url_endpoint():
    """
    Standalone non-invasive URL Security Scanner endpoint.
    Expects JSON: { "url": "..." }
    """
    data = request.get_json(force=True, silent=True) or {}
    url = data.get("url", "").strip()

    if not url:
        return jsonify({"error": "URL parameter is required."}), 400

    analysis = analyze_url(url)
    return jsonify(analysis), 200

@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Returns aggregated metrics for the dashboard & analytics."""
    stats = database.get_dashboard_stats()
    return jsonify(stats), 200

@app.route("/api/history", methods=["GET"])
def get_history_endpoint():
    """
    Retrieves scan history.
    Query params:
      - limit: int (default 50)
      - offset: int (default 0)
      - filter: 'all' | 'safe' | 'suspicious' | 'phishing'
      - search: string
    """
    limit = int(request.args.get("limit", 50))
    offset = int(request.args.get("offset", 0))
    filter_type = request.args.get("filter", "all")
    search = request.args.get("search", "").strip()

    history = database.get_history(limit=limit, offset=offset, filter_type=filter_type, search=search)
    return jsonify(history), 200

@app.route("/api/history/<int:scan_id>", methods=["GET"])
def get_single_scan(scan_id):
    """Fetches details for a single scan record."""
    scan = database.get_scan_by_id(scan_id)
    if not scan:
        return jsonify({"error": "Scan record not found."}), 404
    return jsonify(scan), 200

@app.route("/api/history/<int:scan_id>", methods=["DELETE"])
def delete_single_scan(scan_id):
    """Deletes a scan record."""
    success = database.delete_scan(scan_id)
    if not success:
        return jsonify({"error": "Scan record not found."}), 404
    return jsonify({"success": True, "message": f"Scan #{scan_id} deleted."}), 200

@app.route("/api/history", methods=["DELETE"])
def clear_all_history():
    """Clears all scan records."""
    database.clear_history()
    return jsonify({"success": True, "message": "All history records cleared."}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    print(f"[*] Starting PhishGuard API server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
