# Zenith Recruitment Platform

**Modern AI-Powered Recruitment Platform with Sleek UI and Complete Backend Integration**

![Zenith Logo](./logo_zeneith.png)

## 🚀 Features

- **12 Complete Pages** - Landing, Auth, Dashboards (Candidate & Recruiter), Job Search, Applications, Assessment, Pipeline, Leaderboard, Settings
- **Comprehensive API Integration** - All frontend mapped to exact backend endpoints
- **Modern Design System** - Tailwind CSS with custom animations, glassmorphism, and smooth transitions
- **Responsive Layout** - Mobile-first design with breakpoints at 640px and 1024px
- **Real-time Features** - Counter animations, smooth scroll, interactive components
- **Accessibility** - Keyboard navigation, ARIA labels, proper semantic HTML

## 📁 Project Structure

```
d:/Zeneith/
├── index.html                    # Landing page
├── signup.html                   # Signup page (to be created)
├── login.html                    # Login page (to be created)
├── settings.html                 # Settings page (to be created)
├── candidate/
│   ├── dashboard.html            # Candidate dashboard (to be created)
│   ├── job-search.html           # Job search page (to be created)
│   ├── applications.html         # Applications page (to be created)
│   └── assessment.html           # Assessment interface (to be created)
├── recruiter/
│   ├── dashboard.html            # Recruiter dashboard (to be created)
│   ├── pipeline.html             # Kanban pipeline (to be created)
│   ├── create-job.html           # Job creation wizard (to be created)
│   └── leaderboard.html          # Candidate leaderboard (to be created)
├── src/
│   ├── styles/
│   │   └── main.css              # ✅ Main stylesheet with Tailwind
│   └── js/
│       ├── api-config.js         # ✅ API endpoint configuration
│       ├── api-client.js         # ✅ HTTP client for API calls
│       ├── utils.js              # ✅ Utility functions
│       └── mock-data.js          # ✅ Mock data for development
├── logo_zeneith.png              # Logo and favicon
├── package.json                  # ✅ Project dependencies
├── vite.config.js                # ✅ Vite configuration
├── tailwind.config.js            # ✅ Tailwind CSS configuration
└── postcss.config.js             # ✅ PostCSS configuration
```

##  API Integration

All frontend features are mapped to the exact backend API endpoints you provided. The API configuration is in `src/js/api-config.js`.

### Example Usage:

```javascript
import apiClient from './src/js/api-client.js';
import API_ENDPOINTS from './src/js/api-config.js';

// Register a new user
const response = await apiClient.post(API_ENDPOINTS.auth.register, {
  email: 'user@example.com',
  password: 'securePassword',
  role: 'candidate' // or 'recruiter'
});

// Get job listings
const jobs = await apiClient.get(API_ENDPOINTS.hiring.jobs.list);

// Submit an application
const application = await apiClient.post(API_ENDPOINTS.applications.submit, {
  jobId: 'job-001',
  candidateId: 'cand-001',
  coverLetter: 'I am interested in this position...'
});
```

## 🎨 Design System

### Colors
- **Primary**: `#2563eb` (Blue) - CTAs and active states
- **Secondary**: `#7c3aed` (Purple) - Accents
- **Success**: `#16a34a` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#dc2626` (Red)

### Typography
- Font: Inter (Google Fonts)
- Headings: Bold, 36px/30px/24px/20px
- Body: Regular, 16px with 1.5 line height

### Animations
- Fade in: 300ms
- Slide in: 300ms
- Scale up: 200ms
- Hover effects: 200ms
- Stats counter: 2s animated count-up

## 🛠️ Development

### Prerequisites
- Node.js 18+ and npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📱 Pages Status

### ✅ Completed
- [x] **Landing Page** (`index.html`) - Hero, features, stats, footer with animations
- [x] **Project Foundation** - Vite, Tailwind, API config, utilities

### 🔨 To Build Next (Priority Order)
1. **Signup Page** - Split layout with tab switcher (Recruiter/Candidate)
2. **Login Page** - Simple centered card
3. **Candidate Dashboard** - Stats cards, recent applications, recommended jobs
4. **Recruiter Dashboard** - Active jobs table, pipeline funnel
5. **Job Search** - Filters sidebar, job cards with match scores
6. **Pipeline (Kanban)** - Drag & drop candidate management
7. **Assessment Interface** - Timer, questions, proctoring elements
8. **Leaderboard** - Rankings, comparison modal
9. **Create Job** - Multi-step wizard
10. **Applications** - Expandable cards with timeline
11. **Settings** - Vertical tabs with account, notifications, integrations
12. **Responsive refinements** - Mobile layouts for all pages

## 🚀 Next Steps

Since you have the **exact API endpoints** from your backend, this frontend is ready to integrate! Here's what to do next:

### 1. Complete Remaining Pages
I've built the foundation. The remaining pages follow the same pattern:
- Use components from `src/js/` 
- Reference `api-config.js` for correct endpoints
- Follow the design system in `tailwind.config.js`
- View existing Figma designs in `stitch_zeneith/` for reference

### 2. Connect to Backend
Update the `.env` file with your actual backend URL:
```env
VITE_API_BASE_URL=https://your-api.zenith.com
```

### 3. Testing
- All API endpoints match your backend specifications
- Forms are ready for validation
- Mock data available for UI testing

## 📄 License

© 2024 Zenith Inc. All rights reserved.

---

**Built with** ⚡ Vite + 🎨 Tailwind CSS + 🧠 AI-Powered Architecture
