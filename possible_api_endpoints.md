API Gateway Layer
Authentication & Authorization
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
GET    /api/v1/auth/verify-email/:token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password/:token


Application Services Layer
1. Profile Management Service
# Candidate Profiles
POST   /api/v1/profiles/candidate/create
GET    /api/v1/profiles/candidate/:id
PUT    /api/v1/profiles/candidate/:id
DELETE /api/v1/profiles/candidate/:id
GET    /api/v1/profiles/candidate/search

# Multi-platform Integration
POST   /api/v1/profiles/candidate/:id/integrate/linkedin
POST   /api/v1/profiles/candidate/:id/integrate/github
POST   /api/v1/profiles/candidate/:id/integrate/leetcode
POST   /api/v1/profiles/candidate/:id/integrate/stackoverflow
GET    /api/v1/profiles/candidate/:id/integrations
DELETE /api/v1/profiles/candidate/:id/integrations/:platform

# Profile Embeddings & FAISS
POST   /api/v1/profiles/candidate/:id/generate-embedding
GET    /api/v1/profiles/candidate/:id/embedding
POST   /api/v1/profiles/rebuild-faiss-index

# Recruiter Profiles
POST   /api/v1/profiles/recruiter/create
GET    /api/v1/profiles/recruiter/:id
PUT    /api/v1/profiles/recruiter/:id

2. Hiring Management Service
# Job Postings
POST   /api/v1/hiring/jobs/create
GET    /api/v1/hiring/jobs
GET    /api/v1/hiring/jobs/:jobId
PUT    /api/v1/hiring/jobs/:jobId
DELETE /api/v1/hiring/jobs/:jobId
PATCH  /api/v1/hiring/jobs/:jobId/status

# JD Parsing (AI-powered)
POST   /api/v1/hiring/jobs/:jobId/parse-jd
GET    /api/v1/hiring/jobs/:jobId/extracted-requirements

# Candidate Shortlisting
POST   /api/v1/hiring/jobs/:jobId/shortlist/semantic-search
POST   /api/v1/hiring/jobs/:jobId/shortlist/llm-analysis
GET    /api/v1/hiring/jobs/:jobId/shortlisted-candidates
POST   /api/v1/hiring/jobs/:jobId/shortlist/:candidateId/fraud-score

# Pipeline Management
GET    /api/v1/hiring/jobs/:jobId/pipeline
PATCH  /api/v1/hiring/jobs/:jobId/candidates/:candidateId/stage
GET    /api/v1/hiring/jobs/:jobId/analytics

3. Application Service
# Applications
POST   /api/v1/applications/submit
GET    /api/v1/applications/:applicationId
GET    /api/v1/applications/candidate/:candidateId
GET    /api/v1/applications/job/:jobId
PATCH  /api/v1/applications/:applicationId/status
DELETE /api/v1/applications/:applicationId/withdraw

# Application Documents
POST   /api/v1/applications/:applicationId/documents/upload
GET    /api/v1/applications/:applicationId/documents
DELETE /api/v1/applications/:applicationId/documents/:documentId

4. Scheduling Service
# Interview Scheduling
POST   /api/v1/scheduling/interviews/create
GET    /api/v1/scheduling/interviews/:interviewId
PUT    /api/v1/scheduling/interviews/:interviewId
DELETE /api/v1/scheduling/interviews/:interviewId
GET    /api/v1/scheduling/interviews/candidate/:candidateId
GET    /api/v1/scheduling/interviews/recruiter/:recruiterId

# Availability Management
POST   /api/v1/scheduling/availability/set
GET    /api/v1/scheduling/availability/:userId
GET    /api/v1/scheduling/slots/available

# Calendar Integration
POST   /api/v1/scheduling/calendar/sync
GET    /api/v1/scheduling/calendar/events

5. Notification Service
# Notifications
GET    /api/v1/notifications
GET    /api/v1/notifications/:notificationId
PATCH  /api/v1/notifications/:notificationId/read
PATCH  /api/v1/notifications/mark-all-read
DELETE /api/v1/notifications/:notificationId

# Notification Preferences
GET    /api/v1/notifications/preferences
PUT    /api/v1/notifications/preferences

# Real-time (WebSocket)
WS     /api/v1/notifications/stream

6. Orchestration Service
# Workflow Orchestration
POST   /api/v1/orchestration/workflows/start
GET    /api/v1/orchestration/workflows/:workflowId/status
POST   /api/v1/orchestration/workflows/:workflowId/cancel
GET    /api/v1/orchestration/workflows/:workflowId/logs

# Batch Operations
POST   /api/v1/orchestration/batch/shortlist-candidates
POST   /api/v1/orchestration/batch/generate-assessments
POST   /api/v1/orchestration/batch/send-invitations
GET    /api/v1/orchestration/batch/:batchId/status

