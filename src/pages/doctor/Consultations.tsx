import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { doctorNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctorByUserId, useConsultations, useUpdateConsultation } from "@/hooks/useSupabaseData";
import { format } from "date-fns";
import { Search, Video, Clock, User, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statusColor: Record<string, string> = {
  Upcoming: "bg-info/10 text-info",
  "In Progress": "bg-warning/10 text-warning",
  Completed: "bg-success/10 text-success",
  Cancelled: "bg-destructive/10 text-destructive",
};

export default function DoctorConsultations() {
  const { user, profile } = useAuth();
  const { data: doctorRecord } = useDoctorByUserId(user?.id);
  const { data: consultations = [], isLoading } = useConsultations({ doctorDbId: doctorRecord?.id });
  const updateConsultation = useUpdateConsultation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<any>(null);

  // need patient names - consultations hook doesn't have them yet, let's add inline
  const filtered = consultations.filter((c: any) =>
    (c.doctor_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.type || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = profile?.full_name || "Doctor";

  return (
    <DashboardLayout navItems={doctorNavItems} role="Doctor" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div><h1 className="text-2xl font-extrabold">Consultations</h1><p className="text-muted-foreground">Manage your consultations</p></div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((c: any, i: number) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }}>
                  <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelected(c)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", statusColor[c.status] || statusColor.Upcoming)}>
                          <Video className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm">{c.type} Consultation</h3>
                            <Badge className={cn("text-[10px] px-1.5 py-0", statusColor[c.status])}>{c.status}</Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(c.date), "MMM d, yyyy")} · {c.time}</span>
                            {c.duration && <span>{c.duration}</span>}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><Video className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No consultations found</p></div>}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.type} Consultation</DialogTitle>
                <DialogDescription>{format(new Date(selected.date), "MMM d, yyyy")} · {selected.time}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="flex gap-2"><Badge className={cn(statusColor[selected.status])}>{selected.status}</Badge>{selected.duration && <Badge variant="secondary">{selected.duration}</Badge>}</div>
                {selected.notes && <div><h4 className="text-sm font-semibold mb-1">Notes</h4><p className="text-sm text-muted-foreground">{selected.notes}</p></div>}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Update Status</h4>
                  <div className="flex gap-2 flex-wrap">
                    {["Upcoming", "In Progress", "Completed", "Cancelled"].map((s) => (
                      <Button key={s} size="sm" variant={selected.status === s ? "default" : "outline"} onClick={() => { updateConsultation.mutate({ id: selected.id, status: s }); setSelected((p: any) => ({ ...p, status: s })); }}>{s}</Button>
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
