import React from 'react';
import { useAppData } from '@/context/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserX, UserCheck } from 'lucide-react';

const EmployeesPage = () => {
  const { employees, markAbsent, updateEmployee } = useAppData();

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'on-leave': return 'bg-warning/10 text-warning border-warning/20';
      case 'absent': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage employee profiles and availability</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          {employees.filter(e => e.status === 'active').length} active / {employees.length} total
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(emp => (
          <Card key={emp.id} className="glass-card hover:stat-glow transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">{emp.department}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full border font-medium capitalize ${statusColor(emp.status)}`}>
                  {emp.status}
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 mb-4">
                {emp.skills.map(s => (
                  <span key={s.name} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {s.name} ({Math.round(s.level * 100)}%)
                  </span>
                ))}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-xs font-bold text-foreground">{Math.round(emp.workload * 100)}%</p>
                  <p className="text-[10px] text-muted-foreground">Workload</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-xs font-bold text-foreground">{Math.round(emp.availability * 100)}%</p>
                  <p className="text-[10px] text-muted-foreground">Availability</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-xs font-bold text-primary">{emp.points}</p>
                  <p className="text-[10px] text-muted-foreground">Points</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {emp.status === 'active' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => markAbsent(emp.id)}
                  >
                    <UserX className="w-3 h-3 mr-1" /> Mark Absent
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => updateEmployee(emp.id, { status: 'active', availability: 0.8 })}
                  >
                    <UserCheck className="w-3 h-3 mr-1" /> Mark Active
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployeesPage;
