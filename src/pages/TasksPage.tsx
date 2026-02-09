import React, { useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { rankEmployeesForTask } from '@/lib/ai-engine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SKILLS_LIST } from '@/lib/mock-data';
import { Brain, Plus, CheckCircle, Clock, Zap, ArrowRight } from 'lucide-react';
import { Task } from '@/types';

const priorityConfig = {
  critical: { color: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Critical' },
  high: { color: 'bg-warning/10 text-warning border-warning/20', label: 'High' },
  medium: { color: 'bg-primary/10 text-primary border-primary/20', label: 'Medium' },
  low: { color: 'bg-muted text-muted-foreground border-border', label: 'Low' },
};

const statusConfig = {
  pending: { color: 'bg-muted text-muted-foreground', icon: Clock },
  assigned: { color: 'bg-warning/10 text-warning', icon: ArrowRight },
  'in-progress': { color: 'bg-primary/10 text-primary', icon: Zap },
  completed: { color: 'bg-success/10 text-success', icon: CheckCircle },
  reassigned: { color: 'bg-info/10 text-info', icon: ArrowRight },
};

const TasksPage = () => {
  const { tasks, employees, assignTask, completeTask, addTask } = useAppData();
  const { isAdmin } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [showScores, setShowScores] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Create task form
  const [newTask, setNewTask] = useState({
    title: '', description: '', requiredSkills: [] as string[],
    priority: 'medium' as Task['priority'], deadline: '', estimatedHours: 8,
  });

  const handleCreate = () => {
    if (!newTask.title || !newTask.deadline) return;
    addTask(newTask);
    setNewTask({ title: '', description: '', requiredSkills: [], priority: 'medium', deadline: '', estimatedHours: 8 });
    setShowCreate(false);
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const assignee = (id?: string) => employees.find(e => e.id === id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {isAdmin ? 'Task Management' : 'My Tasks'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAdmin ? 'Create, assign, and manage tasks with AI scoring' : 'Your assigned tasks'}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px] text-xs">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="reassigned">Reassigned</SelectItem>
            </SelectContent>
          </Select>
          {isAdmin && (
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button size="sm" className="gradient-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-1" /> New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display">Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div>
                    <Label>Title</Label>
                    <Input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} placeholder="Task title" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} placeholder="Describe the task" />
                  </div>
                  <div>
                    <Label>Required Skills</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {SKILLS_LIST.map(skill => (
                        <button
                          key={skill}
                          onClick={() => setNewTask(p => ({
                            ...p,
                            requiredSkills: p.requiredSkills.includes(skill)
                              ? p.requiredSkills.filter(s => s !== skill)
                              : [...p.requiredSkills, skill],
                          }))}
                          className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${
                            newTask.requiredSkills.includes(skill)
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-muted border-border text-muted-foreground hover:border-primary/50'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Priority</Label>
                      <Select value={newTask.priority} onValueChange={(v: Task['priority']) => setNewTask(p => ({ ...p, priority: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Estimated Hours</Label>
                      <Input type="number" value={newTask.estimatedHours} onChange={e => setNewTask(p => ({ ...p, estimatedHours: Number(e.target.value) }))} />
                    </div>
                  </div>
                  <div>
                    <Label>Deadline</Label>
                    <Input type="date" value={newTask.deadline} onChange={e => setNewTask(p => ({ ...p, deadline: e.target.value }))} />
                  </div>
                  <Button onClick={handleCreate} className="w-full gradient-primary text-primary-foreground">Create Task</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map(task => {
          const assigned = assignee(task.assignedTo);
          const stConfig = statusConfig[task.status] || statusConfig.pending;
          const StatusIcon = stConfig.icon;

          return (
            <Card key={task.id} className="glass-card hover:stat-glow transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${stConfig.color}`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">{task.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${priorityConfig[task.priority].color}`}>
                        {priorityConfig[task.priority].label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-[10px] text-muted-foreground">Due: {task.deadline}</span>
                      <span className="text-[10px] text-muted-foreground">Est: {task.estimatedHours}h</span>
                      {assigned && (
                        <span className="text-[10px] text-primary">→ {assigned.name}</span>
                      )}
                      {task.suitabilityScore && (
                        <span className="text-[10px] text-success flex items-center gap-1">
                          <Brain className="w-3 h-3" /> AI Score: {(task.suitabilityScore * 100).toFixed(0)}%
                        </span>
                      )}
                      {task.previousAssignee && (
                        <span className="text-[10px] text-warning">Reassigned from {assignee(task.previousAssignee)?.name}</span>
                      )}
                    </div>
                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.requiredSkills.map(s => (
                        <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 shrink-0">
                    {isAdmin && task.status === 'pending' && (
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => assignTask(task.id)}>
                        <Brain className="w-3 h-3 mr-1" /> AI Assign
                      </Button>
                    )}
                    {isAdmin && task.status === 'pending' && (
                      <Button size="sm" variant="ghost" className="text-xs" onClick={() => setShowScores(showScores === task.id ? null : task.id)}>
                        View Scores
                      </Button>
                    )}
                    {(task.status === 'assigned' || task.status === 'in-progress') && (
                      <Button size="sm" variant="outline" className="text-xs text-success border-success/20 hover:bg-success/10" onClick={() => completeTask(task.id)}>
                        <CheckCircle className="w-3 h-3 mr-1" /> Complete
                      </Button>
                    )}
                  </div>
                </div>

                {/* AI Scores Breakdown */}
                {showScores === task.id && (
                  <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                      <Brain className="w-3 h-3 text-primary" /> AI Suitability Scores
                    </p>
                    <div className="space-y-2">
                      {rankEmployeesForTask(employees, task).map((score, i) => (
                        <div key={score.employeeId} className="flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground w-4">#{i + 1}</span>
                          <span className="flex-1 text-foreground">{score.employeeName}</span>
                          <span className="text-muted-foreground">Skill: {(score.skillMatch * 100).toFixed(0)}%</span>
                          <span className="text-muted-foreground">Avail: {(score.availabilityScore * 100).toFixed(0)}%</span>
                          <span className="text-muted-foreground">Load: {(score.workloadPenalty * 100).toFixed(0)}%</span>
                          <span className={`font-bold ${i === 0 ? 'text-success' : 'text-foreground'}`}>
                            {(score.score * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      f(Ei, Tj) = α·SkillMatch + β·Availability − γ·Workload (α=0.5, β=0.3, γ=0.2)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TasksPage;
