import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Lock, Mail, ArrowRight, Zap, BarChart3, Users } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!password.trim()) { setError('Please enter your password'); return; }
    if (email.length > 255) { setError('Email is too long'); return; }

    setIsLoading(true);
    setError('');
    const result = await login(email.trim(), password);
    if (!result.success) {
      setError(result.error || 'Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden flex-col justify-between p-12">
        {/* Animated orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-32 left-16 w-56 h-56 rounded-full bg-primary/15 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-primary/8 blur-3xl animate-float" style={{ animationDelay: '4s' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center stat-glow">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-sidebar-foreground">TaskAI</h2>
            <p className="text-xs text-sidebar-foreground/40">Intelligent Productivity</p>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl xl:text-5xl font-display font-bold text-sidebar-foreground leading-tight">
              AI-Powered
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>
                Task Intelligence
              </span>
            </h1>
            <p className="text-sidebar-foreground/50 mt-4 text-lg max-w-md leading-relaxed">
              Smart allocation. Dynamic reallocation. Maximum productivity with fair workload distribution.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Zap, label: 'AI Scoring Engine' },
              { icon: BarChart3, label: 'Real-time Analytics' },
              { icon: Users, label: 'Team Gamification' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-sidebar-border bg-sidebar-accent/30 backdrop-blur-sm">
                <Icon className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-sidebar-foreground/70">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Formula display */}
        <div className="relative z-10">
          <div className="inline-block px-5 py-3 rounded-xl border border-sidebar-border bg-sidebar-accent/20 backdrop-blur-sm">
            <p className="text-[11px] text-sidebar-foreground/30 mb-1 font-medium tracking-wider uppercase">Suitability Function</p>
            <p className="text-sm font-mono text-primary/80">
              f(Eᵢ, Tⱼ) = α·Skill + β·Avail − γ·Load
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center stat-glow">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold text-foreground">TaskAI</span>
          </div>

          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-1">Sign in with your registered email</p>
          </div>

          <Card className="border-border/50 shadow-lg bg-card">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-foreground/80 text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      className="pl-10 h-11 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/50"
                      maxLength={255}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground/80 text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      className="pl-10 h-11 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/50"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {error && (
                  <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 gradient-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground/50 text-center">
            Employee accounts are created by your Admin.
            <br />
            Contact your administrator if you don't have access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
