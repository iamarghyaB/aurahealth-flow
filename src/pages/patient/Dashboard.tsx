import DashboardLayout from "@/components/DashboardLayout";
import { StatCard, Section } from "@/components/DashboardWidgets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Search,
  Calendar,
  FileText,
  MessageSquare,
  Video,
  Heart,
  Upload,
  CreditCard,
  Bell,
  User,
  Clock,
  Star,
  Activity,
  Plus,
  Pill,
  Bot,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { title: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { title: "Find Doctors", href: "/patient/doctors", icon: Search },
  { title: "Appointments", href: "/patient/appointments", icon: Calendar },
  { title: "Consultations", href: "/patient/consultations", icon: Video },
  { title: "Messages", href: "/patient/messages", icon: MessageSquare },
  { title: "Health Records", href: "/patient/records", icon: FileText },
  { title: "Lab Reports", href: "/patient/lab-reports", icon: Upload },
  { title: "Prescriptions", href: "/patient/prescriptions", icon: Pill },
  { title: "Pharmacy", href: "/patient/pharmacy", icon: Pill },
  { title: "AI Symptom Checker", href: "/patient/symptom-checker", icon: Bot },
  { title: "Profile", href: "/patient/profile", icon: User },
];

const upcomingAppointments = [
  { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", date: "Feb 18, 2026", time: "10:00 AM", type: "In-person", status: "Confirmed" },
  { id: 2, doctor: "Dr. Michael Chen", specialty: "Dermatologist", date: "Feb 20, 2026", time: "2:30 PM", type: "Video", status: "Pending" },
  { id: 3, doctor: "Dr. Emily Davis", specialty: "General Physician", date: "Feb 25, 2026", time: "9:00 AM", type: "In-person", status: "Confirmed" },
];

const recentPrescriptions = [
  { id: 1, doctor: "Dr. Sarah Johnson", date: "Feb 10, 2026", medications: 3 },
  { id: 2, doctor: "Dr. Michael Chen", date: "Feb 05, 2026", medications: 2 },
];

export default function PatientDashboard() {
  return (
    <DashboardLayout navItems={navItems} role="Patient" userName="Alex Thompson">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-extrabold">Good morning, Alex 👋</h1>
          <p className="text-muted-foreground">Here's your health overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Upcoming Appointments" value={3} icon={Calendar} change="+1 this week" trend="up" />
          <StatCard title="Active Prescriptions" value={5} icon={Pill} />
          <StatCard title="Lab Reports" value={8} icon={FileText} change="2 pending" trend="neutral" />
          <StatCard title="Health Score" value="92%" icon={Activity} change="+3% this month" trend="up" />
        </div>

        {/* Appointments */}
        <Section
          title="Upcoming Appointments"
          description="Your next scheduled visits"
          action={
            <Button size="sm" asChild>
              <Link to="/patient/doctors"><Plus className="h-4 w-4 mr-1" /> Book New</Link>
            </Button>
          }
        >
          <div className="grid gap-3">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{apt.doctor}</p>
                    <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium">{apt.date}</p>
                    <p className="text-xs text-muted-foreground">{apt.time}</p>
                  </div>
                  <Badge variant={apt.type === "Video" ? "default" : "secondary"}>
                    {apt.type === "Video" ? <Video className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                    {apt.type}
                  </Badge>
                  <Badge variant={apt.status === "Confirmed" ? "default" : "outline"} className={apt.status === "Confirmed" ? "bg-success text-success-foreground" : ""}>
                    {apt.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Quick Actions */}
        <Section title="Quick Actions">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Search, label: "Find Doctor", href: "/patient/doctors" },
              { icon: Video, label: "Start Consult", href: "/patient/consultations" },
              { icon: Upload, label: "Upload Report", href: "/patient/lab-reports" },
              { icon: Bot, label: "AI Symptom Check", href: "/patient/symptom-checker" },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </Section>

        {/* Recent Prescriptions */}
        <Section title="Recent Prescriptions">
          <div className="grid gap-3">
            {recentPrescriptions.map((rx) => (
              <div key={rx.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
                    <FileText className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{rx.doctor}</p>
                    <p className="text-xs text-muted-foreground">{rx.date} · {rx.medications} medications</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Download PDF</Button>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </DashboardLayout>
  );
}
