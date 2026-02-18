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
import { useDoctorByUserId, usePrescriptions, useCreatePrescription, useUpdatePrescription } from "@/hooks/useSupabaseData";
import { format } from "date-fns";
import { Search, Pill, User, Clock, ChevronRight, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const emptyMed = { name: "", dosage: "", frequency: "", duration: "", instructions: "" };

export default function DoctorPrescriptions() {
  const { user, profile } = useAuth();
  const { data: doctorRecord } = useDoctorByUserId(user?.id);
  const { data: prescriptions = [], isLoading } = usePrescriptions({ doctorDbId: doctorRecord?.id });
  const createPrescription = useCreatePrescription();
  const updatePrescription = useUpdatePrescription();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedRx, setSelectedRx] = useState<any>(null);

  // Create form state
  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState([{ ...emptyMed }]);

  const filtered = prescriptions.filter((rx: any) =>
    (rx.patient_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (rx.diagnosis || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = profile?.full_name || "Doctor";

  const resetForm = () => {
    setPatientId(""); setDiagnosis(""); setNotes(""); setMedications([{ ...emptyMed }]);
  };

  const handleCreate = () => {
    if (!patientId || !diagnosis || !doctorRecord) return;
    createPrescription.mutate({
      patient_id: patientId,
      doctor_id: doctorRecord.id,
      diagnosis,
      notes,
      medications: medications.filter((m) => m.name),
    }, { onSuccess: () => { setShowCreate(false); resetForm(); } });
  };

  const updateMed = (i: number, field: string, value: string) => {
    setMedications((prev) => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m));
  };

  return (
    <DashboardLayout navItems={doctorNavItems} role="Doctor" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-extrabold">Prescriptions</h1><p className="text-muted-foreground">Manage patient prescriptions</p></div>
          <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-1" />New Prescription</Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by patient or diagnosis..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((rx: any, i: number) => (
                <motion.div key={rx.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }}>
                  <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelectedRx(rx)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {(rx.patient_name || "?").charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm">{rx.patient_name}</h3>
                            <Badge variant={rx.status === "Active" ? "default" : "secondary"} className={rx.status === "Active" ? "bg-success text-success-foreground text-[10px] px-1.5 py-0" : "text-[10px] px-1.5 py-0"}>{rx.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{rx.diagnosis}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(rx.created_at), "MMM d, yyyy")}</span>
                            <span className="flex items-center gap-1"><Pill className="h-3 w-3" />{rx.medications?.length || 0} meds</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><Pill className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No prescriptions found</p></div>}
          </div>
        )}
      </div>

      {/* View/Edit Dialog */}
      <Dialog open={!!selectedRx} onOpenChange={(open) => !open && setSelectedRx(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedRx && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRx.patient_name} — {selectedRx.diagnosis}</DialogTitle>
                <DialogDescription>{format(new Date(selectedRx.created_at), "MMM d, yyyy")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="flex gap-2 flex-wrap">
                  {["Active", "Completed", "Expired"].map((s) => (
                    <Button key={s} size="sm" variant={selectedRx.status === s ? "default" : "outline"}
                      onClick={() => { updatePrescription.mutate({ id: selectedRx.id, status: s }); setSelectedRx((p: any) => ({ ...p, status: s })); }}>
                      {s}
                    </Button>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Medications ({selectedRx.medications?.length || 0})</h4>
                  {(selectedRx.medications || []).map((med: any, i: number) => (
                    <Card key={i} className="bg-muted/30 mb-2">
                      <CardContent className="p-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <span className="font-bold text-sm">{med.name}</span>
                          <Badge variant="secondary" className="text-[10px] ml-auto">{med.dosage}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{med.frequency} · {med.duration}</p>
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

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Prescription</DialogTitle>
            <DialogDescription>Create a prescription for a patient</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Patient ID (UUID)</Label>
              <Input placeholder="Enter patient user ID..." value={patientId} onChange={(e) => setPatientId(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Diagnosis</Label>
              <Input placeholder="e.g. Hypertension" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Medications</Label>
                <Button size="sm" variant="outline" onClick={() => setMedications((prev) => [...prev, { ...emptyMed }])}><Plus className="h-3 w-3 mr-1" />Add</Button>
              </div>
              {medications.map((med, i) => (
                <Card key={i} className="bg-muted/30">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex gap-2">
                      <Input placeholder="Medication name" value={med.name} onChange={(e) => updateMed(i, "name", e.target.value)} className="flex-1" />
                      <Button size="icon" variant="ghost" onClick={() => setMedications((prev) => prev.filter((_, idx) => idx !== i))} className="shrink-0"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="Dosage" value={med.dosage} onChange={(e) => updateMed(i, "dosage", e.target.value)} />
                      <Input placeholder="Frequency" value={med.frequency} onChange={(e) => updateMed(i, "frequency", e.target.value)} />
                      <Input placeholder="Duration" value={med.duration} onChange={(e) => updateMed(i, "duration", e.target.value)} />
                    </div>
                    <Input placeholder="Instructions (optional)" value={med.instructions} onChange={(e) => updateMed(i, "instructions", e.target.value)} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!patientId || !diagnosis || createPrescription.isPending}>
              {createPrescription.isPending ? "Creating..." : "Create Prescription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
