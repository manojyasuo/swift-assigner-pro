import React from 'react';
import { useAppData } from '@/context/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area,
} from 'recharts';
import { BarChart3, PieChartIcon, Activity, TrendingUp } from 'lucide-react';

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(280, 67%, 60%)', 'hsl(0, 84%, 60%)'];

const AnalyticsPage = () => {
  const { employees, tasks } = useAppData();

  const tasksByPriority = [
    { name: 'Critical', value: tasks.filter(t => t.priority === 'critical').length },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
  ].filter(d => d.value > 0);

  const employeePerformance = employees.map(e => ({
    name: e.name.split(' ')[0],
    completed: e.tasksCompleted,
    onTime: e.tasksOnTime,
    points: e.points,
  }));

  const skillRadar = employees.slice(0, 4).map(e => {
    const data: Record<string, string | number> = { name: e.name.split(' ')[0] };
    e.skills.forEach(s => { data[s.name] = Math.round(s.level * 100); });
    return data;
  });

  // Simulated workload trend over time
  const workloadTrend = [
    { week: 'W1', total: 280, avg: 47 },
    { week: 'W2', total: 310, avg: 52 },
    { week: 'W3', total: 295, avg: 49 },
    { week: 'W4', total: 340, avg: 57 },
    { week: 'W5', total: 320, avg: 53 },
    { week: 'W6', total: 290, avg: 48 },
  ];

  const completionRate = employees.length > 0
    ? Math.round(employees.reduce((s, e) => s + (e.tasksCompleted > 0 ? (e.tasksOnTime / e.tasksCompleted) * 100 : 0), 0) / employees.length)
    : 0;

  const tooltipStyle = {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: '12px',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Performance Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Workload trends, completion rates, and efficiency metrics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: tasks.length, icon: BarChart3 },
          { label: 'Completion Rate', value: `${Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%`, icon: PieChartIcon },
          { label: 'Avg On-Time Rate', value: `${completionRate}%`, icon: Activity },
          { label: 'Total Points', value: employees.reduce((s, e) => s + e.points, 0), icon: TrendingUp },
        ].map(s => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Trend */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Workload Trend (ΣWi(t))</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={workloadTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="total" fill="hsl(217, 91%, 60%)" fillOpacity={0.1} stroke="hsl(217, 91%, 60%)" strokeWidth={2} />
                <Area type="monotone" dataKey="avg" fill="hsl(142, 71%, 45%)" fillOpacity={0.1} stroke="hsl(142, 71%, 45%)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tasks by Priority */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={tasksByPriority} cx="50%" cy="50%" outerRadius={90} dataKey="value" paddingAngle={4} label={({ name, value }) => `${name}: ${value}`}>
                  {tasksByPriority.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employee Performance */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Employee Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={employeePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="completed" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Tasks Completed" />
                <Bar dataKey="onTime" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="On Time" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
