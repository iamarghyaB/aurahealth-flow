import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { doctorNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctorByUserId, useLabReports, useCreateLabReport } from "@/hooks/useSupabaseData";
import { format } from "date-fns";
import { Search, FileText, User, Clock, ChevronRight, Plus, Trash2, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statusColor: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  Completed: "bg-success/10 text-success",
  Reviewed: "bg-info/10 text-info",
};

const emptyResult = { name: "", value: "", reference_range: "", status: "normal" };

export default function DoctorLabReports() {
  const { user, profile } = useAuth();
  const { data: doctorRecord } = useDoctorByUserId(user?.id);
  const { data: reports = [], isLoading } = useLabReports({ doctorDbId: doctorRecord?.id });
  const createLabReport = useCreateLabReport();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Create form
  const [patientId, setPatientId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [labName, setLabName] = useState("");
  const [results, setResults] = useState([{ ...emptyResult }]);

  const filtered = reports.filter((r: any) =>
    (r.patient_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = profile?.full_name || "Doctor";

  const resetForm = () => { setPatientId(""); setTitle(""); setCategory("General"); setLabName(""); setResults([{ ...emptyResult }]); };

  const handleCreate = () => {
    if (!patientId || !title || !doctorRecord) return;
    createLabReport.mutate({
      patient_id: patientId,
      doctor_id: doctorRecord.id,
      title,
      category,
      lab_name: labName,
      status: "Completed",
      results: results.filter((r) => r.name),
    }, { onSuccess: () => { setShowCreate(false); resetForm(); } });
  };

  const updateResult = (i: number, field: string, value: string) => {
    setResults((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };

  return (
    <DashboardLayout navItems={doctorNavItems} role="Doctor" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-extrabold">Lab Reports</h1><p className="text-muted-foreground">Manage patient lab results</p></div>
          <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-1" />New Report</Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by patient or title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((report: any, i: number) => (
                <motion.div key={report.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }}>
                  <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelectedReport(report)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", statusColor[report.status] || statusColor.Pending)}>
                          <FlaskConical className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm">{report.title}</h3>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{report.category}</Badge>
                            <Badge className={cn("text-[10px] px-1.5 py-0", statusColor[report.status])}>{report.status}</Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><User className="h-3 w-3" />{report.patient_name}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(report.created_at), "MMM d, yyyy")}</span>
                            <span>{report.results?.length || 0} results</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><FlaskConical className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No lab reports found</p></div>}
          </div>
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedReport.title}</DialogTitle>
                <DialogDescription>{selectedReport.patient_name} · {format(new Date(selectedReport.created_at), "MMM d, yyyy")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="flex gap-2"><Badge variant="secondary">{selectedReport.category}</Badge><Badge className={cn(statusColor[selectedReport.status])}>{selectedReport.status}</Badge></div>
                {selectedReport.lab_name && <p className="text-sm text-muted-foreground">Lab: {selectedReport.lab_name}</p>}
                {selectedReport.results?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Results</h4>
                    {selectedReport.results.map((r: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-sm">
                        <span className="font-medium">{r.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold">{r.value}</span>
                          {r.reference_range && <span className="text-muted-foreground text-xs">({r.reference_range})</span>}
                          <Badge variant={r.status === "normal" ? "secondary" : "destructive"} className="text-[10px]">{r.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setSelectedReport(null)}>Close</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Lab Report</DialogTitle>
            <DialogDescription>Create a lab report for a patient</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Patient ID (UUID)</Label><Input placeholder="Enter patient user ID..." value={patientId} onChange={(e) => setPatientId(e.target.value)} /></div>
            <div className="space-y-2"><Label>Title</Label><Input placeholder="e.g. Complete Blood Count" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  {["General", "Blood", "Urine", "Imaging", "Pathology"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>Lab Name</Label><Input placeholder="Lab name..." value={labName} onChange={(e) => setLabName(e.target.value)} /></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><Label>Results</Label><Button size="sm" variant="outline" onClick={() => setResults((prev) => [...prev, { ...emptyResult }])}><Plus className="h-3 w-3 mr-1" />Add</Button></div>
              {results.map((r, i) => (
                <Card key={i} className="bg-muted/30"><CardContent className="p-3 space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Test name" value={r.name} onChange={(e) => updateResult(i, "name", e.target.value)} className="flex-1" />
                    <Button size="icon" variant="ghost" onClick={() => setResults((prev) => prev.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="Value" value={r.value} onChange={(e) => updateResult(i, "value", e.target.value)} />
                    <Input placeholder="Ref range" value={r.reference_range} onChange={(e) => updateResult(i, "reference_range", e.target.value)} />
                    <Select value={r.status} onValueChange={(v) => updateResult(i, "status", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                      <SelectItem value="normal">Normal</SelectItem><SelectItem value="abnormal">Abnormal</SelectItem><SelectItem value="critical">Critical</SelectItem>
                    </SelectContent></Select>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!patientId || !title || createLabReport.isPending}>{createLabReport.isPending ? "Creating..." : "Create Report"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
