import React from 'react';
import { useAppData } from '@/context/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Star, Award } from 'lucide-react';

const LeaderboardPage = () => {
  const { employees } = useAppData();
  const sorted = [...employees].sort((a, b) => b.points - a.points);

  const podiumIcons = [Trophy, Medal, Star];
  const podiumColors = ['text-warning', 'text-muted-foreground', 'text-warning/60'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Gamification rankings based on task completion and performance</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {sorted.slice(0, 3).map((emp, i) => {
          const Icon = podiumIcons[i];
          return (
            <Card key={emp.id} className={`glass-card text-center ${i === 0 ? 'stat-glow ring-1 ring-warning/30' : ''}`}>
              <CardContent className="p-6">
                <Icon className={`w-8 h-8 mx-auto ${podiumColors[i]} mb-3`} />
                <div className="w-14 h-14 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-xl font-bold text-primary mb-3">
                  {emp.name.charAt(0)}
                </div>
                <p className="font-semibold text-foreground">{emp.name}</p>
                <p className="text-xs text-muted-foreground">{emp.department}</p>
                <p className="text-2xl font-display font-bold text-primary mt-2">{emp.points}</p>
                <p className="text-xs text-muted-foreground">points</p>
                <div className="flex flex-wrap gap-1 justify-center mt-3">
                  {emp.badges.map(b => (
                    <span key={b.id} className="text-lg" title={b.name}>{b.icon}</span>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-xs font-bold text-foreground">{emp.tasksCompleted}</p>
                    <p className="text-[10px] text-muted-foreground">Completed</p>
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-xs font-bold text-success">{emp.tasksOnTime}</p>
                    <p className="text-[10px] text-muted-foreground">On Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full Rankings */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Full Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sorted.map((emp, i) => (
              <div key={emp.id} className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${i < 3 ? 'bg-muted/50' : 'hover:bg-muted/30'}`}>
                <span className={`w-8 text-center font-display font-bold text-lg ${
                  i === 0 ? 'text-warning' : i === 1 ? 'text-muted-foreground' : i === 2 ? 'text-warning/60' : 'text-muted-foreground/40'
                }`}>
                  {i + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {emp.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.department} · {emp.tasksCompleted} tasks</p>
                </div>
                <div className="flex gap-1">
                  {emp.badges.map(b => (
                    <span key={b.id} className="text-sm" title={b.name}>{b.icon}</span>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{emp.points}</p>
                  <p className="text-[10px] text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
