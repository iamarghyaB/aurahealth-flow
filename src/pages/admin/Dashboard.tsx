import DashboardLayout from "@/components/DashboardLayout";
import { StatCard, Section } from "@/components/DashboardWidgets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  BarChart3,
  FileText,
  Settings,
  Shield,
  Building2,
  BedDouble,
  UserPlus,
  TrendingUp,
  Activity,
  ClipboardList,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Doctors", href: "/admin/doctors", icon: Stethoscope },
  { title: "Patients", href: "/admin/patients", icon: Users },
  { title: "Appointments", href: "/admin/appointments", icon: Calendar },
  { title: "Revenue", href: "/admin/revenue", icon: DollarSign },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Lab Reports", href: "/admin/lab-reports", icon: FileText },
  { title: "Room Management", href: "/admin/rooms", icon: BedDouble },
  { title: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
  { title: "Access Control", href: "/admin/access-control", icon: Shield },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

const recentStaff = [
  { name: "Dr. Sarah Johnson", role: "Cardiologist", status: "Active", patients: 156 },
  { name: "Dr. Michael Chen", role: "Dermatologist", status: "Active", patients: 98 },
  { name: "Dr. Emily Davis", role: "General Physician", status: "On Leave", patients: 203 },
  { name: "Dr. Robert Park", role: "Orthopedist", status: "Active", patients: 124 },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout navItems={navItems} role="Admin" userName="Admin User">
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Clinic Overview</h1>
            <p className="text-muted-foreground">MediFlow Health Center · Feb 17, 2026</p>
          </div>
          <Button size="sm"><UserPlus className="h-4 w-4 mr-1" /> Add Staff</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Patients" value="2,847" icon={Users} change="+124 this month" trend="up" />
          <StatCard title="Active Doctors" value={18} icon={Stethoscope} change="3 on leave" trend="neutral" />
          <StatCard title="Today's Appointments" value={42} icon={Calendar} change="+15% vs yesterday" trend="up" />
          <StatCard title="Monthly Revenue" value="$84,520" icon={DollarSign} change="+12.5%" trend="up" />
        </div>

        {/* Staff & Revenue */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Section title="Medical Staff" action={<Button variant="outline" size="sm">View All</Button>}>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Specialty</th>
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Patients</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentStaff.map((s, i) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                {s.name.charAt(4)}
                              </div>
                              <span className="text-sm font-semibold">{s.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{s.role}</td>
                          <td className="p-4">
                            <Badge variant={s.status === "Active" ? "default" : "secondary"} className={s.status === "Active" ? "bg-success text-success-foreground" : ""}>
                              {s.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm font-medium">{s.patients}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>
          </div>

          <Section title="Quick Stats">
            <div className="space-y-4">
              {[
                { label: "Bed Occupancy", value: "78%", bar: 78, color: "bg-primary" },
                { label: "Lab Utilization", value: "85%", bar: 85, color: "bg-info" },
                { label: "Patient Satisfaction", value: "94%", bar: 94, color: "bg-success" },
                { label: "Staff Utilization", value: "67%", bar: 67, color: "bg-warning" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{stat.label}</span>
                    <span className="text-sm font-bold">{stat.value}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${stat.color}`} style={{ width: `${stat.bar}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Revenue Chart Placeholder */}
        <Section title="Revenue Trend" description="Last 6 months">
          <div className="bg-card rounded-xl border border-border p-6 h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">Revenue Analytics</p>
              <p className="text-sm">Connect to backend to view live data</p>
            </div>
          </div>
        </Section>
      </div>
    </DashboardLayout>
  );
}
