import { Employee, Task, Notification, Badge } from '@/types';

const BADGE_DEFS: Record<string, Omit<Badge, 'earnedAt'>> = {
  starter: { id: 'starter', name: 'Getting Started', icon: '🚀', description: 'Completed 5 tasks' },
  veteran: { id: 'veteran', name: 'Veteran', icon: '⭐', description: 'Completed 20 tasks' },
  punctual: { id: 'punctual', name: 'Always On Time', icon: '⏰', description: '10 tasks on time' },
  highscorer: { id: 'highscorer', name: 'High Scorer', icon: '🏆', description: 'Earned 200+ points' },
  speedster: { id: 'speedster', name: 'Speedster', icon: '⚡', description: 'Completed 3 tasks in one day' },
};

export const SKILLS_LIST = [
  'React', 'Java', 'Python', 'SQL', 'Machine Learning',
  'UI/UX Design', 'DevOps', 'Node.js', 'Data Analysis',
  'Project Management', 'Testing', 'Cloud Architecture',
];

export const mockEmployees: Employee[] = [
  {
    id: 'e1', name: 'Sarah Chen', email: 'sarah@company.com', avatar: '',
    role: 'employee', department: 'Engineering',
    skills: [{ name: 'React', level: 0.9 }, { name: 'Node.js', level: 0.8 }, { name: 'UI/UX Design', level: 0.7 }],
    workload: 0.4, availability: 0.9, status: 'active',
    points: 250, badges: [BADGE_DEFS.starter, BADGE_DEFS.highscorer].map(b => ({ ...b, earnedAt: '2024-01-15' })),
    tasksCompleted: 18, tasksOnTime: 15,
  },
  {
    id: 'e2', name: 'Marcus Johnson', email: 'marcus@company.com', avatar: '',
    role: 'employee', department: 'Engineering',
    skills: [{ name: 'Java', level: 0.95 }, { name: 'SQL', level: 0.85 }, { name: 'Cloud Architecture', level: 0.7 }],
    workload: 0.6, availability: 0.7, status: 'active',
    points: 180, badges: [BADGE_DEFS.starter].map(b => ({ ...b, earnedAt: '2024-02-01' })),
    tasksCompleted: 14, tasksOnTime: 11,
  },
  {
    id: 'e3', name: 'Priya Patel', email: 'priya@company.com', avatar: '',
    role: 'employee', department: 'Data Science',
    skills: [{ name: 'Python', level: 0.9 }, { name: 'Machine Learning', level: 0.85 }, { name: 'Data Analysis', level: 0.9 }],
    workload: 0.3, availability: 0.95, status: 'active',
    points: 310, badges: [BADGE_DEFS.starter, BADGE_DEFS.highscorer, BADGE_DEFS.punctual].map(b => ({ ...b, earnedAt: '2024-01-20' })),
    tasksCompleted: 22, tasksOnTime: 20,
  },
  {
    id: 'e4', name: 'Alex Rivera', email: 'alex@company.com', avatar: '',
    role: 'employee', department: 'DevOps',
    skills: [{ name: 'DevOps', level: 0.9 }, { name: 'Cloud Architecture', level: 0.8 }, { name: 'Python', level: 0.6 }],
    workload: 0.7, availability: 0.5, status: 'active',
    points: 145, badges: [BADGE_DEFS.starter].map(b => ({ ...b, earnedAt: '2024-03-01' })),
    tasksCompleted: 12, tasksOnTime: 9,
  },
  {
    id: 'e5', name: 'Emily Watson', email: 'emily@company.com', avatar: '',
    role: 'employee', department: 'Design',
    skills: [{ name: 'UI/UX Design', level: 0.95 }, { name: 'React', level: 0.6 }, { name: 'Testing', level: 0.5 }],
    workload: 0.2, availability: 1.0, status: 'active',
    points: 200, badges: [BADGE_DEFS.starter, BADGE_DEFS.speedster].map(b => ({ ...b, earnedAt: '2024-02-15' })),
    tasksCompleted: 16, tasksOnTime: 14,
  },
  {
    id: 'e6', name: 'David Kim', email: 'david@company.com', avatar: '',
    role: 'employee', department: 'Engineering',
    skills: [{ name: 'Java', level: 0.8 }, { name: 'React', level: 0.7 }, { name: 'SQL', level: 0.75 }],
    workload: 0.5, availability: 0.0, status: 'on-leave',
    points: 90, badges: [],
    tasksCompleted: 8, tasksOnTime: 6,
  },
];

