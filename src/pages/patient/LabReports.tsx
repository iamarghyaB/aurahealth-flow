import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Search, Calendar, FileText, MessageSquare,
  Video, Upload, User, Pill, Bot, Download, Eye, Clock,
  ChevronRight, FlaskConical, Microscope, Droplets, Activity,
  CheckCircle2, AlertCircle, XCircle, Plus, File, Trash2, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { title: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { title: "Find Doctors", href: "/patient/doctors", icon: Search },
  { title: "Appointments", href: "/patient/appointments", icon: Calendar },
  { title: "Consultations", href: "/patient/consultations", icon: Video },
  { title: "Messages", href: "/patient/messages", icon: MessageSquare },
  { title: "Health Records", href: "/patient/records", icon: FileText },
  { title: "Lab Reports", href: "/patient/lab-reports", icon: Upload },
  { title: "Prescriptions", href: "/patient/prescriptions", icon: Pill },
  { title: "Pharmacy", href: "/patient/pharmacy", icon: Pill },
  { title: "AI Symptom Checker", href: "/patient/symptom-checker", icon: Bot },
  { title: "Profile", href: "/patient/profile", icon: User },
];

interface LabReport {
  id: number;
  title: string;
  category: string;
  date: string;
  lab: string;
  orderedBy: string;
  status: "Completed" | "Pending" | "Processing";
  results: { name: string; value: string; range: string; status: "normal" | "high" | "low" }[];
  fileSize: string;
}

const labReports: LabReport[] = [
  {
    id: 1, title: "Complete Blood Count (CBC)", category: "Hematology", date: "Feb 12, 2026", lab: "City Diagnostics Lab", orderedBy: "Dr. Emily Davis", status: "Completed", fileSize: "1.2 MB",
    results: [
      { name: "Hemoglobin", value: "13.2 g/dL", range: "13.5-17.5", status: "low" },
      { name: "WBC Count", value: "6,500 /μL", range: "4,500-11,000", status: "normal" },
      { name: "RBC Count", value: "4.8 M/μL", range: "4.5-5.5", status: "normal" },
      { name: "Platelet Count", value: "250,000 /μL", range: "150,000-400,000", status: "normal" },
      { name: "Hematocrit", value: "39.5%", range: "38.8-50.0", status: "normal" },
      { name: "MCV", value: "82 fL", range: "80-100", status: "normal" },
    ],
  },
  {
    id: 2, title: "Lipid Panel", category: "Biochemistry", date: "Feb 12, 2026", lab: "City Diagnostics Lab", orderedBy: "Dr. Sarah Johnson", status: "Completed", fileSize: "0.8 MB",
    results: [
      { name: "Total Cholesterol", value: "215 mg/dL", range: "<200", status: "high" },
      { name: "LDL Cholesterol", value: "135 mg/dL", range: "<100", status: "high" },
      { name: "HDL Cholesterol", value: "52 mg/dL", range: ">40", status: "normal" },
      { name: "Triglycerides", value: "140 mg/dL", range: "<150", status: "normal" },
      { name: "VLDL", value: "28 mg/dL", range: "5-40", status: "normal" },
    ],
  },
  {
    id: 3, title: "Thyroid Function Test", category: "Endocrinology", date: "Jan 28, 2026", lab: "MedLab Diagnostics", orderedBy: "Dr. Emily Davis", status: "Completed", fileSize: "0.6 MB",
    results: [
      { name: "TSH", value: "2.1 mIU/L", range: "0.4-4.0", status: "normal" },
      { name: "Free T4", value: "1.2 ng/dL", range: "0.8-1.8", status: "normal" },
      { name: "Free T3", value: "3.1 pg/mL", range: "2.3-4.2", status: "normal" },
    ],
  },
  {
    id: 4, title: "Liver Function Test", category: "Biochemistry", date: "Jan 28, 2026", lab: "MedLab Diagnostics", orderedBy: "Dr. Emily Davis", status: "Completed", fileSize: "0.9 MB",
    results: [
      { name: "ALT (SGPT)", value: "28 U/L", range: "7-56", status: "normal" },
      { name: "AST (SGOT)", value: "22 U/L", range: "10-40", status: "normal" },
      { name: "Bilirubin Total", value: "0.9 mg/dL", range: "0.1-1.2", status: "normal" },
      { name: "Albumin", value: "4.2 g/dL", range: "3.5-5.5", status: "normal" },
      { name: "ALP", value: "68 U/L", range: "44-147", status: "normal" },
    ],
  },
  {
    id: 5, title: "HbA1c Test", category: "Diabetes", date: "Jan 10, 2026", lab: "City Diagnostics Lab", orderedBy: "Dr. Emily Davis", status: "Completed", fileSize: "0.4 MB",
    results: [
      { name: "HbA1c", value: "5.4%", range: "<5.7", status: "normal" },
      { name: "Estimated Avg Glucose", value: "108 mg/dL", range: "<126", status: "normal" },
    ],
  },
  {
    id: 6, title: "Vitamin Panel", category: "Nutrition", date: "Feb 15, 2026", lab: "City Diagnostics Lab", orderedBy: "Dr. Emily Davis", status: "Processing", fileSize: "--",
    results: [],
  },
  {
    id: 7, title: "Urine Analysis", category: "Urinalysis", date: "Feb 16, 2026", lab: "MedLab Diagnostics", orderedBy: "Dr. Emily Davis", status: "Pending", fileSize: "--",
    results: [],
  },
];

interface UploadedFile {
  id: number;
  name: string;
  size: string;
  date: string;
}

