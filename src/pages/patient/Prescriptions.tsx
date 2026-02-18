import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { patientNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { usePrescriptions } from "@/hooks/useSupabaseData";
import { format } from "date-fns";
import {
  Search, FileText, User, Pill, Download, Clock, ChevronRight,
  CheckCircle2, AlertCircle, RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig: Record<string, { color: string; icon: any }> = {
  Active: { color: "bg-success text-success-foreground", icon: CheckCircle2 },
  Completed: { color: "bg-muted text-muted-foreground", icon: CheckCircle2 },
  Expired: { color: "bg-destructive/10 text-destructive", icon: AlertCircle },
};

export default function Prescriptions() {
  const { user, profile } = useAuth();
  const { data: prescriptions = [], isLoading } = usePrescriptions({ patientId: user?.id });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRx, setSelectedRx] = useState<any>(null);

  const filtered = prescriptions.filter((rx: any) => {
    const matchSearch = (rx.doctor_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rx.diagnosis || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rx.medications || []).some((m: any) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === "All" || rx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const active = prescriptions.filter((r: any) => r.status === "Active").length;
  const totalMeds = prescriptions.filter((r: any) => r.status === "Active").reduce((sum: number, r: any) => sum + (r.medications?.length || 0), 0);
  const displayName = profile?.full_name || "Patient";

  return (
    <DashboardLayout navItems={patientNavItems} role="Patient" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div><h1 className="text-2xl font-extrabold">Prescriptions</h1><p className="text-muted-foreground">View your digital prescriptions</p></div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: prescriptions.length, icon: FileText, color: "text-primary" },
            { label: "Active", value: active, icon: CheckCircle2, color: "text-success" },
            { label: "Active Medications", value: totalMeds, icon: Pill, color: "text-info" },
            { label: "Refills Available", value: prescriptions.reduce((s: number, r: any) => s + (r.refills_left || 0), 0), icon: RefreshCw, color: "text-warning" },
          ].map((stat) => (
            <Card key={stat.label}><CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center"><stat.icon className={cn("h-5 w-5", stat.color)} /></div>
              <div><p className={cn("text-xl font-extrabold", stat.color)}>{stat.value}</p><p className="text-[10px] text-muted-foreground">{stat.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by medication, doctor, or diagnosis..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((rx: any, i: number) => {
                const config = statusConfig[rx.status] || statusConfig.Active;
                return (
                  <motion.div key={rx.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }}>
                    <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelectedRx(rx)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">{(rx.doctor_name || "?").charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-sm">{rx.diagnosis || "No diagnosis"}</h3>
                              <Badge className={cn("text-[10px] px-1.5 py-0", config.color)}>{rx.status}</Badge>
                              {(rx.refills_left || 0) > 0 && <Badge variant="outline" className="text-[10px] px-1.5 py-0"><RefreshCw className="h-2.5 w-2.5 mr-0.5" /> {rx.refills_left} refills</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{(rx.medications || []).map((m: any) => m.name).join(", ") || "No medications"}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(rx.created_at), "MMM d, yyyy")}</span>
                              <span className="flex items-center gap-1"><User className="h-3 w-3" />{rx.doctor_name}</span>
                              <span className="flex items-center gap-1"><Pill className="h-3 w-3" />{rx.medications?.length || 0} med{(rx.medications?.length || 0) > 1 ? "s" : ""}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><Pill className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No prescriptions found</p></div>}
          </div>
        )}
      </div>

      <Dialog open={!!selectedRx} onOpenChange={(open) => !open && setSelectedRx(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedRx && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{selectedRx.diagnosis || "Prescription"}</DialogTitle>
                <DialogDescription>{selectedRx.doctor_name} · {format(new Date(selectedRx.created_at), "MMM d, yyyy")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-2">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Medications ({selectedRx.medications?.length || 0})</h4>
                  {(selectedRx.medications || []).map((med: any, i: number) => (
                    <Card key={i} className="bg-muted/30">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <span className="font-bold text-sm">{med.name}</span>
                          <Badge variant="secondary" className="text-[10px] ml-auto">{med.dosage}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-muted-foreground">Frequency: </span><span className="font-medium">{med.frequency}</span></div>
                          <div><span className="text-muted-foreground">Duration: </span><span className="font-medium">{med.duration}</span></div>
                        </div>
                        {med.instructions && <p className="text-xs text-muted-foreground italic">{med.instructions}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {selectedRx.notes && <div className="p-3 bg-muted/50 rounded-xl"><p className="text-sm font-semibold mb-1">Notes</p><p className="text-xs text-muted-foreground">{selectedRx.notes}</p></div>}
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setSelectedRx(null)}>Close</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
