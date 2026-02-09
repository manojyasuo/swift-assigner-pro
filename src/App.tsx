import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppDataProvider } from "@/context/AppDataContext";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import EmployeesPage from "@/pages/EmployeesPage";
import TasksPage from "@/pages/TasksPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import DashboardLayout from "@/components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

const AuthGate = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <LoginPage />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppDataProvider>
            <Routes>
              <Route path="/" element={<AuthGate />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/employees" element={<ProtectedRoute adminOnly><EmployeesPage /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute adminOnly><TasksPage /></ProtectedRoute>} />
              <Route path="/my-tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute adminOnly><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppDataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