const statusConfig = {
  Completed: { color: "bg-success text-success-foreground", icon: CheckCircle2 },
  Processing: { color: "bg-info text-info-foreground", icon: Activity },
  Pending: { color: "bg-warning text-warning-foreground", icon: AlertCircle },
};

const resultStatusStyle = {
  normal: { bg: "bg-success/10", text: "text-success", label: "Normal" },
  high: { bg: "bg-destructive/10", text: "text-destructive", label: "High" },
  low: { bg: "bg-warning/10", text: "text-warning", label: "Low" },
};

const categories = ["All", "Hematology", "Biochemistry", "Endocrinology", "Diabetes", "Nutrition", "Urinalysis"];

export default function LabReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const filtered = labReports.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.orderedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = category === "All" || r.category === category;
    return matchSearch && matchCategory;
  });

  const completed = labReports.filter((r) => r.status === "Completed").length;
  const pending = labReports.filter((r) => r.status !== "Completed").length;
  const abnormal = labReports.filter((r) => r.results.some((res) => res.status !== "normal")).length;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + " MB",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: number) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <DashboardLayout navItems={navItems} role="Patient" userName="Alex Thompson">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Lab Reports</h1>
            <p className="text-muted-foreground">View and manage your laboratory test results</p>
          </div>
          <Button className="gap-1" onClick={() => setShowUpload(true)}>
            <Upload className="h-4 w-4" /> Upload Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Reports", value: labReports.length, icon: FileText, color: "text-primary" },
            { label: "Completed", value: completed, icon: CheckCircle2, color: "text-success" },
            { label: "Pending", value: pending, icon: Clock, color: "text-warning" },
            { label: "Abnormal Results", value: abnormal, icon: AlertCircle, color: "text-destructive" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-muted")}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div>
                  <p className={cn("text-xl font-extrabold", stat.color)}>{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by name or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((report, i) => {
              const config = statusConfig[report.status];
              const abnormalCount = report.results.filter((r) => r.status !== "normal").length;
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card
                    className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
                    onClick={() => report.status === "Completed" && setSelectedReport(report)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <FlaskConical className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm">{report.title}</h3>
                            <Badge className={cn("text-[10px] px-1.5 py-0", config.color)}>
                              {report.status}
                            </Badge>
                            {abnormalCount > 0 && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-destructive border-destructive/30">
                                {abnormalCount} abnormal
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{report.category} · {report.lab}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{report.date}</span>
                            <span className="flex items-center gap-1"><User className="h-3 w-3" />{report.orderedBy}</span>
                            {report.fileSize !== "--" && (
                              <span className="flex items-center gap-1"><File className="h-3 w-3" />{report.fileSize}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {report.status === "Completed" && (
                            <Button variant="outline" size="sm" className="gap-1" onClick={(e) => { e.stopPropagation(); }}>
                              <Download className="h-3 w-3" /> PDF
                            </Button>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Microscope className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No reports found</p>
              <p className="text-sm">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FlaskConical className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-base">{selectedReport.title}</DialogTitle>
                    <DialogDescription>{selectedReport.date} · {selectedReport.lab}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="flex gap-2 text-sm">
                  <Badge variant="secondary">{selectedReport.category}</Badge>
                  <span className="text-muted-foreground">Ordered by {selectedReport.orderedBy}</span>
                </div>

                {/* Results Table */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Test Results</h4>
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 px-4 py-2 bg-muted text-xs font-semibold text-muted-foreground">
                      <span>Test</span>
                      <span>Result</span>
                      <span>Range</span>
                      <span>Status</span>
                    </div>
                    {selectedReport.results.map((result, i) => {
                      const style = resultStatusStyle[result.status];
                      return (
                        <div
                          key={i}
                          className={cn(
                            "grid grid-cols-[1fr_auto_auto_auto] gap-x-3 px-4 py-2.5 text-sm items-center",
                            i % 2 === 0 ? "bg-background" : "bg-muted/30",
                            result.status !== "normal" && "bg-destructive/5"
                          )}
                        >
                          <span className="font-medium text-xs">{result.name}</span>
                          <span className={cn("font-semibold text-xs", style.text)}>{result.value}</span>
                          <span className="text-xs text-muted-foreground">{result.range}</span>
                          <Badge className={cn("text-[10px] px-1.5 py-0", style.bg, style.text)}>
                            {style.label}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary */}
                {selectedReport.results.some((r) => r.status !== "normal") && (
                  <div className="p-3 rounded-xl bg-warning/5 border border-warning/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-warning">Attention Required</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {selectedReport.results.filter((r) => r.status !== "normal").length} result(s) outside normal range.
                          Please consult with {selectedReport.orderedBy} for interpretation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
                <Button onClick={() => setSelectedReport(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Lab Report</DialogTitle>
            <DialogDescription>Upload your lab reports in PDF, JPG, or PNG format</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-all",
                dragOver ? "border-primary bg-primary/5" : "border-border"
              )}
            >
              <Upload className={cn("h-10 w-10 mx-auto mb-3", dragOver ? "text-primary" : "text-muted-foreground")} />
              <p className="text-sm font-medium">Drag & drop files here</p>
              <p className="text-xs text-muted-foreground mt-1">or</p>
              <label>
                <input type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} />
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
              <p className="text-[10px] text-muted-foreground mt-3">Supported: PDF, JPG, PNG · Max 20MB per file</p>
            </div>

            {/* Uploaded files list */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Selected Files</h4>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <File className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(file.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowUpload(false); setUploadedFiles([]); }}>Cancel</Button>
            <Button disabled={uploadedFiles.length === 0} onClick={() => { setShowUpload(false); setUploadedFiles([]); }}>
              Upload {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
