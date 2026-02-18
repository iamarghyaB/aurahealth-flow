import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { doctorNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctorByUserId, useHealthRecords, useCreateHealthRecord } from "@/hooks/useSupabaseData";
import { format } from "date-fns";
import { Search, Heart, User, Clock, ChevronRight, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const severityColor: Record<string, string> = {
  normal: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
};

export default function DoctorHealthRecords() {
  const { user, profile } = useAuth();
  const { data: doctorRecord } = useDoctorByUserId(user?.id);
  const { data: records = [], isLoading } = useHealthRecords({ doctorDbId: doctorRecord?.id });
  const createRecord = useCreateHealthRecord();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // Create form
  const [patientId, setPatientId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [severity, setSeverity] = useState("normal");
  const [summary, setSummary] = useState("");
  const [facility, setFacility] = useState("");
  const [details, setDetails] = useState([""]);

  const filtered = records.filter((r: any) =>
    (r.patient_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = profile?.full_name || "Doctor";

  const resetForm = () => { setPatientId(""); setTitle(""); setCategory("General"); setSeverity("normal"); setSummary(""); setFacility(""); setDetails([""]); };

  const handleCreate = () => {
    if (!patientId || !title || !doctorRecord) return;
    createRecord.mutate({
      patient_id: patientId,
      doctor_id: doctorRecord.id,
      title,
      category,
      severity,
      summary,
      facility,
      details: details.filter((d) => d.trim()),
    }, { onSuccess: () => { setShowCreate(false); resetForm(); } });
  };

  return (
    <DashboardLayout navItems={doctorNavItems} role="Doctor" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-extrabold">Health Records</h1><p className="text-muted-foreground">Manage patient health records</p></div>
          <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-1" />New Record</Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by patient or title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((record: any, i: number) => (
                <motion.div key={record.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }}>
                  <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelectedRecord(record)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", severityColor[record.severity || "normal"])}>
                          <Heart className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm">{record.title}</h3>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{record.category}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{record.summary}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><User className="h-3 w-3" />{record.patient_name}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(record.created_at), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><Heart className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No records found</p></div>}
          </div>
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedRecord && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRecord.title}</DialogTitle>
                <DialogDescription>{selectedRecord.patient_name} · {format(new Date(selectedRecord.created_at), "MMM d, yyyy")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="flex gap-2"><Badge variant="secondary">{selectedRecord.category}</Badge><Badge className={cn(severityColor[selectedRecord.severity || "normal"])}>{selectedRecord.severity}</Badge></div>
                {selectedRecord.facility && <p className="text-sm text-muted-foreground">Facility: {selectedRecord.facility}</p>}
                {selectedRecord.summary && <div><h4 className="text-sm font-semibold mb-1">Summary</h4><p className="text-sm text-muted-foreground">{selectedRecord.summary}</p></div>}
                {selectedRecord.details?.length > 0 && (
                  <div><h4 className="text-sm font-semibold mb-2">Details</h4>
                    <ul className="space-y-1.5">{selectedRecord.details.map((d: string, i: number) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />{d}</li>)}</ul>
                  </div>
                )}
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setSelectedRecord(null)}>Close</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Health Record</DialogTitle>
            <DialogDescription>Create a health record for a patient</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Patient ID (UUID)</Label><Input placeholder="Enter patient user ID..." value={patientId} onChange={(e) => setPatientId(e.target.value)} /></div>
            <div className="space-y-2"><Label>Title</Label><Input placeholder="e.g. Annual Physical Exam" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2"><Label>Category</Label>
                <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  {["General", "Cardiology", "Neurology", "Orthopedics", "Dermatology", "Surgery"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>Severity</Label>
                <Select value={severity} onValueChange={setSeverity}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="normal">Normal</SelectItem><SelectItem value="warning">Warning</SelectItem><SelectItem value="critical">Critical</SelectItem>
                </SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>Facility</Label><Input placeholder="Hospital..." value={facility} onChange={(e) => setFacility(e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>Summary</Label><Textarea placeholder="Brief summary..." value={summary} onChange={(e) => setSummary(e.target.value)} /></div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><Label>Details</Label><Button size="sm" variant="outline" onClick={() => setDetails((prev) => [...prev, ""])}><Plus className="h-3 w-3 mr-1" />Add</Button></div>
              {details.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder="Detail point..." value={d} onChange={(e) => setDetails((prev) => prev.map((v, idx) => idx === i ? e.target.value : v))} className="flex-1" />
                  <Button size="icon" variant="ghost" onClick={() => setDetails((prev) => prev.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!patientId || !title || createRecord.isPending}>{createRecord.isPending ? "Creating..." : "Create Record"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
