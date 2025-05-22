"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { PermissionProvider } from "./context/PermissionContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/globals.css";

// Public layout & pages
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyEmailPage from "./pages/VerifyEmail";
import CompanyRegistrationPage from "./pages/CompanyRegistrationPage";
import OwnerOnboardingPage from "./pages/OwnerOnboardingPage";

// Private user
import PrivateRoute from "./components/PrivateRoute";
import UserLayout from "./layouts/UserLayout";
import ProfilePage from "./pages/user/profile/profilePage";
import SkillsPage from "./pages/user/skills/SkillsPage";
import JoblistPage from "./pages/user/Joblist/JoblistPage";
import JobDetailPage from "./pages/user/Joblist/JobDetailPage";
import UserHomePage from "./pages/user/UserHomePage";

// Private tenant layout + pages
import TenantLayout from "./layouts/TenantLayout";
import Dashboard from "./pages/tenant/Dashboard";
import UserRoles from "./pages/tenant/UserRoles";
import Profile from "./pages/tenant/Profile";
import SubscriptionPage from "./pages/tenant/subscription";

// HR features merged into /tenant/
import DashboardPage from "./pages/tenant/HR/DashboardPage";
import JobsPage from "./pages/tenant/HR/JobsPage";
import JobApplicantsPage from "./pages/tenant/HR/JobApplicantsPage";
import NewJobPage from "./pages/tenant/HR/NewJobPage";
import EmployeesPage from "./pages/tenant/HR/EmployeesPage";
import NewEmployeePage from "./pages/tenant/HR/NewEmployeePage";
import ContratsPage from "./pages/tenant/HR/ContratsPage";
import NewContratPage from "./pages/tenant/HR/NewContratPage";
import LeaveRequestPage from "./pages/tenant/HR/LeaveRequestPage";
import NewLeaveRequestPage from "./pages/tenant/HR/NewLeaveRequestPage";
import PerformancePage from "./pages/tenant/HR/PerformancePage";
import NewPerformanceEvaluationPage from "./pages/tenant/HR/NewPerformanceEvaluationPage";
import ChatPage from "./pages/tenant/HR/ChatPage";

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const WelcomeMessage = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-600">Welcome to NexHR Tenant Portal</h2>
      <p className="mt-2 text-gray-500">Select an option from the sidebar to get started</p>
    </div>
  </div>
);
function App() {
  return (
    <ThemeProvider>
      <PermissionProvider>
        <ToastContainer position="bottom-right" autoClose={3000} />
        <Router>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><SignupPage /></PublicLayout>} />
            <Route path="/jobs" element={<PublicLayout><JoblistPage /></PublicLayout>} />
            <Route path="/verify-email" element={<PublicLayout><VerifyEmailPage /></PublicLayout>} />
            <Route path="/tenant/register" element={<PublicLayout><CompanyRegistrationPage /></PublicLayout>} />
            <Route path="/tenant/onboarding" element={<PublicLayout><OwnerOnboardingPage /></PublicLayout>} />

            {/* USER ROUTES */}
            <Route path="/user" element={<PrivateRoute><UserLayout><UserHomePage /></UserLayout></PrivateRoute>} />
            <Route path="/user/profile" element={<PrivateRoute><UserLayout><ProfilePage /></UserLayout></PrivateRoute>} />
            <Route path="/user/skills" element={<PrivateRoute><UserLayout><SkillsPage /></UserLayout></PrivateRoute>} />
            <Route path="/user/joblist" element={<PrivateRoute><UserLayout><JoblistPage /></UserLayout></PrivateRoute>} />
            <Route path="/user/jobs/:id" element={<PrivateRoute><UserLayout><JobDetailPage /></UserLayout></PrivateRoute>} />

            {/* TENANT ROUTES */}
            <Route
              path="/tenant/*"
              element={
                <PrivateRoute>
                  <TenantLayout>
                    <Routes>
                      <Route path="" element={<WelcomeMessage />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="user-roles" element={<UserRoles />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="subscription" element={<SubscriptionPage />} />
                      <Route path="jobs" element={<JobsPage />} />
                      <Route path="jobs/new" element={<NewJobPage />} />
                      <Route path="job-applicants/:id" element={<JobApplicantsPage />} />
                      <Route path="employees" element={<EmployeesPage />} />
                      <Route path="employees/new" element={<NewEmployeePage />} />
                      <Route path="contracts" element={<ContratsPage />} />
                      <Route path="contracts/new" element={<NewContratPage />} />
                      <Route path="leave-requests" element={<LeaveRequestPage />} />
                      <Route path="leave-requests/new" element={<NewLeaveRequestPage />} />
                      <Route path="performance" element={<PerformancePage />} />
                      <Route path="performance/new" element={<NewPerformanceEvaluationPage />} />
                      <Route path="chat" element={<ChatPage />} />
                    </Routes>
                  </TenantLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </PermissionProvider>
    </ThemeProvider>
  );
}

export default App;
