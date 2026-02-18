import DashboardLayout from "@/components/DashboardLayout";
import { StatCard, Section } from "@/components/DashboardWidgets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { doctorNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctorByUserId, useAppointments } from "@/hooks/useSupabaseData";
import { Users, Calendar, DollarSign, TrendingUp, User, Video, FileText, Activity } from "lucide-react";
import { format } from "date-fns";

export default function DoctorDashboard() {
  const { user, profile } = useAuth();
  const { data: doctorRecord } = useDoctorByUserId(user?.id);
  const { data: appointments = [] } = useAppointments({ doctorDbId: doctorRecord?.id });

  const displayName = profile?.full_name || "Doctor";
  const todaysAppointments = appointments.filter((a: any) => a.date === format(new Date(), "yyyy-MM-dd") && a.status !== "Cancelled");
  const upcoming = appointments.filter((a: any) => new Date(a.date) >= new Date() && a.status !== "Cancelled" && a.status !== "Completed");

  return (
    <DashboardLayout navItems={doctorNavItems} role="Doctor" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-extrabold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Today's Patients" value={todaysAppointments.length} icon={Users} />
          <StatCard title="Upcoming" value={upcoming.length} icon={Calendar} />
          <StatCard title="Rating" value={doctorRecord ? Number(doctorRecord.rating || 0).toFixed(1) : "--"} icon={TrendingUp} />
          <StatCard title="Fee" value={doctorRecord ? `$${Number(doctorRecord.fee || 0).toFixed(0)}` : "--"} icon={DollarSign} />
        </div>

        <Section title="Today's Schedule" description={`${todaysAppointments.length} appointments`}>
          <div className="space-y-3">
            {todaysAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No appointments today</p>
            ) : todaysAppointments.map((apt: any) => (
              <div key={apt.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-accent flex items-center justify-center"><User className="h-5 w-5 text-accent-foreground" /></div>
                  <div>
                    <p className="font-semibold text-sm">{apt.patient_name}</p>
                    <p className="text-xs text-muted-foreground">{apt.time} · {apt.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={apt.type === "Video" ? "default" : "secondary"}>{apt.type}</Badge>
                  <Badge variant={apt.status === "Confirmed" ? "default" : "outline"} className={apt.status === "Confirmed" ? "bg-success text-success-foreground" : ""}>{apt.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="All Upcoming Appointments">
          <div className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No upcoming appointments</p>
            ) : upcoming.slice(0, 5).map((apt: any) => (
              <div key={apt.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><User className="h-4 w-4 text-primary" /></div>
                  <div>
                    <p className="text-sm font-semibold">{apt.patient_name}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(apt.date), "MMM d, yyyy")} · {apt.time}</p>
                  </div>
                </div>
                <Badge variant="outline">{apt.status}</Badge>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </DashboardLayout>
  );
}
