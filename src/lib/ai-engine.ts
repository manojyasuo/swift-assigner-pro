import { Employee, Task, SuitabilityScore } from '@/types';

// AI Scoring Parameters (from the research paper)
const ALPHA = 0.5; // Skill match weight
const BETA = 0.3;  // Availability weight
const GAMMA = 0.2; // Workload penalty weight
const TASK_SCORE_WEIGHT = 10; // Points per task completion

/**
 * Calculate skill match between employee skills and task requirements
 * SkillMatch(Si, Tj) = intersection of skills / required skills
 */
export function calculateSkillMatch(employee: Employee, task: Task): number {
  if (task.requiredSkills.length === 0) return 1;
  
  const employeeSkillNames = employee.skills.map(s => s.name.toLowerCase());
  const matchedSkills = task.requiredSkills.filter(
    req => employeeSkillNames.includes(req.toLowerCase())
  );
  
  const matchRatio = matchedSkills.length / task.requiredSkills.length;
  
  // Also factor in skill level for matched skills
  const avgSkillLevel = matchedSkills.length > 0
    ? employee.skills
        .filter(s => matchedSkills.includes(s.name.toLowerCase()))
        .reduce((sum, s) => sum + s.level, 0) / matchedSkills.length
    : 0;
  
  return matchRatio * 0.6 + avgSkillLevel * 0.4;
}

/**
 * Suitability scoring function from the paper:
 * f(Ei, Tj) = α · SkillMatch(Si, Tj) + β · AvailabilityScore(Ai) − γ · Workload(Wi)
 */
export function calculateSuitabilityScore(employee: Employee, task: Task): SuitabilityScore {
  const skillMatch = calculateSkillMatch(employee, task);
  const availabilityScore = employee.availability;
  const workloadPenalty = employee.workload;

  const score = ALPHA * skillMatch + BETA * availabilityScore - GAMMA * workloadPenalty;

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    score: Math.max(0, Math.min(1, score)),
    skillMatch,
    availabilityScore,
    workloadPenalty,
  };
}

/**
 * Find the best employee for a task: E* = arg max f(Ei, Tp)
 */
export function findBestEmployee(employees: Employee[], task: Task): SuitabilityScore | null {
  const available = employees.filter(e => e.status === 'active');
  if (available.length === 0) return null;

  const scores = available.map(e => calculateSuitabilityScore(e, task));
  scores.sort((a, b) => b.score - a.score);
  return scores[0];
}

/**
 * Rank all employees for a task
 */
export function rankEmployeesForTask(employees: Employee[], task: Task): SuitabilityScore[] {
  const available = employees.filter(e => e.status === 'active');
  const scores = available.map(e => calculateSuitabilityScore(e, task));
  scores.sort((a, b) => b.score - a.score);
  return scores;
}

/**
 * Dynamic reallocation: reassign tasks from absent employee
 */
export function reallocateTasks(
  absentEmployeeId: string,
  tasks: Task[],
  employees: Employee[]
): { task: Task; newAssignee: SuitabilityScore }[] {
  const pendingTasks = tasks.filter(
    t => t.assignedTo === absentEmployeeId && t.status !== 'completed'
  );
  
  const availableEmployees = employees.filter(
    e => e.id !== absentEmployeeId && e.status === 'active'
  );

  return pendingTasks.map(task => {
    const best = findBestEmployee(availableEmployees, task);
    return { task, newAssignee: best! };
  }).filter(r => r.newAssignee);
}

/**
 * Gamification: Calculate points for task completion
 * Pi(t) = Pi(t-1) + w · TaskScore(Tj)
 */
export function calculateTaskPoints(task: Task, completedOnTime: boolean): number {
  const priorityMultiplier = { low: 1, medium: 1.5, high: 2, critical: 3 };
  const baseScore = TASK_SCORE_WEIGHT * priorityMultiplier[task.priority];
  const timeBonus = completedOnTime ? 1.5 : 1;
  return Math.round(baseScore * timeBonus);
}

/**
 * Determine badges based on achievements
 */
export function checkBadgeEligibility(employee: Employee): string[] {
  const newBadges: string[] = [];
  if (employee.tasksCompleted >= 5 && !employee.badges.find(b => b.id === 'starter')) {
    newBadges.push('starter');
  }
  if (employee.tasksCompleted >= 20 && !employee.badges.find(b => b.id === 'veteran')) {
    newBadges.push('veteran');
  }
  if (employee.tasksOnTime >= 10 && !employee.badges.find(b => b.id === 'punctual')) {
    newBadges.push('punctual');
  }
  if (employee.points >= 200 && !employee.badges.find(b => b.id === 'highscorer')) {
    newBadges.push('highscorer');
  }
  return newBadges;
}
