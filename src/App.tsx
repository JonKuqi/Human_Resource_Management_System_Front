"use client"; 

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyEmailPage from "./pages/VerifyEmail";
import Dashboard from "./pages/tenant/Dashboard";
import UserRoles from "./pages/tenant/UserRoles";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TenantLayout from "./layouts/TenantLayout";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/globals.css";
import PrivateRoute from "./components/PrivateRoute"; 
import Profile from "./pages/tenant/Profile";
import CompanyRegistrationPage from "./pages/CompanyRegistrationPage";
import OwnerOnboardingPage from "./pages/OwnerOnboardingPage";
import { ToastContainer } from "react-toastify";          
import "react-toastify/dist/ReactToastify.css";  
import SubscriptionPage from "./pages/tenant/subscription"; 
import UserLayout from "./layouts/UserLayout"
import SkillsPage from "./pages/user/skills/SkillsPage"
import ProfilePage from "./pages/user/profile/profilePage"
import JoblistPage from "./pages/user/Joblist/JoblistPage"
import UserHomePage from "./pages/user/UserHomePage";


// HR pages
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

function App() {
  const PublicLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );

  return (
    <ThemeProvider>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Router>
        <Routes>
          {/* Public routes with Navbar + Footer */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/signup" element={<PublicLayout><SignupPage /></PublicLayout>} />
          <Route path="/verify-email" element={<PublicLayout><VerifyEmailPage /></PublicLayout>} />
          <Route
            path="/tenant/register"
            element={
              <PublicLayout>
                <div className="flex flex-col min-h-screen">
                  <main className="flex-grow">
                    <CompanyRegistrationPage />
                  </main>
                </div>
              </PublicLayout>
            }
          />
         
       
         <Route
            path="/tenant/onboarding"
            element={
              <PublicLayout>
                <div className="flex flex-col min-h-screen">
                  <main className="flex-grow">
                    <OwnerOnboardingPage />
                  </main>
                </div>
              </PublicLayout>
            }
          />

<Route
  path="/user/profile"
  element={
    <PrivateRoute>
      <UserLayout>
        <ProfilePage />
      </UserLayout>
    </PrivateRoute>
  }
/>

<Route
  path="/user/skills"
  element={
    <PrivateRoute>
      <UserLayout>
        <SkillsPage />
      </UserLayout>
    </PrivateRoute>
  }
/>


<Route
  path="/user/joblist"
  element={
    <PrivateRoute>
      <UserLayout>
        <JoblistPage />
      </UserLayout>
    </PrivateRoute>
  }
/>

<Route
  path="/user"
  element={
    <PrivateRoute>
      <UserLayout>
        <UserHomePage />
      </UserLayout>
    </PrivateRoute>
  }
/>




          {/* Tenant routes with sidebar layout */}
          <Route path="/tenant" element={
            <TenantLayout>
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-600">Welcome to NexHR Tenant Portal</h2>
                  <p className="mt-2 text-gray-500">Select an option from the sidebar to get started</p>
                </div>
              </div>
            </TenantLayout>
          } />
          <Route
            path="/tenant/dashboard"
            element={
              <PrivateRoute>
                <TenantLayout>
                  <Dashboard />
                </TenantLayout>
              </PrivateRoute>
            }
          />
          <Route path="/tenant/user-roles" element={
            <PrivateRoute>
              <TenantLayout>
                <UserRoles />
              </TenantLayout>
            </PrivateRoute>
          } />
          <Route
            path="/tenant/profile"
            element={
              <PrivateRoute>
                <TenantLayout>
                  <Profile />
                </TenantLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/tenant/subscription"
            element={
              <PrivateRoute>
                <TenantLayout>
                  <SubscriptionPage />
                </TenantLayout>
              </PrivateRoute>
            }
          />

          {/* HR Pages */}
          <Route path="/tenant/hr/dashboard" element={<PrivateRoute><TenantLayout><DashboardPage /></TenantLayout></PrivateRoute>} />
          <Route path="/tenant/hr/jobs" element={<PrivateRoute><TenantLayout><JobsPage /></TenantLayout></PrivateRoute>} />
          <Route path="/tenant/hr/jobs/new" element={<PrivateRoute><TenantLayout><NewJobPage /></TenantLayout></PrivateRoute>} />
          <Route path="/tenant/hr/job-applicants/:id" element={<PrivateRoute><TenantLayout><JobApplicantsPage params={{id: ""}} /></TenantLayout></PrivateRoute>} />
          <Route path="/tenant/hr/employees" element={<PrivateRoute><TenantLayout><EmployeesPage /></TenantLayout></PrivateRoute>} />
          <Route path="/tenant/hr/employees/new" element={<PrivateRoute><TenantLayout><NewEmployeePage /></TenantLayout></PrivateRoute>} />
          <Route path="/tenant/hr/contracts" element={<PrivateRoute><TenantLayout><ContratsPage /></TenantLayout></PrivateRoute>} />
          <Route path="/tenant/hr/contracts/new" element={<PrivateRoute><TenantLayout><NewContratPage /></TenantLayout></PrivateRoute>} />
          <Route path="/tenant/hr/leave-requests" element={<PrivateRoute><TenantLayout><LeaveRequestPage /></TenantLayout></PrivateRoute>} />
          <Route path="/tenant/hr/leave-requests/new" element={<PrivateRoute><TenantLayout><NewLeaveRequestPage /></TenantLayout></PrivateRoute>} />
          <Route path="/tenant/hr/performance" element={<PrivateRoute><TenantLayout><PerformancePage /></TenantLayout></PrivateRoute>} />
          <Route path="/tenant/hr/performance/new" element={<PrivateRoute><TenantLayout><NewPerformanceEvaluationPage /></TenantLayout></PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