7. Leaderboard Service
# Leaderboards
GET    /api/v1/leaderboard/job/:jobId
GET    /api/v1/leaderboard/job/:jobId/candidate/:candidateId/rank
POST   /api/v1/leaderboard/job/:jobId/recalculate
GET    /api/v1/leaderboard/global/top-performers

# Scoring
GET    /api/v1/leaderboard/candidate/:candidateId/scores
GET    /api/v1/leaderboard/job/:jobId/score-distribution


AI/ML Engines Layer
8. JD Parser Engine
POST   /api/v1/ai/jd-parser/parse
GET    /api/v1/ai/jd-parser/extraction/:jobId
POST   /api/v1/ai/jd-parser/validate
POST   /api/v1/ai/jd-parser/enrich

9. FAISS + LLM Engine
# Semantic Search
POST   /api/v1/ai/faiss/search
POST   /api/v1/ai/faiss/search/batch
GET    /api/v1/ai/faiss/index/stats
POST   /api/v1/ai/faiss/index/rebuild

# LLM Deep Analysis
POST   /api/v1/ai/llm/analyze-candidates
POST   /api/v1/ai/llm/generate-fraud-score
POST   /api/v1/ai/llm/credibility-check

10. Assessment Generation Engines
# MCQ Generation
POST   /api/v1/ai/assessment/mcq/generate
POST   /api/v1/ai/assessment/mcq/validate
GET    /api/v1/ai/assessment/mcq/:assessmentId

# SPICE Question Generation (Short answer, numerical)
POST   /api/v1/ai/assessment/spice/generate
POST   /api/v1/ai/assessment/spice/validate
GET    /api/v1/ai/assessment/spice/:assessmentId

# Coding Challenges
POST   /api/v1/ai/assessment/coding/generate
POST   /api/v1/ai/assessment/coding/validate
GET    /api/v1/ai/assessment/coding/:assessmentId

# Combined Assessment Creation
POST   /api/v1/ai/assessment/create-comprehensive
GET    /api/v1/ai/assessment/:assessmentId

11. Code Check Evaluation Engine
# Code Evaluation
POST   /api/v1/ai/code-eval/submit
GET    /api/v1/ai/code-eval/results/:submissionId
POST   /api/v1/ai/code-eval/test-cases/run

# Real-time Code Analysis
POST   /api/v1/ai/code-eval/analyze-snippet
POST   /api/v1/ai/code-eval/suggest-improvements

12. Plagiarism Check Engine
# Code Plagiarism
POST   /api/v1/ai/plagiarism/code/check
GET    /api/v1/ai/plagiarism/code/report/:checkId
POST   /api/v1/ai/plagiarism/code/compare

# Content Plagiarism
POST   /api/v1/ai/plagiarism/text/check
GET    /api/v1/ai/plagiarism/text/report/:checkId

# AI-Generated Content Detection
POST   /api/v1/ai/plagiarism/ai-detection
GET    /api/v1/ai/plagiarism/ai-detection/report/:checkId

13. LLM Interviewer Engine
# AI Interview Generation
POST   /api/v1/ai/interview/generate-questions
GET    /api/v1/ai/interview/:interviewId/questions
POST   /api/v1/ai/interview/project-based-questions

# Interview Simulation
POST   /api/v1/ai/interview/simulate/start
POST   /api/v1/ai/interview/simulate/:sessionId/respond
GET    /api/v1/ai/interview/simulate/:sessionId/transcript
POST   /api/v1/ai/interview/simulate/:sessionId/evaluate

14. X Council + Evaluation Engine (LLM Council)
# Council Evaluation
POST   /api/v1/ai/council/evaluate-candidate
GET    /api/v1/ai/council/evaluation/:evaluationId
GET    /api/v1/ai/council/evaluation/:evaluationId/agent-votes

# Agent Perspectives
GET    /api/v1/ai/council/evaluation/:evaluationId/technical-agent
GET    /api/v1/ai/council/evaluation/:evaluationId/communication-agent
GET    /api/v1/ai/council/evaluation/:evaluationId/culture-agent
GET    /api/v1/ai/council/evaluation/:evaluationId/growth-agent
GET    /api/v1/ai/council/evaluation/:evaluationId/risk-agent

# Final Ranking
POST   /api/v1/ai/council/generate-rankings
GET    /api/v1/ai/council/job/:jobId/rankings
GET    /api/v1/ai/council/candidate/:candidateId/explanation

15. GNN HR TeamFit Engine
# Team Fit Analysis
POST   /api/v1/ai/teamfit/analyze
GET    /api/v1/ai/teamfit/visualization/:analysisId
GET    /api/v1/ai/teamfit/visualization/:analysisId/3d-graph

# Gap Analysis
POST   /api/v1/ai/teamfit/gap-analysis
GET    /api/v1/ai/teamfit/gap-analysis/:analysisId/recommendations

