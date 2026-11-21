/**
 * PhishGuard API Client
 * Provides centralized network methods to communicate with the Python Flask backend.
 */

// In development when frontend runs on 5173 and backend on 5050,
// directly connect to backend port 5050 with CORS support.
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname 
    ? `http://${window.location.hostname}:5050/api` 
    : 'http://127.0.0.1:5050/api');

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend health check failed:", err.message);
    return { status: "offline", error: err.message };
  }
}

export async function analyzeEmailContent(payload) {
  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Analysis failed with status ${res.status}`);
  }

  return await res.json();
}

export async function scanUrlEndpoint(url) {
  const res = await fetch(`${API_BASE_URL}/scan-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `URL scan failed with status ${res.status}`);
  }

  return await res.json();
}

export async function getDashboardStats() {
  const res = await fetch(`${API_BASE_URL}/stats`);
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
  return await res.json();
}

export async function getScanHistory(params = {}) {
  const query = new URLSearchParams();
  if (params.limit) query.set('limit', params.limit);
  if (params.offset) query.set('offset', params.offset);
  if (params.filter && params.filter !== 'all') query.set('filter', params.filter);
  if (params.search) query.set('search', params.search);

  const res = await fetch(`${API_BASE_URL}/history?${query.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch scan history: ${res.status}`);
  return await res.json();
}

export async function getScanById(scanId) {
  const res = await fetch(`${API_BASE_URL}/history/${scanId}`);
  if (!res.ok) throw new Error(`Failed to fetch scan #${scanId}`);
  return await res.json();
}

export async function deleteScanRecord(scanId) {
  const res = await fetch(`${API_BASE_URL}/history/${scanId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete scan #${scanId}`);
  return await res.json();
}

export async function clearAllHistoryRecords() {
  const res = await fetch(`${API_BASE_URL}/history`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to clear history`);
  return await res.json();
}
