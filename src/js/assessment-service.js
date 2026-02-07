import { mockAssessments, mockSessions } from './mock-data.js';

// Configuration
const API_BASE_URL = '/api/v1';
const USE_MOCK_FALLBACK = true; // Set to false to strictly enforce API usage only

class AssessmentService {
    constructor() {
        this.assessments = [...mockAssessments];
        // Initialize from LocalStorage if available to persist across page loads
        const storedSessions = localStorage.getItem('mockSessions');
        if (storedSessions) {
            this.sessions = JSON.parse(storedSessions);

            // CRITICAL FIX: Only reconcile if the stored session is "stale" (older than 24 hours)
            // This preserves the timer progress on page reload (user sees 53:00, not resets to 55:00)
            // while still fixing the original "00:00:00" bug caused by hardcoded 2024 dates.
            this.sessions.forEach(session => {
                const sessionTime = new Date(session.startTime).getTime();
                const oneDay = 24 * 60 * 60 * 1000;

                // If session is older than 24 hours, it's considered "broken/old demo data" -> Reset it
                if (Date.now() - sessionTime > oneDay) {
                    const freshMock = mockSessions.find(ms => ms.id === session.id);
                    if (freshMock) {
                        console.log(`♻️ Resetting stale session ${session.id} to new start time`);
                        // Use the dynamic Date.now() from mock-data, or just Date.now() directly
                        session.startTime = new Date();
                        session.status = freshMock.status;
                    }
                }
            });
            this._persistSessions();
        } else {
            this.sessions = [...mockSessions];
            this._persistSessions();
        }
    }

    _persistSessions() {
        localStorage.setItem('mockSessions', JSON.stringify(this.sessions));
    }

    async _fetch(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = localStorage.getItem('authToken'); // Assuming auth token storage

        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(url, { ...options, headers });
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`API request to ${url} failed:`, error);
            if (USE_MOCK_FALLBACK) {
                console.info('Falling back to mock implementation for:', endpoint);
                return null; // Signal fallback
            }
            throw error;
        }
    }

    // --- Assessment Management ---

    async getAll() {
        // GET /api/v1/assessment/list (Hypothetical, or assume user wants filtered list)
        // Using mock for list generation usually as it's complex, but let's try endpoint if provided
        // The user provided: GET /api/v1/assessment/:assessmentId
        // But not a list endpoint. We'll stick to mock for listing or simulate.

        return new Promise((resolve) => {
            setTimeout(() => {
                const result = this.assessments.map(asm => {
                    const session = this.sessions.find(s => s.assessmentId === asm.id && s.status === 'in-progress');
                    return {
                        ...asm,
                        activeSessionId: session ? session.id : null
                    };
                });
                resolve(result);
            }, 500);
        });
    }

    // --- Session Management ---

    async startSession(assessmentId) {
        // POST /api/v1/assessment/:assessmentId/start-session
        const result = await this._fetch(`/assessment/${assessmentId}/start-session`, {
            method: 'POST'
        });

        if (result) return result; // Return API result

        // Fallback Mock Logic
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const assessment = this.assessments.find(a => a.id === assessmentId);
                // Check if session already exists
                const existingSession = this.sessions.find(s => s.assessmentId === assessmentId && s.status === 'in-progress');
                if (existingSession) {
                    resolve({ sessionId: existingSession.id });
                    return;
                }
                // Create new session
                const newSession = {
                    id: `sess-${Date.now()}`,
                    assessmentId: assessmentId,
                    candidateId: 'user-001',
                    status: 'in-progress',
                    currentPhase: 'aptitude',
                    currentSectionIndex: 0,
                    startTime: new Date(),
                    answers: {},
                    codingSessionId: null
                };
                this.sessions.push(newSession);
                this._persistSessions();
                console.log('Created and persisted new session:', newSession);
                resolve({ sessionId: newSession.id });
            }, 500);
        });
    }

    async getSession(sessionId) {
        // GET /api/v1/assessment/session/:sessionId
        const result = await this._fetch(`/assessment/session/${sessionId}`);

        if (result) return result; // Expected: { session, assessment }

        // Fallback
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const session = this.sessions.find(s => s.id === sessionId);
                if (!session) {
                    reject(new Error('Session not found'));
                    return;
                }
                const assessment = this.assessments.find(a => a.id === session.assessmentId);
                resolve({ session, assessment });
            }, 500);
        });
    }

    async saveProgress(sessionId, data) {
        // PATCH /api/v1/assessment/session/:sessionId/save-progress
        const result = await this._fetch(`/assessment/session/${sessionId}/save-progress`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });

        if (result) return result;

        // Fallback
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const session = this.sessions.find(s => s.id === sessionId);
                if (session) {
                    // Merge answers
                    // data format expected: { sectionId: { questionId: answer } }
                    for (const sectionId in data) {
                        if (!session.answers[sectionId]) {
                            session.answers[sectionId] = {};
                        }
                        Object.assign(session.answers[sectionId], data[sectionId]);
                    }
                    this._persistSessions();
                    console.log(`Saved progress for session ${sessionId}`, session.answers);
                }
                resolve({ success: true });
            }, 300);
        });
    }

    async submitSession(sessionId) {
        // POST /api/v1/assessment/session/:sessionId/submit
        const result = await this._fetch(`/assessment/session/${sessionId}/submit`, {
            method: 'POST'
        });

        if (result) return result;

        // Fallback
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const session = this.sessions.find(s => s.id === sessionId);
                if (!session) {
                    reject(new Error('Session not found'));
                    return;
                }

                // Phase Transition Logic
                if (session.currentPhase === 'aptitude') {
                    session.currentPhase = 'coding';
                    session.currentSectionIndex = 2; // Jump to coding section (mock index)
                    // Create coding session automatically
                    session.codingSessionId = `code-${Date.now()}`;
                    this._persistSessions();
                    resolve({ success: true, nextPhase: 'coding', codingSessionId: session.codingSessionId });
                } else if (session.currentPhase === 'coding') {
                    session.currentPhase = 'interview';
                    this._persistSessions();
                    resolve({ success: true, nextPhase: 'interview' });
                } else {
                    session.status = 'completed';
                    this._persistSessions();
                    resolve({ success: true, nextPhase: 'completed' });
                }
            }, 500);
        });
    }

    // --- Proctoring ---

    async startProctoring(sessionId) {
        // POST /api/v1/assessment/session/:sessionId/proctoring/start
        const result = await this._fetch(`/assessment/session/${sessionId}/proctoring/start`, {
            method: 'POST'
        });

        if (result) return result;

        // Fallback
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Proctoring started for session ${sessionId}`);
                resolve({ success: true, trackingId: `proc-${Date.now()}` });
            }, 500);
        });
    }

    // --- Coding Round ---

    async submitCodingSolution(sessionId, code) {
        // POST /api/v1/coding/session/:sessionId/submit-solution
        // Note: The sessionId passed here is likely the codingSessionId
        const result = await this._fetch(`/coding/session/${sessionId}/submit-solution`, {
            method: 'POST',
            body: JSON.stringify({ code })
        });

        if (result) return result;

        // Fallback
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Code submitted for session ${sessionId}`);
                resolve({ success: true, testResults: { passed: true, output: "All tests passed" } });
            }, 1000);
        });
    }
}

export const assessmentService = new AssessmentService();
