import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Brain, LayoutDashboard, Users, ListTodo, BarChart3,
  Trophy, Bell, LogOut, ChevronLeft, ChevronRight, User,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { useState } from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, isAdmin } = useAuth();
  const { notifications } = useAppData();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const adminLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/employees', icon: Users, label: 'Employees' },
    { to: '/tasks', icon: ListTodo, label: 'Tasks' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
  ];

  const employeeLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'My Dashboard' },
    { to: '/my-tasks', icon: ListTodo, label: 'My Tasks' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 shrink-0`}>
        <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-display font-bold text-sidebar-foreground">TaskAI</span>}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                    : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`
              }
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
              {link.badge && link.badge > 0 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full gradient-primary text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <User className="w-4 h-4 text-sidebar-foreground/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name}</p>
                <p className="text-[10px] text-sidebar-foreground/40 capitalize">{user?.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/40 hover:text-destructive hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
