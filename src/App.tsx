import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/patient/Dashboard";
import DoctorDashboard from "./pages/doctor/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AccessControl from "./pages/admin/AccessControl";
import FindDoctors from "./pages/patient/FindDoctors";
import PatientAppointments from "./pages/patient/Appointments";
import DoctorProfile from "./pages/patient/DoctorProfile";
import HealthRecords from "./pages/patient/HealthRecords";
import LabReports from "./pages/patient/LabReports";
import Prescriptions from "./pages/patient/Prescriptions";
import Pharmacy from "./pages/patient/Pharmacy";
import PatientProfile from "./pages/patient/Profile";
import Consultations from "./pages/patient/Consultations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Patient routes */}
            <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={["patient"]}><PatientDashboard /></ProtectedRoute>} />
            <Route path="/patient/doctors" element={<ProtectedRoute allowedRoles={["patient"]}><FindDoctors /></ProtectedRoute>} />
            <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={["patient"]}><PatientAppointments /></ProtectedRoute>} />
            <Route path="/patient/doctors/:id" element={<ProtectedRoute allowedRoles={["patient"]}><DoctorProfile /></ProtectedRoute>} />
            <Route path="/patient/records" element={<ProtectedRoute allowedRoles={["patient"]}><HealthRecords /></ProtectedRoute>} />
            <Route path="/patient/lab-reports" element={<ProtectedRoute allowedRoles={["patient"]}><LabReports /></ProtectedRoute>} />
            <Route path="/patient/prescriptions" element={<ProtectedRoute allowedRoles={["patient"]}><Prescriptions /></ProtectedRoute>} />
            <Route path="/patient/pharmacy" element={<ProtectedRoute allowedRoles={["patient"]}><Pharmacy /></ProtectedRoute>} />
            <Route path="/patient/consultations" element={<ProtectedRoute allowedRoles={["patient"]}><Consultations /></ProtectedRoute>} />
            <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={["patient"]}><PatientProfile /></ProtectedRoute>} />

            {/* Doctor routes */}
            <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/access-control" element={<ProtectedRoute allowedRoles={["admin"]}><AccessControl /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
