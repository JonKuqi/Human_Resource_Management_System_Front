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

import HRLayout from "./layouts/HRLayout";
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
import RealTimeChat from "./pages/tenant/HR/RealTimeChat";
import ChatPage from "./pages/tenant/HR/ChatPage"

import EmployeeLayout from "./layouts/EmployeeLayout";
import EmployeeDashboardPage from "./pages/tenant/Employee/DashboardPage";
import EmployeeLeaveRequestPage from "./pages/tenant/Employee/LeaveRequestPage";
import EmployeeContractPage from "./pages/tenant/Employee/ContractPage";
import EmployeeEvaluationPage from "./pages/tenant/Employee/EvalutationPage";
import EmployeePayrollPage from "./pages/tenant/Employee/PayrollPage";
import EmployeeChatPage from "./pages/tenant/Employee/Teamchat";
import EmployeeNotificationsPage from "./pages/tenant/Employee/NotificationPage";
function App() {
  const PublicLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
  console.log("ChatPage:", ChatPage)

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
<Route path="/tenant/hr/dashboard" element={<PrivateRoute><HRLayout><DashboardPage /></HRLayout></PrivateRoute>} />
<Route path="/tenant/hr/jobs" element={<PrivateRoute><HRLayout><JobsPage /></HRLayout></PrivateRoute>} />
<Route path="/tenant/hr/jobs/new" element={<PrivateRoute><HRLayout><NewJobPage /></HRLayout></PrivateRoute>} />
<Route path="/tenant/hr/job-applicants/:id" element={<PrivateRoute><HRLayout><JobApplicantsPage /></HRLayout></PrivateRoute>} />
<Route path="/tenant/hr/employees" element={<PrivateRoute><HRLayout><EmployeesPage /></HRLayout></PrivateRoute>} />
<Route path="/tenant/hr/employees/new" element={<PrivateRoute><HRLayout><NewEmployeePage /></HRLayout></PrivateRoute>} />
<Route path="/tenant/hr/contracts" element={<PrivateRoute><HRLayout><ContratsPage /></HRLayout></PrivateRoute>} />
<Route path="/tenant/hr/contracts/new" element={<PrivateRoute><HRLayout><NewContratPage /></HRLayout></PrivateRoute>} />
<Route path="/tenant/hr/leave-requests" element={<PrivateRoute><HRLayout><LeaveRequestPage /></HRLayout></PrivateRoute>} />
<Route path="/tenant/hr/leave-requests/new" element={<PrivateRoute><HRLayout><NewLeaveRequestPage /></HRLayout></PrivateRoute>} />
<Route path="/tenant/hr/performance" element={<PrivateRoute><HRLayout><PerformancePage /></HRLayout></PrivateRoute>} />
<Route path="/tenant/hr/performance/new" element={<PrivateRoute><HRLayout><NewPerformanceEvaluationPage /></HRLayout></PrivateRoute>} />
<Route path="/tenant/hr/chat" element={<PrivateRoute><HRLayout><ChatPage /></HRLayout></PrivateRoute>} />

<Route path="/tenant/employee/dashboard" element={<PrivateRoute><EmployeeLayout><EmployeeDashboardPage /></EmployeeLayout></PrivateRoute>} />
          <Route path="/tenant/employee/leave-request" element={<PrivateRoute><EmployeeLayout><EmployeeLeaveRequestPage /></EmployeeLayout></PrivateRoute>} />
          <Route path="/tenant/employee/contract" element={<PrivateRoute><EmployeeLayout><EmployeeContractPage /></EmployeeLayout></PrivateRoute>} />
          <Route path="/tenant/employee/evaluation" element={<PrivateRoute><EmployeeLayout><EmployeeEvaluationPage /></EmployeeLayout></PrivateRoute>} />
          <Route path="/tenant/employee/payroll" element={<PrivateRoute><EmployeeLayout><EmployeePayrollPage /></EmployeeLayout></PrivateRoute>} />
          <Route path="/tenant/employee/chat" element={<PrivateRoute><EmployeeLayout><EmployeeChatPage /></EmployeeLayout></PrivateRoute>} />
          <Route path="/tenant/employee/notifications" element={<PrivateRoute><EmployeeLayout><EmployeeNotificationsPage /></EmployeeLayout></PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
