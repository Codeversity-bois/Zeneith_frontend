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

// Mock Assessments (Detailed)
export const mockAssessments = [
    {
        id: 'asm-001',
        title: 'Frontend Developer Assessment',
        company: 'Stripe',
        role: 'Frontend Engineer',
        duration: 60, // minutes
        totalQuestions: 25,
        status: 'pending',
        dueDate: new Date('2024-02-15'),
        sections: [
            {
                id: 'sec-1',
                title: 'Aptitude & Logic',
                type: 'mcq',
                questions: [
                    {
                        id: 'q-mcq-1',
                        text: 'Which number completes the sequence: 2, 5, 10, 17, ...?',
                        options: ['24', '26', '25', '27'],
                        correct: 1 // Index
                    },
                    {
                        id: 'q-mcq-2',
                        text: 'If A is the brother of B; B is the sister of C; and C is the father of D, how is D related to A?',
                        options: ['Nephew', 'Niece', 'Nephew or Niece', 'Cannot be determined'],
                        correct: 2
                    }
                ]
            },
            {
                id: 'sec-2',
                title: 'Technical Knowledge',
                type: 'subjective',
                questions: [
                    {
                        id: 'q-sub-1',
                        text: 'Explain the concept of "Hoisting" in JavaScript.',
                        minLength: 50,
                        maxLength: 300
                    },
                    {
                        id: 'q-sub-2',
                        text: 'Describe the difference between Local Storage, Session Storage, and Cookies.',
                        minLength: 50,
                        maxLength: 500
                    }
                ]
            },
            {
                id: 'sec-3',
                title: 'Coding Challenge',
                type: 'coding',
                questions: [
                    {
                        id: 'q-code-1',
                        title: 'Two Sum',
                        text: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
                        language: 'javascript',
                        starterCode: 'function twoSum(nums, target) {\n  // Your code here\n}',
                        testCases: [
                            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
                            { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'asm-002',
        title: 'Backend System Design',
        company: 'Netflix',
        role: 'Senior Backend Engineer',
        duration: 90,
        totalQuestions: 15,
        status: 'completed',
        score: 88,
        completedDate: new Date('2024-01-25'),
        dueDate: new Date('2024-02-01'),
        sections: [] // Simplified for completed
    },
    {
        id: 'asm-003',
        title: 'React Core Assessment',
        company: 'Meta',
        role: 'UI Engineer',
        duration: 45,
        totalQuestions: 20,
        status: 'pending',
        dueDate: new Date('2024-02-10'),
        sections: [
            {
                id: 'sec-1',
                title: 'React Fundamentals',
                type: 'mcq',
                questions: [
                    {
                        id: 'q-mcq-1',
                        text: 'What is the virtual DOM?',
                        options: ['A direct copy of the real DOM', 'A lightweight representation of the real DOM', 'A plugin for browser', 'None of the above'],
                        correct: 1
                    }
                ]
            }
        ]
    }
];

export const mockSessions = [
    {
        id: 'sess-001',
        assessmentId: 'asm-001',
        candidateId: 'user-001',
        status: 'in-progress',
        currentPhase: 'aptitude', // aptitude, coding, interview
        currentSectionIndex: 0,
        startTime: new Date('2024-02-07T10:00:00'),
        answers: {
            'sec-1': { 'q-mcq-1': 0 } // Partial answer
        },
        codingSessionId: null
    }
];

export default {
    mockJobs,
    mockApplications,
    mockCandidates,
    mockUsers,
    mockStats,
    mockNotifications,
    mockAssessmentQuestions,
    pipelineStages,
    mockAssessments,
    mockSessions, // Added
    getMockData,
};
