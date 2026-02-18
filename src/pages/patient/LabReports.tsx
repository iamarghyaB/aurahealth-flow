import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { patientNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLabReports } from "@/hooks/useSupabaseData";
import { format } from "date-fns";
import {
  Search, FileText, User, Clock, ChevronRight, FlaskConical, Microscope,
  CheckCircle2, AlertCircle, Activity, Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig: Record<string, { color: string; icon: any }> = {
  Completed: { color: "bg-success text-success-foreground", icon: CheckCircle2 },
  Processing: { color: "bg-info text-info-foreground", icon: Activity },
  Pending: { color: "bg-warning text-warning-foreground", icon: AlertCircle },
};

const resultStatusStyle: Record<string, { bg: string; text: string; label: string }> = {
  normal: { bg: "bg-success/10", text: "text-success", label: "Normal" },
  high: { bg: "bg-destructive/10", text: "text-destructive", label: "High" },
  low: { bg: "bg-warning/10", text: "text-warning", label: "Low" },
};

export default function LabReports() {
  const { user, profile } = useAuth();
  const { data: labReports = [], isLoading } = useLabReports({ patientId: user?.id });
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const categories = ["All", ...new Set(labReports.map((r: any) => r.category))];

  const filtered = labReports.filter((r: any) => {
    const matchSearch = (r.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || (r.ordered_by || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = category === "All" || r.category === category;
    return matchSearch && matchCategory;
  });

  const completed = labReports.filter((r: any) => r.status === "Completed").length;
  const pending = labReports.filter((r: any) => r.status !== "Completed").length;
  const abnormal = labReports.filter((r: any) => (r.results || []).some((res: any) => res.status !== "normal")).length;
  const displayName = profile?.full_name || "Patient";

  return (
    <DashboardLayout navItems={patientNavItems} role="Patient" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div><h1 className="text-2xl font-extrabold">Lab Reports</h1><p className="text-muted-foreground">View your laboratory test results</p></div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Reports", value: labReports.length, icon: FileText, color: "text-primary" },
            { label: "Completed", value: completed, icon: CheckCircle2, color: "text-success" },
            { label: "Pending", value: pending, icon: Clock, color: "text-warning" },
            { label: "Abnormal Results", value: abnormal, icon: AlertCircle, color: "text-destructive" },
          ].map((stat) => (
            <Card key={stat.label}><CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-muted"><stat.icon className={cn("h-5 w-5", stat.color)} /></div>
              <div><p className={cn("text-xl font-extrabold", stat.color)}>{stat.value}</p><p className="text-[10px] text-muted-foreground">{stat.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search reports..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((report: any, i: number) => {
                const config = statusConfig[report.status] || statusConfig.Pending;
                const abnormalCount = (report.results || []).filter((r: any) => r.status !== "normal").length;
                return (
                  <motion.div key={report.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }}>
                    <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer" onClick={() => report.status === "Completed" && setSelectedReport(report)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><FlaskConical className="h-5 w-5 text-primary" /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-sm">{report.title}</h3>
                              <Badge className={cn("text-[10px] px-1.5 py-0", config.color)}>{report.status}</Badge>
                              {abnormalCount > 0 && <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-destructive border-destructive/30">{abnormalCount} abnormal</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{report.category} · {report.lab_name}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(report.created_at), "MMM d, yyyy")}</span>
                              <span className="flex items-center gap-1"><User className="h-3 w-3" />{report.ordered_by}</span>
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
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><Microscope className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No reports found</p></div>}
          </div>
        )}
      </div>

      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{selectedReport.title}</DialogTitle>
                <DialogDescription>{format(new Date(selectedReport.created_at), "MMM d, yyyy")} · {selectedReport.lab_name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Test Results</h4>
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 px-4 py-2 bg-muted text-xs font-semibold text-muted-foreground"><span>Test</span><span>Result</span><span>Range</span><span>Status</span></div>
                    {(selectedReport.results || []).map((result: any, i: number) => {
                      const style = resultStatusStyle[result.status] || resultStatusStyle.normal;
                      return (
                        <div key={i} className={cn("grid grid-cols-[1fr_auto_auto_auto] gap-x-3 px-4 py-2.5 text-sm items-center", i % 2 === 0 ? "bg-background" : "bg-muted/30", result.status !== "normal" && "bg-destructive/5")}>
                          <span className="font-medium text-xs">{result.name}</span>
                          <span className={cn("font-semibold text-xs", style.text)}>{result.value}</span>
                          <span className="text-xs text-muted-foreground">{result.reference_range}</span>
                          <Badge className={cn("text-[10px] px-1.5 py-0", style.bg, style.text)}>{style.label}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {(selectedReport.results || []).some((r: any) => r.status !== "normal") && (
                  <div className="p-3 rounded-xl bg-warning/5 border border-warning/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                      <div className="text-sm"><p className="font-semibold text-warning">Attention Required</p><p className="text-xs text-muted-foreground mt-0.5">Some results are outside normal range. Please consult with {selectedReport.ordered_by}.</p></div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setSelectedReport(null)}>Close</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
