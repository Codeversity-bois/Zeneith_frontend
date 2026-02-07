# Zenith API Endpoints

## Authentication & User Management

### POST /api/v1/auth/register
Create new user account
**Parameters:**
- `email` (string, required)
- `password` (string, required)
- `name` (string, required)
- `role` (string, required) - "candidate" or "recruiter"
- `company` (string, optional)

### POST /api/v1/auth/login
User login
**Parameters:**
- `email` (string, required)
- `password` (string, required)

**Returns:**
- `user` (object) - User profile data
- `token` (string) - JWT authentication token
- `role` (string) - User role

### GET /api/v1/profiles/candidate/:id
Get candidate profile
**Returns:**
- `id` (string)
- `name` (string)
- `email` (string)
- `phone` (string)
- `location` (string)
- `skills` (array of strings)
- `experience` (array of objects)
- `education` (array of objects)
- `resume_url` (string)
- `linkedin_url` (string)
- `github_url` (string)

### GET /api/v1/profiles/recruiter/:id
Get recruiter profile
**Returns:**
- `id` (string)
- `name` (string)
- `email` (string)
- `company` (string)
- `position` (string)
- `department` (string)

## Job Management

### GET /api/v1/jobs
List all jobs
**Query Parameters:**
- `status` (string, optional) - "active", "closed", "draft"
- `department` (string, optional)
- `location` (string, optional)
- `limit` (number, optional)
- `offset` (number, optional)

**Returns:**
- `jobs` (array)
  - `id` (string)
  - `title` (string)
  - `company` (string)
  - `department` (string)
  - `location` (string)
  - `type` (string) - "full-time", "part-time", "contract"
  - `salary_min` (number)
  - `salary_max` (number)
  - `description` (string)
  - `requirements` (array of strings)
  - `posted_date` (string, ISO 8601)
  - `status` (string)
  - `applicants_count` (number)

### GET /api/v1/jobs/:id
Get specific job details

### POST /api/v1/jobs
Create new job posting (Recruiter only)
**Parameters:**
- `title` (string, required)
- `department` (string, required)
- `location` (string, required)
- `type` (string, required)
- `salary_min` (number, optional)
- `salary_max` (number, optional)
- `description` (string, required)
- `requirements` (array of strings, required)

## Applications

### GET /api/v1/applications/candidate/:candidateId
Get all applications for a candidate
**Returns:**
- `applications` (array)
  - `id` (string)
  - `job_id` (string)
  - `job_title` (string)
  - `company` (string)
  - `status` (string) - "Applied", "Screening", "Interviewing", "Shortlisted", "Offered", "Rejected", "Closed"
  - `applied_date` (string, ISO 8601)
  - `last_updated` (string, ISO 8601)
  - `current_stage` (string)

### GET /api/v1/applications/job/:jobId
Get all applications for a job (Recruiter only)

### POST /api/v1/applications
Submit job application
**Parameters:**
- `job_id` (string, required)
- `candidate_id` (string, required)
- `cover_letter` (string, optional)

## Assessments

### GET /api/v1/assessments/candidate/:candidateId
Get all assessments for a candidate
**Returns:**
- `assessments` (array)
  - `id` (string)
  - `title` (string)
  - `description` (string)
  - `job_id` (string)
  - `job_title` (string)
  - `company` (string)
  - `type` (string) - "technical", "behavioral", "cognitive"
  - `duration_minutes` (number)
  - `total_questions` (number)
  - `status` (string) - "pending", "in-progress", "completed", "expired"
  - `due_date` (string, ISO 8601)
  - `score` (number, optional) - Only for completed
  - `max_score` (number, optional)
  - `completed_date` (string, ISO 8601, optional)

### GET /api/v1/assessments/:id
Get specific assessment details

### POST /api/v1/assessments/:id/start
Start an assessment session

### POST /api/v1/assessments/:id/submit
Submit assessment answers
**Parameters:**
- `answers` (array of objects)
  - `question_id` (string)
  - `answer` (any)

## Pipeline & Candidates

### GET /api/v1/hiring/jobs/:jobId/pipeline
Get candidate pipeline for a job
**Returns:**
- `pipeline` (object)
  - `applied` (number)
  - `screening` (number)
  - `assessment` (number)
  - `interview` (number)
  - `offer` (number)
- `candidates` (array by stage)

### GET /api/v1/hiring/candidates
Get all candidates (Recruiter only)
**Query Parameters:**
- `job_id` (string, optional)
- `stage` (string, optional)
- `limit` (number, optional)
- `offset` (number, optional)

**Returns:**
- `candidates` (array)
  - `id` (string)
  - `name` (string)
  - `email` (string)
  - `phone` (string)
  - `current_stage` (string)
  - `application_date` (string, ISO 8601)
  - `score` (number, optional)
  - `notes` (string, optional)

### GET /api/v1/hiring/candidates/:id
Get specific candidate details

## Analytics & Metrics

### GET /api/v1/analytics/dashboard/recruiter
Get recruiter dashboard metrics
**Returns:**
- `active_jobs_count` (number)
- `total_applications_count` (number)
- `shortlisted_count` (number)
- `interviews_this_week` (number)
- `offers_extended_count` (number)
- `pipeline_metrics` (object)
  - `applied` (number)
  - `screening` (number)
  - `assessment` (number)
  - `interview` (number)
  - `offer` (number)

### GET /api/v1/analytics/dashboard/candidate
Get candidate dashboard metrics
**Returns:**
- `total_applications_count` (number)
- `in_progress_count` (number)
- `upcoming_interviews_count` (number)
- `offers_count` (number)
- `recent_activity` (array)

## Interviews & Scheduling

### GET /api/v1/interviews/candidate/:candidateId
Get candidate's interviews

### GET /api/v1/interviews/recruiter
Get recruiter's scheduled interviews

### POST /api/v1/interviews
Schedule new interview
**Parameters:**
- `application_id` (string, required)
- `date_time` (string, ISO 8601, required)
- `duration_minutes` (number, required)
- `type` (string, required) - "phone", "video", "in-person"
- `interviewer_ids` (array of strings, required)
- `notes` (string, optional)

## Notifications

### GET /api/v1/notifications/:userId
Get user notifications
**Returns:**
- `notifications` (array)
  - `id` (string)
  - `type` (string)
  - `title` (string)
  - `message` (string)
  - `read` (boolean)
  - `created_at` (string, ISO 8601)
  - `action_url` (string, optional)

### PUT /api/v1/notifications/:id/read
Mark notification as read
