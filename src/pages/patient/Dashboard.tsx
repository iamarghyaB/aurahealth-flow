import DashboardLayout from "@/components/DashboardLayout";
import { StatCard, Section } from "@/components/DashboardWidgets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { patientNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments, usePrescriptions, useLabReports } from "@/hooks/useSupabaseData";
import {
  LayoutDashboard, Search, Calendar, FileText, Video, Upload, User, Clock, Activity, Plus, Pill, Bot,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function PatientDashboard() {
  const { user, profile } = useAuth();
  const { data: appointments = [] } = useAppointments({ patientId: user?.id });
  const { data: prescriptions = [] } = usePrescriptions({ patientId: user?.id });
  const { data: labReports = [] } = useLabReports({ patientId: user?.id });

  const upcoming = appointments.filter((a: any) => a.status !== "Cancelled" && a.status !== "Completed");
  const activePrescriptions = prescriptions.filter((p: any) => p.status === "Active");
  const pendingReports = labReports.filter((r: any) => r.status !== "Completed");

  const displayName = profile?.full_name || "Patient";

  return (
    <DashboardLayout navItems={patientNavItems} role="Patient" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-extrabold">Good morning, {displayName.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground">Here's your health overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Upcoming Appointments" value={upcoming.length} icon={Calendar} />
          <StatCard title="Active Prescriptions" value={activePrescriptions.length} icon={Pill} />
          <StatCard title="Lab Reports" value={labReports.length} icon={FileText} change={`${pendingReports.length} pending`} trend="neutral" />
          <StatCard title="Health Score" value="--" icon={Activity} />
        </div>

        <Section title="Upcoming Appointments" description="Your next scheduled visits" action={
          <Button size="sm" asChild><Link to="/patient/doctors"><Plus className="h-4 w-4 mr-1" /> Book New</Link></Button>
        }>
          <div className="grid gap-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No upcoming appointments. <Link to="/patient/doctors" className="text-primary hover:underline">Find a doctor</Link></p>
            ) : upcoming.slice(0, 3).map((apt: any) => (
              <div key={apt.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{apt.doctor_name}</p>
                    <p className="text-xs text-muted-foreground">{apt.doctor_specialty}</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium">{format(new Date(apt.date), "MMM d, yyyy")}</p>
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

        <Section title="Quick Actions">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Search, label: "Find Doctor", href: "/patient/doctors" },
              { icon: Video, label: "Start Consult", href: "/patient/consultations" },
              { icon: Upload, label: "Upload Report", href: "/patient/lab-reports" },
              { icon: Pill, label: "Pharmacy", href: "/patient/pharmacy" },
            ].map((action) => (
              <Link key={action.label} to={action.href} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-primary/30 transition-all group">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </Section>

        <Section title="Recent Prescriptions">
          <div className="grid gap-3">
            {activePrescriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No active prescriptions</p>
            ) : activePrescriptions.slice(0, 3).map((rx: any) => (
              <div key={rx.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
                    <FileText className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{rx.doctor_name}</p>
                    <p className="text-xs text-muted-foreground">{rx.diagnosis} · {rx.medications?.length || 0} medications</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild><Link to="/patient/prescriptions">View</Link></Button>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </DashboardLayout>
  );
}
