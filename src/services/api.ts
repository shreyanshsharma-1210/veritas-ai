import type {
  DiagnosisCreate,
  DiagnosisResponse,
  ValidationResult,
  DebateSession,
  Recommendation,
  SessionHistoryItem
} from '../types';

// In production, VITE_API_BASE_URL points to the deployed Render backend.
// In development, it falls back to '/api/v1' (proxied by Vite to localhost:8000).
const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
  : '/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      // ignore json parse error
    }
    throw new Error(errorDetail || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Diagnosis
  getCanonicalDemo: () => request<DiagnosisCreate>('/diagnosis/demo/canonical'),
  createDiagnosis: (data: DiagnosisCreate) => request<DiagnosisResponse>('/diagnosis/sessions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getDiagnosis: (id: string) => request<DiagnosisResponse>(`/diagnosis/${id}`),
  validateDiagnosis: (data: DiagnosisCreate) => request<ValidationResult>('/diagnosis/validate', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  confirmDiagnosis: (id: string) => request<DiagnosisResponse>(`/diagnosis/${id}/confirm`, {
    method: 'POST'
  }),

  // Debates
  createDebate: (diagnosisId: string, provider = 'groq') => request<{ debate_id: string; status: string }>('/debates', {
    method: 'POST',
    body: JSON.stringify({ diagnosis_id: diagnosisId, provider })
  }),
  startDebate: (debateId: string) => request<{ status: string; message: string }>(`/debates/${debateId}/start`, {
    method: 'POST'
  }),
  getDebate: (debateId: string) => request<DebateSession>(`/debates/${debateId}`),

  // Recommendations
  getRecommendation: (id: string) => request<Recommendation>(`/recommendations/${id}`),
  getRecommendationByDebate: (debateId: string) => request<Recommendation>(`/recommendations/by-debate/${debateId}`),

  // Sessions
  listSessions: () => request<SessionHistoryItem[]>('/sessions'),
  deleteSession: (id: string) => request<{ deleted: boolean }>(`/sessions/${id}`, {
    method: 'DELETE'
  }),

  // SSE Event Stream URL
  getDebateEventsUrl: (debateId: string) => `${API_BASE}/debates/${debateId}/events`
};