export const mockTasks: Task[] = [
  {
    id: 't1', title: 'Build User Dashboard', description: 'Create interactive dashboard with charts and filters',
    requiredSkills: ['React', 'UI/UX Design'], priority: 'high', status: 'in-progress',
    assignedTo: 'e1', deadline: '2024-04-15', createdAt: '2024-03-20', estimatedHours: 24, suitabilityScore: 0.87,
  },
  {
    id: 't2', title: 'API Performance Optimization', description: 'Optimize database queries and API response times',
    requiredSkills: ['Java', 'SQL'], priority: 'critical', status: 'assigned',
    assignedTo: 'e2', deadline: '2024-04-10', createdAt: '2024-03-18', estimatedHours: 16, suitabilityScore: 0.92,
  },
  {
    id: 't3', title: 'ML Model Training Pipeline', description: 'Set up automated pipeline for model retraining',
    requiredSkills: ['Python', 'Machine Learning'], priority: 'high', status: 'in-progress',
    assignedTo: 'e3', deadline: '2024-04-20', createdAt: '2024-03-22', estimatedHours: 32, suitabilityScore: 0.95,
  },
  {
    id: 't4', title: 'CI/CD Pipeline Setup', description: 'Configure deployment pipelines for microservices',
    requiredSkills: ['DevOps', 'Cloud Architecture'], priority: 'medium', status: 'assigned',
    assignedTo: 'e4', deadline: '2024-04-25', createdAt: '2024-03-25', estimatedHours: 20, suitabilityScore: 0.88,
  },
  {
    id: 't5', title: 'Redesign Landing Page', description: 'Modern redesign with improved UX',
    requiredSkills: ['UI/UX Design', 'React'], priority: 'medium', status: 'completed',
    assignedTo: 'e5', deadline: '2024-03-30', createdAt: '2024-03-10', completedAt: '2024-03-28', estimatedHours: 16, suitabilityScore: 0.82,
  },
  {
    id: 't6', title: 'Database Migration', description: 'Migrate legacy database to new schema',
    requiredSkills: ['SQL', 'Java'], priority: 'high', status: 'reassigned',
    assignedTo: 'e2', previousAssignee: 'e6', deadline: '2024-04-12', createdAt: '2024-03-15', estimatedHours: 28, suitabilityScore: 0.85,
  },
  {
    id: 't7', title: 'Data Analysis Report', description: 'Quarterly performance data analysis',
    requiredSkills: ['Data Analysis', 'Python'], priority: 'low', status: 'pending',
    deadline: '2024-04-30', createdAt: '2024-03-28', estimatedHours: 12,
  },
  {
    id: 't8', title: 'Security Audit', description: 'Conduct security review of authentication system',
    requiredSkills: ['Cloud Architecture', 'Testing'], priority: 'critical', status: 'pending',
    deadline: '2024-04-08', createdAt: '2024-03-27', estimatedHours: 20,
  },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'assignment', title: 'New Task Assigned', message: 'You have been assigned "Build User Dashboard"', read: false, createdAt: '2024-03-20T10:00:00Z', targetUserId: 'e1' },
  { id: 'n2', type: 'reassignment', title: 'Task Reassigned', message: '"Database Migration" has been reassigned to Marcus due to David\'s leave', read: false, createdAt: '2024-03-26T09:00:00Z', targetUserId: 'e2' },
  { id: 'n3', type: 'badge', title: 'Badge Earned! 🏆', message: 'Priya earned "High Scorer" badge', read: true, createdAt: '2024-03-22T14:00:00Z', targetUserId: 'e3' },
  { id: 'n4', type: 'completion', title: 'Task Completed', message: 'Emily completed "Redesign Landing Page" on time', read: true, createdAt: '2024-03-28T16:00:00Z' },
  { id: 'n5', type: 'insight', title: 'Performance Insight', message: 'Alex Rivera\'s workload is above 70%. Consider rebalancing.', read: false, createdAt: '2024-03-29T08:00:00Z' },
];

export const DEPARTMENTS = ['Engineering', 'Data Science', 'DevOps', 'Design', 'Management'];
