#!/bin/bash
# PhishGuard - Start Full Stack Application (Backend + Frontend)
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================================="
echo "🛡️  PhishGuard – AI-Powered Email Phishing Detection System"
echo "=========================================================="

cleanup() {
    echo ""
    echo "[*] Shutting down PhishGuard services..."
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Start backend
echo "[1/2] Starting Flask Backend API on :5050..."
"$DIR/run_backend.sh" &
BACKEND_PID=$!

# Wait briefly for backend to initialize
sleep 2

# Start frontend
echo "[2/2] Starting React + Vite Frontend on :5173..."
"$DIR/run_frontend.sh" &
FRONTEND_PID=$!

echo ""
echo "=========================================================="
echo " PhishGuard is running!"
echo " 👉 Web Interface:  http://localhost:5173"
echo " 👉 Backend API:    http://127.0.0.1:5050"
echo " 👉 Health Check:   http://127.0.0.1:5050/api/health"
echo "=========================================================="
echo "Press Ctrl+C to terminate both servers."

wait
