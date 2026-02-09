export type Role = 'admin' | 'employee';

export interface Skill {
  name: string;
  level: number; // 0-1
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  skills: Skill[];
  workload: number; // 0-1 current workload ratio
  availability: number; // 0-1 availability score
  status: 'active' | 'on-leave' | 'absent';
  points: number;
  badges: Badge[];
  tasksCompleted: number;
  tasksOnTime: number;
  department: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'reassigned';
  assignedTo?: string;
  previousAssignee?: string;
  deadline: string;
  createdAt: string;
  completedAt?: string;
  estimatedHours: number;
  suitabilityScore?: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export interface Notification {
  id: string;
  type: 'assignment' | 'reassignment' | 'completion' | 'badge' | 'insight';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  targetUserId?: string;
}

export interface SuitabilityScore {
  employeeId: string;
  employeeName: string;
  score: number;
  skillMatch: number;
  availabilityScore: number;
  workloadPenalty: number;
}
