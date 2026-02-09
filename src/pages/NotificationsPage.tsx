import React from 'react';
import { useAppData } from '@/context/AppDataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, ArrowRight, CheckCircle, Award, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap = {
  assignment: ArrowRight,
  reassignment: ArrowRight,
  completion: CheckCircle,
  badge: Award,
  insight: TrendingUp,
};

const colorMap = {
  assignment: 'bg-primary/10 text-primary',
  reassignment: 'bg-warning/10 text-warning',
  completion: 'bg-success/10 text-success',
  badge: 'bg-warning/10 text-warning',
  insight: 'bg-info/10 text-info',
};

const NotificationsPage = () => {
  const { notifications, markNotificationRead } = useAppData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {notifications.filter(n => !n.read).length} unread notifications
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {notifications.map(n => {
          const Icon = iconMap[n.type] || Info;
          const color = colorMap[n.type] || 'bg-muted text-muted-foreground';

          return (
            <Card key={n.id} className={`glass-card transition-all duration-200 ${!n.read ? 'ring-1 ring-primary/20' : 'opacity-70'}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.read && (
                  <Button size="sm" variant="ghost" className="text-xs text-primary shrink-0" onClick={() => markNotificationRead(n.id)}>
                    Mark Read
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
