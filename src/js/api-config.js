/**
 * API Configuration
 * Maps frontend actions to exact backend API endpoints
 * Base URL should be configured via environment variable
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
    // Authentication & Authorization
    auth: {
        register: '/api/v1/auth/register', // POST
        login: '/api/v1/auth/login', // POST
        logout: '/api/v1/auth/logout', // POST
        refreshToken: '/api/v1/auth/refresh-token', // POST
        verifyEmail: (token) => `/api/v1/auth/verify-email/${token}`, // GET
        forgotPassword: '/api/v1/auth/forgot-password', // POST
        resetPassword: (token) => `/api/v1/auth/reset-password/${token}`, // POST
    },

    // Profile Management
    profiles: {
        candidate: {
            create: '/api/v1/profiles/candidate/create', // POST
            get: (id) => `/api/v1/profiles/candidate/${id}`, // GET
            update: (id) => `/api/v1/profiles/candidate/${id}`, // PUT
            delete: (id) => `/api/v1/profiles/candidate/${id}`, // DELETE
            search: '/api/v1/profiles/candidate/search', // GET

            // Integrations
            integrateLinkedIn: (id) => `/api/v1/profiles/candidate/${id}/integrate/linkedin`, // POST
            integrateGitHub: (id) => `/api/v1/profiles/candidate/${id}/integrate/github`, // POST
            integrateLeetCode: (id) => `/api/v1/profiles/candidate/${id}/integrate/leetcode`, // POST
            integrateStackOverflow: (id) => `/api/v1/profiles/candidate/${id}/integrate/stackoverflow`, // POST
            getIntegrations: (id) => `/api/v1/profiles/candidate/${id}/integrations`, // GET
            deleteIntegration: (id, platform) => `/api/v1/profiles/candidate/${id}/integrations/${platform}`, // DELETE

            // Embeddings
            generateEmbedding: (id) => `/api/v1/profiles/candidate/${id}/generate-embedding`, // POST
            getEmbedding: (id) => `/api/v1/profiles/candidate/${id}/embedding`, // GET
            rebuildFaissIndex: '/api/v1/profiles/rebuild-faiss-index', // POST
        },
        recruiter: {
            create: '/api/v1/profiles/recruiter/create', // POST
            get: (id) => `/api/v1/profiles/recruiter/${id}`, // GET
            update: (id) => `/api/v1/profiles/recruiter/${id}`, // PUT
        },
    },

    // Hiring Management
    hiring: {
        jobs: {
            create: '/api/v1/hiring/jobs/create', // POST
            list: '/api/v1/hiring/jobs', // GET
            get: (jobId) => `/api/v1/hiring/jobs/${jobId}`, // GET
            update: (jobId) => `/api/v1/hiring/jobs/${jobId}`, // PUT
            delete: (jobId) => `/api/v1/hiring/jobs/${jobId}`, // DELETE
            updateStatus: (jobId) => `/api/v1/hiring/jobs/${jobId}/status`, // PATCH

            // JD Parsing
            parseJD: (jobId) => `/api/v1/hiring/jobs/${jobId}/parse-jd`, // POST
            getExtractedRequirements: (jobId) => `/api/v1/hiring/jobs/${jobId}/extracted-requirements`, // GET

            // Shortlisting
            semanticSearch: (jobId) => `/api/v1/hiring/jobs/${jobId}/shortlist/semantic-search`, // POST
            llmAnalysis: (jobId) => `/api/v1/hiring/jobs/${jobId}/shortlist/llm-analysis`, // POST
            getShortlisted: (jobId) => `/api/v1/hiring/jobs/${jobId}/shortlisted-candidates`, // GET
            getFraudScore: (jobId, candidateId) => `/api/v1/hiring/jobs/${jobId}/shortlist/${candidateId}/fraud-score`, // POST

            // Pipeline
            getPipeline: (jobId) => `/api/v1/hiring/jobs/${jobId}/pipeline`, // GET
            updateStage: (jobId, candidateId) => `/api/v1/hiring/jobs/${jobId}/candidates/${candidateId}/stage`, // PATCH
            getAnalytics: (jobId) => `/api/v1/hiring/jobs/${jobId}/analytics`, // GET
        },
    },

    // Applications
    applications: {
        submit: '/api/v1/applications/submit', // POST
        get: (applicationId) => `/api/v1/applications/${applicationId}`, // GET
        getByCandidate: (candidateId) => `/api/v1/applications/candidate/${candidateId}`, // GET
        getByJob: (jobId) => `/api/v1/applications/job/${jobId}`, // GET
        updateStatus: (applicationId) => `/api/v1/applications/${applicationId}/status`, // PATCH
        withdraw: (applicationId) => `/api/v1/applications/${applicationId}/withdraw`, // DELETE

        // Documents
        uploadDocument: (applicationId) => `/api/v1/applications/${applicationId}/documents/upload`, // POST
        getDocuments: (applicationId) => `/api/v1/applications/${applicationId}/documents`, // GET
        deleteDocument: (applicationId, documentId) => `/api/v1/applications/${applicationId}/documents/${documentId}`, // DELETE
    },

    // Scheduling
    scheduling: {
        interviews: {
            create: '/api/v1/scheduling/interviews/create', // POST
            get: (interviewId) => `/api/v1/scheduling/interviews/${interviewId}`, // GET
            update: (interviewId) => `/api/v1/scheduling/interviews/${interviewId}`, // PUT
            delete: (interviewId) => `/api/v1/scheduling/interviews/${interviewId}`, // DELETE
            getByCandidate: (candidateId) => `/api/v1/scheduling/interviews/candidate/${candidateId}`, // GET
            getByRecruiter: (recruiterId) => `/api/v1/scheduling/interviews/recruiter/${recruiterId}`, // GET
        },
        availability: {
            set: '/api/v1/scheduling/availability/set', // POST
            get: (userId) => `/api/v1/scheduling/availability/${userId}`, // GET
            getAvailableSlots: '/api/v1/scheduling/slots/available', // GET
        },
        calendar: {
            sync: '/api/v1/scheduling/calendar/sync', // POST
            getEvents: '/api/v1/scheduling/calendar/events', // GET
        },
    },

    // Notifications
    notifications: {
        list: '/api/v1/notifications', // GET
        get: (notificationId) => `/api/v1/notifications/${notificationId}`, // GET
        markAsRead: (notificationId) => `/api/v1/notifications/${notificationId}/read`, // PATCH
        markAllRead: '/api/v1/notifications/mark-all-read', // PATCH
        delete: (notificationId) => `/api/v1/notifications/${notificationId}`, // DELETE

        // Preferences
        getPreferences: '/api/v1/notifications/preferences', // GET
        updatePreferences: '/api/v1/notifications/preferences', // PUT

        // WebSocket
        stream: '/api/v1/notifications/stream', // WS
    },

    // Leaderboard
    leaderboard: {
        getByJob: (jobId) => `/api/v1/leaderboard/job/${jobId}`, // GET
        getCandidateRank: (jobId, candidateId) => `/api/v1/leaderboard/job/${jobId}/candidate/${candidateId}/rank`, // GET
        recalculate: (jobId) => `/api/v1/leaderboard/job/${jobId}/recalculate`, // POST
        getTopPerformers: '/api/v1/leaderboard/global/top-performers', // GET
        getCandidateScores: (candidateId) => `/api/v1/leaderboard/candidate/${candidateId}/scores`, // GET
        getScoreDistribution: (jobId) => `/api/v1/leaderboard/job/${jobId}/score-distribution`, // GET
    },

    // Assessment
    assessment: {
        create: '/api/v1/assessment/create', // POST
        get: (assessmentId) => `/api/v1/assessment/${assessmentId}`, // GET
        update: (assessmentId) => `/api/v1/assessment/${assessmentId}`, // PUT
        delete: (assessmentId) => `/api/v1/assessment/${assessmentId}`, // DELETE

        // Sessions
        startSession: (assessmentId) => `/api/v1/assessment/${assessmentId}/start-session`, // POST
        getSession: (sessionId) => `/api/v1/assessment/session/${sessionId}`, // GET
        submitSession: (sessionId) => `/api/v1/assessment/session/${sessionId}/submit`, // POST
        saveProgress: (sessionId) => `/api/v1/assessment/session/${sessionId}/save-progress`, // PATCH

        // Proctoring
        startProctoring: (sessionId) => `/api/v1/assessment/session/${sessionId}/proctoring/start`, // POST
        facialRecognition: (sessionId) => `/api/v1/assessment/session/${sessionId}/proctoring/facial-recognition`, // POST
        browserActivity: (sessionId) => `/api/v1/assessment/session/${sessionId}/proctoring/browser-activity`, // POST
        keystrokeDynamics: (sessionId) => `/api/v1/assessment/session/${sessionId}/proctoring/keystroke-dynamics`, // POST
        getViolations: (sessionId) => `/api/v1/assessment/session/${sessionId}/proctoring/violations`, // GET
        flagIncident: (sessionId) => `/api/v1/assessment/session/${sessionId}/proctoring/flag-incident`, // POST
    },

    // Coding Sessions
    coding: {
        createSession: '/api/v1/coding/session/create', // POST
        getSession: (sessionId) => `/api/v1/coding/session/${sessionId}`, // GET
        startSession: (sessionId) => `/api/v1/coding/session/${sessionId}/start`, // POST
        submitSolution: (sessionId) => `/api/v1/coding/session/${sessionId}/submit-solution`, // POST

        // Monitoring
        stream: (sessionId) => `/api/v1/coding/session/${sessionId}/stream`, // WS
        codeSnapshot: (sessionId) => `/api/v1/coding/session/${sessionId}/code-snapshot`, // POST
        replay: (sessionId) => `/api/v1/coding/session/${sessionId}/replay`, // GET

        // Plagiarism
        liveCheck: (sessionId) => `/api/v1/coding/session/${sessionId}/plagiarism/live-check`, // POST
        getAlerts: (sessionId) => `/api/v1/coding/session/${sessionId}/plagiarism/alerts`, // GET
    },

    // AI Services
    ai: {
        // JD Parser
        jdParser: {
            parse: '/api/v1/ai/jd-parser/parse', // POST
            getExtraction: (jobId) => `/api/v1/ai/jd-parser/extraction/${jobId}`, // GET
            validate: '/api/v1/ai/jd-parser/validate', // POST
            enrich: '/api/v1/ai/jd-parser/enrich', // POST
        },

        // FAISS + LLM
        faiss: {
            search: '/api/v1/ai/faiss/search', // POST
            searchBatch: '/api/v1/ai/faiss/search/batch', // POST
            getIndexStats: '/api/v1/ai/faiss/index/stats', // GET
            rebuildIndex: '/api/v1/ai/faiss/index/rebuild', // POST
        },
        llm: {
            analyzeCandidates: '/api/v1/ai/llm/analyze-candidates', // POST
            generateFraudScore: '/api/v1/ai/llm/generate-fraud-score', // POST
            credibilityCheck: '/api/v1/ai/llm/credibility-check', // POST
        },

        // Assessment Generation
        assessmentGen: {
            mcq: {
                generate: '/api/v1/ai/assessment/mcq/generate', // POST
                validate: '/api/v1/ai/assessment/mcq/validate', // POST
                get: (assessmentId) => `/api/v1/ai/assessment/mcq/${assessmentId}`, // GET
            },
            spice: {
                generate: '/api/v1/ai/assessment/spice/generate', // POST
                validate: '/api/v1/ai/assessment/spice/validate', // POST
                get: (assessmentId) => `/api/v1/ai/assessment/spice/${assessmentId}`, // GET
            },
            coding: {
                generate: '/api/v1/ai/assessment/coding/generate', // POST
                validate: '/api/v1/ai/assessment/coding/validate', // POST
                get: (assessmentId) => `/api/v1/ai/assessment/coding/${assessmentId}`, // GET
            },
            createComprehensive: '/api/v1/ai/assessment/create-comprehensive', // POST
            get: (assessmentId) => `/api/v1/ai/assessment/${assessmentId}`, // GET
        },

        // Code Evaluation
        codeEval: {
            submit: '/api/v1/ai/code-eval/submit', // POST
            getResults: (submissionId) => `/api/v1/ai/code-eval/results/${submissionId}`, // GET
            runTestCases: '/api/v1/ai/code-eval/test-cases/run', // POST
            analyzeSnippet: '/api/v1/ai/code-eval/analyze-snippet', // POST
            suggestImprovements: '/api/v1/ai/code-eval/suggest-improvements', // POST
        },

        // Plagiarism Detection
        plagiarism: {
            code: {
                check: '/api/v1/ai/plagiarism/code/check', // POST
                getReport: (checkId) => `/api/v1/ai/plagiarism/code/report/${checkId}`, // GET
                compare: '/api/v1/ai/plagiarism/code/compare', // POST
            },
            text: {
                check: '/api/v1/ai/plagiarism/text/check', // POST
                getReport: (checkId) => `/api/v1/ai/plagiarism/text/report/${checkId}`, // GET
            },
            aiDetection: {
                check: '/api/v1/ai/plagiarism/ai-detection', // POST
                getReport: (checkId) => `/api/v1/ai/plagiarism/ai-detection/report/${checkId}`, // GET
            },
        },

        // LLM Interviewer
        interview: {
            generateQuestions: '/api/v1/ai/interview/generate-questions', // POST
            getQuestions: (interviewId) => `/api/v1/ai/interview/${interviewId}/questions`, // GET
            projectBasedQuestions: '/api/v1/ai/interview/project-based-questions', // POST

            // Simulation
            startSimulation: '/api/v1/ai/interview/simulate/start', // POST
            respond: (sessionId) => `/api/v1/ai/interview/simulate/${sessionId}/respond`, // POST
            getTranscript: (sessionId) => `/api/v1/ai/interview/simulate/${sessionId}/transcript`, // GET
            evaluate: (sessionId) => `/api/v1/ai/interview/simulate/${sessionId}/evaluate`, // POST
        },

        // LLM Council
        council: {
            evaluateCandidate: '/api/v1/ai/council/evaluate-candidate', // POST
            getEvaluation: (evaluationId) => `/api/v1/ai/council/evaluation/${evaluationId}`, // GET
            getAgentVotes: (evaluationId) => `/api/v1/ai/council/evaluation/${evaluationId}/agent-votes`, // GET

            // Agent Perspectives
            getTechnicalAgent: (evaluationId) => `/api/v1/ai/council/evaluation/${evaluationId}/technical-agent`, // GET
            getCommunicationAgent: (evaluationId) => `/api/v1/ai/council/evaluation/${evaluationId}/communication-agent`, // GET
            getCultureAgent: (evaluationId) => `/api/v1/ai/council/evaluation/${evaluationId}/culture-agent`, // GET
            getGrowthAgent: (evaluationId) => `/api/v1/ai/council/evaluation/${evaluationId}/growth-agent`, // GET
            getRiskAgent: (evaluationId) => `/api/v1/ai/council/evaluation/${evaluationId}/risk-agent`, // GET

            // Rankings
            generateRankings: '/api/v1/ai/council/generate-rankings', // POST
            getJobRankings: (jobId) => `/api/v1/ai/council/job/${jobId}/rankings`, // GET
            getCandidateExplanation: (candidateId) => `/api/v1/ai/council/candidate/${candidateId}/explanation`, // GET
        },

        // TeamFit (GNN)
        teamfit: {
            analyze: '/api/v1/ai/teamfit/analyze', // POST
            getVisualization: (analysisId) => `/api/v1/ai/teamfit/visualization/${analysisId}`, // GET
            get3DGraph: (analysisId) => `/api/v1/ai/teamfit/visualization/${analysisId}/3d-graph`, // GET

            // Gap Analysis
            gapAnalysis: '/api/v1/ai/teamfit/gap-analysis', // POST
            getRecommendations: (analysisId) => `/api/v1/ai/teamfit/gap-analysis/${analysisId}/recommendations`, // GET

            // Redundancy
            redundancyCheck: '/api/v1/ai/teamfit/redundancy-check', // POST
            getSkillDistribution: (teamId) => `/api/v1/ai/teamfit/team/${teamId}/skill-distribution`, // GET
        },
    },

    // Verification
    verification: {
        github: {
            analyze: (username) => `/api/v1/verification/github/${username}/analyze`, // POST
            getCommitHistory: (username) => `/api/v1/verification/github/${username}/commit-history`, // GET
            getProjectAuthenticity: (username) => `/api/v1/verification/github/${username}/project-authenticity`, // GET
        },
        crossPlatform: {
            check: (candidateId) => `/api/v1/verification/cross-platform/${candidateId}/check`, // POST
            getReport: (candidateId) => `/api/v1/verification/cross-platform/${candidateId}/report`, // GET
            getInconsistencies: (candidateId) => `/api/v1/verification/cross-platform/${candidateId}/inconsistencies`, // GET
        },
        digitalFootprint: {
            analyze: (candidateId) => `/api/v1/verification/digital-footprint/${candidateId}/analyze`, // POST
            getScore: (candidateId) => `/api/v1/verification/digital-footprint/${candidateId}/score`, // GET
        },
    },

    // Comparison
    comparison: {
        create: '/api/v1/comparison/create', // POST
        addCandidate: (comparisonId) => `/api/v1/comparison/${comparisonId}/add-candidate`, // POST
        removeCandidate: (comparisonId) => `/api/v1/comparison/${comparisonId}/remove-candidate`, // DELETE
        get: (comparisonId) => `/api/v1/comparison/${comparisonId}`, // GET
        generateTradeoffAnalysis: (comparisonId) => `/api/v1/comparison/${comparisonId}/generate-tradeoff-analysis`, // POST
        getRecommendations: (comparisonId) => `/api/v1/comparison/${comparisonId}/recommendations`, // GET
        getMatrix: (comparisonId) => `/api/v1/comparison/${comparisonId}/matrix`, // GET
    },

    // Analytics
    analytics: {
        job: {
            overview: (jobId) => `/api/v1/analytics/job/${jobId}/overview`, // GET
            funnel: (jobId) => `/api/v1/analytics/job/${jobId}/funnel`, // GET
            timeToHire: (jobId) => `/api/v1/analytics/job/${jobId}/time-to-hire`, // GET
            candidateSources: (jobId) => `/api/v1/analytics/job/${jobId}/candidate-sources`, // GET
        },
        platform: {
            overview: '/api/v1/analytics/platform/overview', // GET
            fraudStats: '/api/v1/analytics/platform/fraud-detection-stats', // GET
            aiMetrics: '/api/v1/analytics/platform/ai-accuracy-metrics', // GET
            userEngagement: '/api/v1/analytics/platform/user-engagement', // GET
        },
        audit: {
            decisionTrail: (jobId) => `/api/v1/analytics/audit/${jobId}/decision-trail`, // GET
            candidateActions: (candidateId) => `/api/v1/analytics/audit/${candidateId}/actions`, // GET
        },
    },

    // Webhooks
    webhooks: {
        register: '/api/v1/webhooks/register', // POST
        list: '/api/v1/webhooks', // GET
        update: (webhookId) => `/api/v1/webhooks/${webhookId}`, // PUT
        delete: (webhookId) => `/api/v1/webhooks/${webhookId}`, // DELETE
        getLogs: (webhookId) => `/api/v1/webhooks/${webhookId}/logs`, // GET
        test: (webhookId) => `/api/v1/webhooks/${webhookId}/test`, // POST
    },
};

/**
 * Helper function to build full API URL
 */
export function buildApiUrl(endpoint) {
    return `${API_BASE_URL}${endpoint}`;
}

export default API_ENDPOINTS;
