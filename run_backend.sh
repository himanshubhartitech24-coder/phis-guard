#!/bin/bash
# PhishGuard - Launch Backend Flask API Server
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR/backend"

export PATH="$HOME/.local/bin:$PATH"

if [ ! -d ".venv" ]; then
    echo "[*] Initializing Python virtual environment..."
    uv venv .venv --python 3.11
    source .venv/bin/activate
    uv pip install -r requirements.txt
else
    source .venv/bin/activate
fi

export PORT=5050
echo "[+] Starting PhishGuard Backend on http://127.0.0.1:5050..."
python app.py
