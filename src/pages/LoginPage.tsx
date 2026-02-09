import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Shield, User } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('employee');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email'); return; }
    const success = login(email, password, selectedRole);
    if (!success) setError('Invalid credentials');
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/8 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg stat-glow">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary-foreground">TaskAI</h1>
          <p className="text-sidebar-foreground/60 mt-2">AI-Based Task Reallocation & Productivity System</p>
        </div>

        <Card className="border-sidebar-border bg-sidebar/90 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-sidebar-foreground font-display">Sign In</CardTitle>
            <CardDescription className="text-sidebar-foreground/50">Select your role and enter credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-6">
              {[
                { role: 'admin' as Role, icon: Shield, label: 'Admin' },
                { role: 'employee' as Role, icon: User, label: 'Employee' },
              ].map(({ role, icon: Icon, label }) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                    selectedRole === role
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-sidebar-border text-sidebar-foreground/50 hover:border-sidebar-foreground/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sidebar-foreground/70">Email</Label>
                <Input
                  type="email"
                  placeholder={selectedRole === 'admin' ? 'admin@company.com' : 'sarah@company.com'}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sidebar-foreground/70">Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/30"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
                Sign In as {selectedRole === 'admin' ? 'Admin' : 'Employee'}
              </Button>
            </form>

            <p className="text-xs text-sidebar-foreground/30 text-center mt-4">
              Demo: Use any email. Employee emails: sarah@company.com, marcus@company.com, etc.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
