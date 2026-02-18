import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { adminNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAllAppointments, useUpdateAppointment } from "@/hooks/useSupabaseData";
import { format } from "date-fns";
import { Search, Calendar, Clock, User, ChevronRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig: Record<string, { color: string; icon: any }> = {
  Pending: { color: "bg-warning/10 text-warning", icon: AlertCircle },
  Confirmed: { color: "bg-info/10 text-info", icon: CheckCircle2 },
  Completed: { color: "bg-success/10 text-success", icon: CheckCircle2 },
  Cancelled: { color: "bg-destructive/10 text-destructive", icon: XCircle },
};

export default function AdminAppointments() {
  const { profile } = useAuth();
  const { data: appointments = [], isLoading } = useAllAppointments();
  const updateAppointment = useUpdateAppointment();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<any>(null);

  const filtered = appointments.filter((a: any) => {
    const matchSearch = (a.patient_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.doctor_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const displayName = profile?.full_name || "Admin";

  const handleStatusChange = (id: string, status: string) => {
    updateAppointment.mutate({ id, status });
    if (selected?.id === id) setSelected((prev: any) => prev ? { ...prev, status } : null);
  };

  return (
    <DashboardLayout navItems={adminNavItems} role="Admin" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div><h1 className="text-2xl font-extrabold">All Appointments</h1><p className="text-muted-foreground">{appointments.length} total appointments</p></div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by patient or doctor..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((apt: any, i: number) => {
                const config = statusConfig[apt.status] || statusConfig.Pending;
                const Icon = config.icon;
                return (
                  <motion.div key={apt.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }}>
                    <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelected(apt)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">{(apt.patient_name || "?").charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-sm">{apt.patient_name}</h3>
                              <span className="text-xs text-muted-foreground">→ {apt.doctor_name}</span>
                              <Badge className={cn("text-[10px] px-1.5 py-0", config.color)}><Icon className="h-2.5 w-2.5 mr-0.5" />{apt.status}</Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(apt.date), "MMM d, yyyy")}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{apt.time}</span>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">{apt.type}</Badge>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No appointments found</p></div>}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.patient_name} → {selected.doctor_name}</DialogTitle>
                <DialogDescription>{format(new Date(selected.date), "EEEE, MMMM d, yyyy")} at {selected.time}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={cn(statusConfig[selected.status]?.color)}>{selected.status}</Badge>
                  <Badge variant="outline">{selected.type}</Badge>
                  {selected.fee > 0 && <Badge variant="secondary">${selected.fee}</Badge>}
                </div>
                {selected.notes && <div><h4 className="text-sm font-semibold mb-1">Notes</h4><p className="text-sm text-muted-foreground">{selected.notes}</p></div>}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Update Status</h4>
                  <div className="flex gap-2 flex-wrap">
                    {["Pending", "Confirmed", "Completed", "Cancelled"].map((s) => (
                      <Button key={s} size="sm" variant={selected.status === s ? "default" : "outline"} onClick={() => handleStatusChange(selected.id, s)}
                        className={s === "Cancelled" ? "border-destructive/30 text-destructive hover:bg-destructive/10" : ""}>
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setSelected(null)}>Close</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
