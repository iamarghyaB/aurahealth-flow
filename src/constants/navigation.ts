import {
  LayoutDashboard, Search, Calendar, FileText, MessageSquare,
  Video, Upload, User, Pill, Bot, Clock, DollarSign, Settings,
  Users, Stethoscope, ClipboardList, BarChart3, Shield, BedDouble,
} from "lucide-react";

export const patientNavItems = [
  { title: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { title: "Find Doctors", href: "/patient/doctors", icon: Search },
  { title: "Appointments", href: "/patient/appointments", icon: Calendar },
  { title: "Consultations", href: "/patient/consultations", icon: Video },
  { title: "Health Records", href: "/patient/records", icon: FileText },
  { title: "Lab Reports", href: "/patient/lab-reports", icon: Upload },
  { title: "Prescriptions", href: "/patient/prescriptions", icon: Pill },
  { title: "Pharmacy", href: "/patient/pharmacy", icon: Pill },
  { title: "Profile", href: "/patient/profile", icon: User },
];

export const doctorNavItems = [
  { title: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { title: "Appointments", href: "/doctor/appointments", icon: Calendar },
  { title: "My Patients", href: "/doctor/patients", icon: Users },
  { title: "Prescriptions", href: "/doctor/prescriptions", icon: ClipboardList },
  { title: "Lab Reports", href: "/doctor/lab-reports", icon: FileText },
  { title: "Health Records", href: "/doctor/health-records", icon: FileText },
  { title: "Consultations", href: "/doctor/consultations", icon: Video },
  { title: "Profile", href: "/doctor/profile", icon: User },
  { title: "Settings", href: "/doctor/settings", icon: Settings },
];

export const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Doctors", href: "/admin/doctors", icon: Stethoscope },
  { title: "Patients", href: "/admin/patients", icon: Users },
  { title: "Appointments", href: "/admin/appointments", icon: Calendar },
  { title: "Medicines", href: "/admin/medicines", icon: Pill },
  { title: "Orders", href: "/admin/orders", icon: ClipboardList },
  { title: "Access Control", href: "/admin/access-control", icon: Shield },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];
