import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { adminNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctors, useUpdateDoctor } from "@/hooks/useSupabaseData";
import { Search, Stethoscope, MapPin, Star, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDoctors() {
  const { profile } = useAuth();
  const { data: doctors = [], isLoading } = useDoctors();
  const updateDoctor = useUpdateDoctor();
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const filtered = doctors.filter((d: any) =>
    (d.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.specialty || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = profile?.full_name || "Admin";

  return (
    <DashboardLayout navItems={adminNavItems} role="Admin" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div><h1 className="text-2xl font-extrabold">Doctors</h1><p className="text-muted-foreground">{doctors.length} registered doctors</p></div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or specialty..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((doc: any, i: number) => (
                <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }}>
                  <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelected(doc)}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">{(doc.name || "?").charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm">{doc.name}</h3>
                          <Badge variant={doc.available ? "default" : "secondary"} className={cn("text-[10px] px-1.5 py-0", doc.available ? "bg-success text-success-foreground" : "")}>{doc.available ? "Active" : "Inactive"}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Stethoscope className="h-3 w-3" />{doc.specialty}</span>
                          {doc.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{doc.location}</span>}
                          <span className="flex items-center gap-1"><Star className="h-3 w-3" />{Number(doc.rating || 0).toFixed(1)}</span>
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />${doc.fee || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><Stethoscope className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No doctors found</p></div>}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>{selected.specialty} · {selected.email}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Location:</span> <span className="font-medium">{selected.location || "N/A"}</span></div>
                  <div><span className="text-muted-foreground">Fee:</span> <span className="font-medium">${selected.fee || 0}</span></div>
                  <div><span className="text-muted-foreground">Experience:</span> <span className="font-medium">{selected.experience_years || 0} years</span></div>
                  <div><span className="text-muted-foreground">Rating:</span> <span className="font-medium">{Number(selected.rating || 0).toFixed(1)} ({selected.reviews_count || 0} reviews)</span></div>
                </div>
                {selected.bio && <div><h4 className="text-sm font-semibold mb-1">Bio</h4><p className="text-sm text-muted-foreground">{selected.bio}</p></div>}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Status</h4>
                  <div className="flex gap-2">
                    <Button size="sm" variant={selected.available ? "default" : "outline"} onClick={() => { updateDoctor.mutate({ id: selected.id, available: true }); setSelected((p: any) => ({ ...p, available: true })); }}>Active</Button>
                    <Button size="sm" variant={!selected.available ? "default" : "outline"} onClick={() => { updateDoctor.mutate({ id: selected.id, available: false }); setSelected((p: any) => ({ ...p, available: false })); }}>Inactive</Button>
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
