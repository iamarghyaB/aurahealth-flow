import DashboardLayout from "@/components/DashboardLayout";
import { StatCard, Section } from "@/components/DashboardWidgets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctors, useAllAppointments, useMedicines, useAllOrders } from "@/hooks/useSupabaseData";
import { Users, Stethoscope, Calendar, DollarSign, UserPlus, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { data: doctors = [] } = useDoctors();
  const { data: appointments = [] } = useAllAppointments();
  const { data: medicines = [] } = useMedicines();
  const { data: orders = [] } = useAllOrders();

  const displayName = profile?.full_name || "Admin";
  const todaysAppointments = appointments.filter((a: any) => a.date === format(new Date(), "yyyy-MM-dd"));
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);

  return (
    <DashboardLayout navItems={adminNavItems} role="Admin" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Clinic Overview</h1>
            <p className="text-muted-foreground">MediFlow Health Center · {format(new Date(), "MMM d, yyyy")}</p>
          </div>
          <Button size="sm" asChild><Link to="/admin/access-control"><UserPlus className="h-4 w-4 mr-1" /> Manage Users</Link></Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Doctors" value={doctors.length} icon={Stethoscope} />
          <StatCard title="Today's Appointments" value={todaysAppointments.length} icon={Calendar} />
          <StatCard title="Medicines" value={medicines.length} icon={Users} />
          <StatCard title="Total Orders" value={orders.length} icon={DollarSign} change={`$${totalRevenue.toFixed(0)} revenue`} trend="up" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Section title="Doctors" action={<Button variant="outline" size="sm" asChild><Link to="/admin/access-control">Manage</Link></Button>}>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Specialty</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  </tr></thead>
                  <tbody>
                    {doctors.slice(0, 5).map((d: any) => (
                      <tr key={d.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="p-4"><span className="text-sm font-semibold">{d.name}</span></td>
                        <td className="p-4 text-sm text-muted-foreground">{d.specialty}</td>
                        <td className="p-4"><Badge variant={d.available ? "default" : "secondary"} className={d.available ? "bg-success text-success-foreground" : ""}>{d.available ? "Active" : "Inactive"}</Badge></td>
                      </tr>
                    ))}
                    {doctors.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-sm text-muted-foreground">No doctors registered</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          <Section title="Recent Orders">
            <div className="space-y-3">
              {orders.length === 0 ? <p className="text-sm text-muted-foreground py-4">No orders yet</p> : orders.slice(0, 5).map((o: any) => (
                <div key={o.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{o.patient_name}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(o.created_at), "MMM d, yyyy")} · {o.order_items?.length || 0} items</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">${Number(o.total).toFixed(2)}</span>
                    <Badge variant="outline">{o.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </DashboardLayout>
  );
}
