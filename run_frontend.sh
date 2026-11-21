#!/bin/bash
# PhishGuard - Launch Frontend Vite Development Server
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR/frontend"

export PATH="$HOME/.local/bin:$HOME/.local/node/bin:$PATH"

if [ ! -d "node_modules" ]; then
    echo "[*] Installing frontend node dependencies..."
    npm install
fi

echo "[+] Starting PhishGuard Frontend on http://localhost:5173..."
npm run dev
