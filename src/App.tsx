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
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorPrescriptions from "./pages/doctor/Prescriptions";
import DoctorLabReports from "./pages/doctor/LabReports";
import DoctorHealthRecords from "./pages/doctor/HealthRecords";
import DoctorConsultations from "./pages/doctor/Consultations";
import DoctorProfile from "./pages/doctor/Profile";
import DoctorSettings from "./pages/doctor/Settings";
import AdminDashboard from "./pages/admin/Dashboard";
import AccessControl from "./pages/admin/AccessControl";
import AdminDoctors from "./pages/admin/Doctors";
import AdminPatients from "./pages/admin/Patients";
import AdminAppointments from "./pages/admin/Appointments";
import AdminMedicines from "./pages/admin/Medicines";
import AdminOrders from "./pages/admin/Orders";
import FindDoctors from "./pages/patient/FindDoctors";
import PatientAppointments from "./pages/patient/Appointments";
import PatientDoctorProfile from "./pages/patient/DoctorProfile";
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
            <Route path="/patient/doctors/:id" element={<ProtectedRoute allowedRoles={["patient"]}><PatientDoctorProfile /></ProtectedRoute>} />
            <Route path="/patient/records" element={<ProtectedRoute allowedRoles={["patient"]}><HealthRecords /></ProtectedRoute>} />
            <Route path="/patient/lab-reports" element={<ProtectedRoute allowedRoles={["patient"]}><LabReports /></ProtectedRoute>} />
            <Route path="/patient/prescriptions" element={<ProtectedRoute allowedRoles={["patient"]}><Prescriptions /></ProtectedRoute>} />
            <Route path="/patient/pharmacy" element={<ProtectedRoute allowedRoles={["patient"]}><Pharmacy /></ProtectedRoute>} />
            <Route path="/patient/consultations" element={<ProtectedRoute allowedRoles={["patient"]}><Consultations /></ProtectedRoute>} />
            <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={["patient"]}><PatientProfile /></ProtectedRoute>} />

            {/* Doctor routes */}
            <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorAppointments /></ProtectedRoute>} />
            <Route path="/doctor/patients" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorPatients /></ProtectedRoute>} />
            <Route path="/doctor/prescriptions" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorPrescriptions /></ProtectedRoute>} />
            <Route path="/doctor/lab-reports" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorLabReports /></ProtectedRoute>} />
            <Route path="/doctor/health-records" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorHealthRecords /></ProtectedRoute>} />
            <Route path="/doctor/consultations" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorConsultations /></ProtectedRoute>} />
            <Route path="/doctor/profile" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorProfile /></ProtectedRoute>} />
            <Route path="/doctor/settings" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorSettings /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDoctors /></ProtectedRoute>} />
            <Route path="/admin/patients" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPatients /></ProtectedRoute>} />
            <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAppointments /></ProtectedRoute>} />
            <Route path="/admin/medicines" element={<ProtectedRoute allowedRoles={["admin"]}><AdminMedicines /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["admin"]}><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/access-control" element={<ProtectedRoute allowedRoles={["admin"]}><AccessControl /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
