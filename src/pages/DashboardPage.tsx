import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ListTodo, CheckCircle2, AlertTriangle, TrendingUp, Trophy, Clock, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const CHART_COLORS = ['hsl(217, 91%, 60%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(280, 67%, 60%)', 'hsl(0, 84%, 60%)'];

const AdminDashboard = () => {
  const { employees, tasks } = useAppData();

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: Users, color: 'text-primary' },
    { label: 'Active Tasks', value: tasks.filter(t => t.status !== 'completed').length, icon: ListTodo, color: 'text-warning' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: CheckCircle2, color: 'text-success' },
    { label: 'Reassigned', value: tasks.filter(t => t.status === 'reassigned').length, icon: AlertTriangle, color: 'text-destructive' },
  ];

  const workloadData = employees.map(e => ({
    name: e.name.split(' ')[0],
    workload: Math.round(e.workload * 100),
    availability: Math.round(e.availability * 100),
  }));

  const taskStatusData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length },
    { name: 'Assigned', value: tasks.filter(t => t.status === 'assigned').length },
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length },
    { name: 'Reassigned', value: tasks.filter(t => t.status === 'reassigned').length },
  ].filter(d => d.value > 0);

  const leaderboard = [...employees].sort((a, b) => b.points - a.points).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-powered workforce management overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label} className="glass-card hover:stat-glow transition-shadow duration-300">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workload Distribution */}
        <Card className="lg:col-span-2 glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Employee Workload vs Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="workload" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Workload %" />
                <Bar dataKey="availability" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="Availability %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Status Pie */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" /> Task Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={taskStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {taskStatusData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {taskStatusData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  {d.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4" /> Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((emp, i) => (
              <div key={emp.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <span className={`text-lg font-display font-bold ${i === 0 ? 'text-warning' : i === 1 ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                  #{i + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {emp.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{emp.points} pts</p>
                  <p className="text-[10px] text-muted-foreground">{emp.badges.length} badges</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EmployeeDashboard = () => {
  const { currentEmployee } = useAuth();
  const { tasks } = useAppData();

  if (!currentEmployee) return null;

  const myTasks = tasks.filter(t => t.assignedTo === currentEmployee.id);
  const completedTasks = myTasks.filter(t => t.status === 'completed');
  const activeTasks = myTasks.filter(t => t.status !== 'completed');

  const stats = [
    { label: 'Active Tasks', value: activeTasks.length, icon: ListTodo, color: 'text-primary' },
    { label: 'Completed', value: completedTasks.length, icon: CheckCircle2, color: 'text-success' },
    { label: 'Points', value: currentEmployee.points, icon: TrendingUp, color: 'text-warning' },
    { label: 'Badges', value: currentEmployee.badges.length, icon: Trophy, color: 'text-primary' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Welcome back, {currentEmployee.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your productivity overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label} className="glass-card hover:stat-glow transition-shadow duration-300">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skills & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentEmployee.skills.map(skill => (
              <div key={skill.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground">{skill.name}</span>
                  <span className="text-muted-foreground">{Math.round(skill.level * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${skill.level * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Badges</CardTitle>
          </CardHeader>
          <CardContent>
            {currentEmployee.badges.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Complete tasks to earn badges!</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {currentEmployee.badges.map(badge => (
                  <div key={badge.id} className="p-3 rounded-lg bg-muted/50 text-center">
                    <span className="text-2xl">{badge.icon}</span>
                    <p className="text-xs font-medium text-foreground mt-1">{badge.name}</p>
                    <p className="text-[10px] text-muted-foreground">{badge.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Tasks */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {activeTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No active tasks</p>
          ) : (
            <div className="space-y-2">
              {activeTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'critical' ? 'bg-destructive' :
                    task.priority === 'high' ? 'bg-warning' :
                    task.priority === 'medium' ? 'bg-primary' : 'bg-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground">Due: {task.deadline}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                    task.status === 'in-progress' ? 'bg-primary/10 text-primary' :
                    task.status === 'assigned' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const DashboardPage = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />;
};

export default DashboardPage;
