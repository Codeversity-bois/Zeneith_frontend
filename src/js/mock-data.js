/**
 * Mock Data for Development
 * This simulates data that would come from the backend APIs
 */

// Mock Jobs
export const mockJobs = [
    {
        id: 'job-001',
        title: 'Senior Full Stack Engineer',
        company: 'TechCorp',
        logo: 'https://via.placeholder.com/48/2563eb/ffffff?text=TC',
        location: 'Remote',
        type: 'Full-time',
        salaryMin: 120000,
        salaryMax: 180000,
        postedDate: new Date('2024-01-20'),
        matchScore: 92,
        skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
        description: 'We are seeking a talented Senior Full Stack Engineer to join our growing team...',
        department: 'Engineering',
        status: 'active',
        applicants: 45,
    },
    {
        id: 'job-002',
        title: 'Product Designer',
        company: 'DesignHub',
        logo: 'https://via.placeholder.com/48/7c3aed/ffffff?text=DH',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salaryMin: 100000,
        salaryMax: 140000,
        postedDate: new Date('2024-01-18'),
        matchScore: 87,
        skills: ['Figma', 'UI/UX', 'Prototyping'],
        description: 'Join our design team to create amazing user experiences...',
        department: 'Design',
        status: 'active',
        applicants: 32,
    },
    // Add more mock jobs...
];

// Mock Applications
export const mockApplications = [
    {
        id: 'app-001',
        jobId: 'job-001',
        jobTitle: 'Senior Full Stack Engineer',
        company: 'TechCorp',
        logo: 'https://via.placeholder.com/48/2563eb/ffffff?text=TC',
        appliedDate: new Date('2024-01-22'),
        status: 'under_review',
        stage: 'screening',
    },
    {
        id: 'app-002',
        jobId: 'job-002',
        jobTitle: 'Product Designer',
        company: 'DesignHub',
        logo: 'https://via.placeholder.com/48/7c3aed/ffffff?text=DH',
        appliedDate: new Date('2024-01-20'),
        status: 'shortlisted',
        stage: 'interview',
    },
];

// Mock Candidates (for recruiter view)
export const mockCandidates = [
    {
        id: 'cand-001',
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Full Stack Engineer',
        matchScore: 94,
        skills: ['React', 'Node.js', 'Python', 'AWS'],
        experience: '5 years',
        education: 'BS Computer Science',
        stage: 'interview',
        appliedDate: new Date('2024-01-20'),
    },
    {
        id: 'cand-002',
        name: 'Michael Chen',
        avatar: 'https://i.pravatar.cc/150?img=12',
        role: 'Frontend Developer',
        matchScore: 89,
        skills: ['React', 'TypeScript', 'CSS'],
        experience: '3 years',
        education: 'BS Software Engineering',
        stage: 'assessment',
        appliedDate: new Date('2024-01-19'),
    },
];

// Mock User Data
export const mockUsers = {
    candidate: {
        id: 'user-001',
        name: 'Alex Morgan',
        email: 'alex.morgan@email.com',
        avatar: 'https://i.pravatar.cc/150?img=33',
        role: 'candidate',
        profile: {
            title: 'Full Stack Developer',
            bio: 'Passionate software engineer with 5 years of experience...',
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
            experience: [
                {
                    company: 'TechStartup Inc',
                    title: 'Senior Developer',
                    duration: '2021 - Present',
                },
            ],
        },
    },
    recruiter: {
        id: 'user-100',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        avatar: 'https://i.pravatar.cc/150?img=5',
        role: 'recruiter',
        company: 'TechCorp',
    },
};

// Mock Statistics
export const mockStats = {
    candidate: {
        totalApplications: 12,
        inProgress: 5,
        interviews: 2,
        offers: 0,
    },
    recruiter: {
        activeJobs: 12,
        totalApplications: 845,
        shortlisted: 45,
        interviews: 28,
        offersExtended: 6,
    },
};

// Mock Notifications
export const mockNotifications = [
    {
        id: 'notif-001',
        type: 'application_update',
        title: 'Application Shortlisted',
        message: 'Your application for Senior Full Stack Engineer has been shortlisted!',
        timestamp: new Date('2024-01-23T10:30:00'),
        read: false,
    },
    {
        id: 'notif-002',
        type: 'interview_scheduled',
        title: 'Interview Scheduled',
        message: 'Interview with TechCorp scheduled for tomorrow at 2:00 PM',
        timestamp: new Date('2024-01-22T15:00:00'),
        read: true,
    },
];

// Mock Assessment Questions
export const mockAssessmentQuestions = [
    {
        id: 'q-001',
        type: 'mcq',
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 1,
    },
    {
        id: 'q-002',
        type: 'coding',
        question: 'Write a function to reverse a linked list',
        starterCode: 'function reverseLinkedList(head) {\n  // Your code here\n}',
        testCases: [
            { input: '[1,2,3,4,5]', output: '[5,4,3,2,1]' },
        ],
    },
];

// Pipeline Stages
export const pipelineStages = [
    { id: 'applied', name: 'Applied', color: 'blue', count: 845 },
    { id: 'screening', name: 'Screening', color: 'indigo', count: 320 },
    { id: 'assessment', name: 'Assessment', color: 'purple', count: 150 },
    { id: 'interview', name: 'Interview', color: 'orange', count: 45 },
    { id: 'offer', name: 'Offer', color: 'green', count: 6 },
    { id: 'rejected', name: 'Rejected', color: 'red', count: 284 },
];

// Export helper function to get mock data
export function getMockData(type) {
    const dataMap = {
        jobs: mockJobs,
        applications: mockApplications,
        candidates: mockCandidates,
        users: mockUsers,
        stats: mockStats,
        notifications: mockNotifications,
        assessmentQuestions: mockAssessmentQuestions,
        pipelineStages,
    };

    return dataMap[type] || [];
}

export default {
    mockJobs,
    mockApplications,
    mockCandidates,
    mockUsers,
    mockStats,
    mockNotifications,
    mockAssessmentQuestions,
    pipelineStages,
    getMockData,
};
