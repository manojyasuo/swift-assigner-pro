import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Employee, Task, Notification } from '@/types';
import { mockEmployees, mockTasks, mockNotifications } from '@/lib/mock-data';
import { findBestEmployee, calculateTaskPoints } from '@/lib/ai-engine';
import { toast } from 'sonner';

interface AppDataContextType {
  employees: Employee[];
  tasks: Task[];
  notifications: Notification[];
  assignTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  markAbsent: (employeeId: string) => void;
  markNotificationRead: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const addNotification = (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newN: Notification = {
      ...n,
      id: `n${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newN, ...prev]);
  };

  const assignTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const best = findBestEmployee(employees, task);
    if (!best) {
      toast.error('No available employees for this task');
      return;
    }

    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, status: 'assigned' as const, assignedTo: best.employeeId, suitabilityScore: best.score }
        : t
    ));

    // Increase workload
    setEmployees(prev => prev.map(e =>
      e.id === best.employeeId
        ? { ...e, workload: Math.min(1, e.workload + 0.15) }
        : e
    ));

    addNotification({
      type: 'assignment',
      title: 'Task Assigned by AI',
      message: `"${task.title}" assigned to ${best.employeeName} (score: ${(best.score * 100).toFixed(0)}%)`,
      targetUserId: best.employeeId,
    });

    toast.success(`Task assigned to ${best.employeeName} (Score: ${(best.score * 100).toFixed(0)}%)`);
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.assignedTo) return;

    const isOnTime = new Date() <= new Date(task.deadline);
    const points = calculateTaskPoints(task, isOnTime);

    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() } : t
    ));

    setEmployees(prev => prev.map(e =>
      e.id === task.assignedTo
        ? {
            ...e,
            workload: Math.max(0, e.workload - 0.15),
            points: e.points + points,
            tasksCompleted: e.tasksCompleted + 1,
            tasksOnTime: isOnTime ? e.tasksOnTime + 1 : e.tasksOnTime,
          }
        : e
    ));

    toast.success(`Task completed! +${points} points`);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setTasks(prev => [...prev, newTask]);
    toast.success('Task created successfully');
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const markAbsent = (employeeId: string) => {
    setEmployees(prev => prev.map(e =>
      e.id === employeeId ? { ...e, status: 'absent' as const, availability: 0 } : e
    ));

    // Reassign tasks
    const empTasks = tasks.filter(t => t.assignedTo === employeeId && t.status !== 'completed');
    empTasks.forEach(task => {
      const available = employees.filter(e => e.id !== employeeId && e.status === 'active');
      const best = findBestEmployee(available, task);
      if (best) {
        setTasks(prev => prev.map(t =>
          t.id === task.id
            ? { ...t, status: 'reassigned' as const, assignedTo: best.employeeId, previousAssignee: employeeId, suitabilityScore: best.score }
            : t
        ));
        addNotification({
          type: 'reassignment',
          title: 'Task Reassigned',
          message: `"${task.title}" reassigned to ${best.employeeName} due to employee absence`,
          targetUserId: best.employeeId,
        });
      }
    });

    toast.info('Employee marked as absent. Tasks have been reassigned.');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppDataContext.Provider value={{
      employees, tasks, notifications, assignTask, completeTask,
      addTask, updateEmployee, markAbsent, markNotificationRead,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
