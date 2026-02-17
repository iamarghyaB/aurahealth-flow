import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/patient/Dashboard";
import DoctorDashboard from "./pages/doctor/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/doctors" element={<FindDoctors />} />
          <Route path="/patient/appointments" element={<PatientAppointments />} />
          <Route path="/patient/doctors/:id" element={<DoctorProfile />} />
          <Route path="/patient/records" element={<HealthRecords />} />
          <Route path="/patient/lab-reports" element={<LabReports />} />
          <Route path="/patient/prescriptions" element={<Prescriptions />} />
          <Route path="/patient/pharmacy" element={<Pharmacy />} />
          <Route path="/patient/consultations" element={<Consultations />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
