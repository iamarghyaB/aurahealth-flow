import DashboardLayout from "@/components/DashboardLayout";
import { StatCard, Section } from "@/components/DashboardWidgets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Clock,
  DollarSign,
  Settings,
  User,
  Stethoscope,
  TrendingUp,
  Activity,
  Video,
  ClipboardList,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { title: "Appointments", href: "/doctor/appointments", icon: Calendar },
  { title: "My Patients", href: "/doctor/patients", icon: Users },
  { title: "Availability", href: "/doctor/availability", icon: Clock },
  { title: "Prescriptions", href: "/doctor/prescriptions", icon: ClipboardList },
  { title: "Messages", href: "/doctor/messages", icon: MessageSquare },
  { title: "Consultations", href: "/doctor/consultations", icon: Video },
  { title: "Earnings", href: "/doctor/earnings", icon: DollarSign },
  { title: "Profile", href: "/doctor/profile", icon: User },
  { title: "Settings", href: "/doctor/settings", icon: Settings },
];

const todaysAppointments = [
  { id: 1, patient: "Alex Thompson", age: 34, time: "10:00 AM", type: "In-person", reason: "Follow-up", status: "In Progress" },
  { id: 2, patient: "Maria Garcia", age: 28, time: "11:30 AM", type: "Video", reason: "New Consultation", status: "Upcoming" },
  { id: 3, patient: "James Wilson", age: 52, time: "2:00 PM", type: "In-person", reason: "Lab Review", status: "Upcoming" },
  { id: 4, patient: "Sarah Lee", age: 41, time: "3:30 PM", type: "Video", reason: "Prescription Renewal", status: "Upcoming" },
];

export default function DoctorDashboard() {
  return (
    <DashboardLayout navItems={navItems} role="Doctor" userName="Dr. Sarah Johnson">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-extrabold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Monday, February 17, 2026</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Today's Patients" value={8} icon={Users} change="2 remaining" trend="neutral" />
          <StatCard title="This Week" value={34} icon={Calendar} change="+12% vs last week" trend="up" />
          <StatCard title="Monthly Revenue" value="$12,450" icon={DollarSign} change="+8.2%" trend="up" />
          <StatCard title="Patient Rating" value="4.9" icon={TrendingUp} change="156 reviews" trend="up" />
        </div>

        {/* Today's Schedule */}
        <Section title="Today's Schedule" description="4 appointments remaining">
          <div className="space-y-3">
            {todaysAppointments.map((apt) => (
              <div key={apt.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-accent flex items-center justify-center">
                    <User className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{apt.patient}</p>
                    <p className="text-xs text-muted-foreground">Age {apt.age} · {apt.reason}</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{apt.time}</p>
                  </div>
                  <Badge variant={apt.type === "Video" ? "default" : "secondary"}>
                    {apt.type}
                  </Badge>
                  <Badge variant={apt.status === "In Progress" ? "default" : "outline"} className={apt.status === "In Progress" ? "bg-success text-success-foreground" : ""}>
                    {apt.status}
                  </Badge>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <Section title="Recent Activity">
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              {[
                { text: "Prescription sent to Alex Thompson", time: "10 min ago", icon: FileText },
                { text: "Video call with Maria Garcia completed", time: "1 hr ago", icon: Video },
                { text: "Lab report reviewed for James Wilson", time: "2 hrs ago", icon: Activity },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Earnings Overview">
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Today</span>
                <span className="text-lg font-bold">$1,240</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="text-lg font-bold">$4,850</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-lg font-bold">$12,450</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "72%" }} />
              </div>
              <p className="text-xs text-muted-foreground">72% of monthly goal reached</p>
            </div>
          </Section>
        </div>
      </div>
    </DashboardLayout>
  );
}