# Redundancy Detection
POST   /api/v1/ai/teamfit/redundancy-check
GET    /api/v1/ai/teamfit/team/:teamId/skill-distribution


Assessment & Proctoring APIs
16. Online Assessment (OA) APIs
# Assessment Management
POST   /api/v1/assessment/create
GET    /api/v1/assessment/:assessmentId
PUT    /api/v1/assessment/:assessmentId
DELETE /api/v1/assessment/:assessmentId

# Assessment Sessions
POST   /api/v1/assessment/:assessmentId/start-session
GET    /api/v1/assessment/session/:sessionId
POST   /api/v1/assessment/session/:sessionId/submit
PATCH  /api/v1/assessment/session/:sessionId/save-progress

# Proctoring
POST   /api/v1/assessment/session/:sessionId/proctoring/start
POST   /api/v1/assessment/session/:sessionId/proctoring/facial-recognition
POST   /api/v1/assessment/session/:sessionId/proctoring/browser-activity
POST   /api/v1/assessment/session/:sessionId/proctoring/keystroke-dynamics
GET    /api/v1/assessment/session/:sessionId/proctoring/violations
POST   /api/v1/assessment/session/:sessionId/proctoring/flag-incident

17. Coding Round APIs
# Coding Sessions
POST   /api/v1/coding/session/create
GET    /api/v1/coding/session/:sessionId
POST   /api/v1/coding/session/:sessionId/start
POST   /api/v1/coding/session/:sessionId/submit-solution

# Real-time Code Monitoring
WS     /api/v1/coding/session/:sessionId/stream
POST   /api/v1/coding/session/:sessionId/code-snapshot
GET    /api/v1/coding/session/:sessionId/replay

# Live Plagiarism Detection
POST   /api/v1/coding/session/:sessionId/plagiarism/live-check
GET    /api/v1/coding/session/:sessionId/plagiarism/alerts


Forensic & Verification APIs
18. Profile Verification
# GitHub Analysis
POST   /api/v1/verification/github/:username/analyze
GET    /api/v1/verification/github/:username/commit-history
GET    /api/v1/verification/github/:username/project-authenticity

# Cross-platform Consistency
POST   /api/v1/verification/cross-platform/:candidateId/check
GET    /api/v1/verification/cross-platform/:candidateId/report
GET    /api/v1/verification/cross-platform/:candidateId/inconsistencies

# Digital Footprint Analysis
POST   /api/v1/verification/digital-footprint/:candidateId/analyze
GET    /api/v1/verification/digital-footprint/:candidateId/score


Advanced Features APIs
19. Smart Comparison Matrix
# Candidate Comparison
POST   /api/v1/comparison/create
POST   /api/v1/comparison/:comparisonId/add-candidate
DELETE /api/v1/comparison/:comparisonId/remove-candidate
GET    /api/v1/comparison/:comparisonId

# AI Analysis
POST   /api/v1/comparison/:comparisonId/generate-tradeoff-analysis
GET    /api/v1/comparison/:comparisonId/recommendations
GET    /api/v1/comparison/:comparisonId/matrix

20. Analytics & Reporting
# Job Analytics
GET    /api/v1/analytics/job/:jobId/overview
GET    /api/v1/analytics/job/:jobId/funnel
GET    /api/v1/analytics/job/:jobId/time-to-hire
GET    /api/v1/analytics/job/:jobId/candidate-sources

# Platform Analytics
GET    /api/v1/analytics/platform/overview
GET    /api/v1/analytics/platform/fraud-detection-stats
GET    /api/v1/analytics/platform/ai-accuracy-metrics
GET    /api/v1/analytics/platform/user-engagement

# Audit Trails
GET    /api/v1/analytics/audit/:jobId/decision-trail
GET    /api/v1/analytics/audit/:candidateId/actions


Webhook & Integration APIs
21. Webhooks
POST   /api/v1/webhooks/register
GET    /api/v1/webhooks
PUT    /api/v1/webhooks/:webhookId
DELETE /api/v1/webhooks/:webhookId
GET    /api/v1/webhooks/:webhookId/logs
POST   /api/v1/webhooks/:webhookId/test


Priority for Hackathon Prototype
For a working demo, I'd recommend implementing these core flows first:
Phase 1 (MVP):
Auth APIs
Profile Management (basic CRUD + LinkedIn integration)
Job Posting + JD Parser
FAISS Semantic Search (simplified)
Assessment Generation (MCQ + 1 coding problem)
Basic Leaderboard
Phase 2 (Demo-ready): 7. LLM Council Evaluation 8. Basic Proctoring (browser activity tracking) 9. GitHub Verification 10. Smart Comparison Matrix
Phase 3 (Polish): 11. GNN TeamFit Visualization 12. Complete Plagiarism Detection 13. Analytics Dashboard 14. Webhooks
Would you like me to create detailed request/response schemas for any specific service, or help you set up the project structure with these APIs?

