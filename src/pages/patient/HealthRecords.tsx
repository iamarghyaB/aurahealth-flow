import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Search, Calendar, FileText, MessageSquare,
  Video, Upload, User, Pill, Bot, Shield, Heart, Activity,
  Droplets, Eye, Download, Plus, Clock, AlertTriangle, ChevronRight,
  Thermometer, Weight, Ruler, Syringe, FileCheck, Lock,
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

interface HealthRecord {
  id: number;
  title: string;
  category: string;
  date: string;
  doctor: string;
  facility: string;
  summary: string;
  details: string[];
  icon: typeof Heart;
  severity?: "normal" | "warning" | "critical";
}

const healthRecords: HealthRecord[] = [
  { id: 1, title: "Annual Physical Exam", category: "Checkup", date: "Feb 10, 2026", doctor: "Dr. Emily Davis", facility: "City Health Center", summary: "All vitals within normal range. Cholesterol slightly elevated.", details: ["Blood pressure: 120/80 mmHg", "Heart rate: 72 bpm", "BMI: 24.2", "Cholesterol: 215 mg/dL (borderline)", "Blood sugar: 95 mg/dL (normal)"], icon: FileCheck, severity: "normal" },
  { id: 2, title: "Cardiology Consultation", category: "Specialist", date: "Jan 28, 2026", doctor: "Dr. Sarah Johnson", facility: "Downtown Clinic", summary: "ECG normal sinus rhythm. Stress test results satisfactory.", details: ["ECG: Normal sinus rhythm", "Stress test: Adequate exercise tolerance", "Echocardiogram: Normal ejection fraction (60%)", "Recommendation: Continue current medications", "Follow-up in 6 months"], icon: Heart, severity: "normal" },
  { id: 3, title: "Dermatology Visit", category: "Specialist", date: "Jan 15, 2026", doctor: "Dr. Michael Chen", facility: "Westside Medical", summary: "Skin examination completed. Minor eczema on forearms treated.", details: ["Diagnosis: Mild atopic dermatitis", "Treatment: Topical corticosteroid cream", "Skin cancer screening: No suspicious lesions", "Follow-up: As needed"], icon: Eye, severity: "normal" },
  { id: 4, title: "Blood Work Results", category: "Lab", date: "Jan 10, 2026", doctor: "Dr. Emily Davis", facility: "City Health Center", summary: "Complete blood panel. Iron levels slightly low.", details: ["Hemoglobin: 13.2 g/dL", "WBC: 6,500/μL (normal)", "Platelet count: 250,000/μL (normal)", "Iron: 55 μg/dL (slightly low)", "Vitamin D: 32 ng/mL (sufficient)", "Thyroid TSH: 2.1 mIU/L (normal)"], icon: Droplets, severity: "warning" },
  { id: 5, title: "Vaccination Record", category: "Immunization", date: "Dec 5, 2025", doctor: "Dr. Emily Davis", facility: "City Health Center", summary: "Annual flu shot and COVID booster administered.", details: ["Influenza vaccine (2025-2026)", "COVID-19 booster (updated variant)", "Tdap: Up to date (2023)", "Hepatitis B: Complete series", "Next due: Annual flu shot (Oct 2026)"], icon: Syringe, severity: "normal" },
  { id: 6, title: "Emergency Visit", category: "Emergency", date: "Nov 18, 2025", doctor: "Dr. Robert Kim", facility: "Brain & Spine Center", summary: "Severe migraine episode. CT scan clear. Prescribed medication.", details: ["Chief complaint: Severe headache with aura", "CT scan: No abnormalities detected", "Diagnosis: Migraine with aura", "Treatment: Sumatriptan prescribed", "Follow-up: Neurology appointment scheduled"], icon: AlertTriangle, severity: "warning" },
];

const vitalHistory = [
  { label: "Blood Pressure", value: "120/80", unit: "mmHg", icon: Activity, trend: "stable", color: "text-success" },
  { label: "Heart Rate", value: "72", unit: "bpm", icon: Heart, trend: "stable", color: "text-success" },
  { label: "Weight", value: "165", unit: "lbs", icon: Weight, trend: "up", color: "text-warning" },
  { label: "Height", value: "5'10\"", unit: "", icon: Ruler, trend: "stable", color: "text-muted-foreground" },
  { label: "Temperature", value: "98.6", unit: "°F", icon: Thermometer, trend: "stable", color: "text-success" },
  { label: "Blood Sugar", value: "95", unit: "mg/dL", icon: Droplets, trend: "stable", color: "text-success" },
];

const allergies = [
  { name: "Penicillin", severity: "Severe", reaction: "Anaphylaxis" },
  { name: "Peanuts", severity: "Moderate", reaction: "Hives, swelling" },
  { name: "Latex", severity: "Mild", reaction: "Contact dermatitis" },
];

const medications = [
  { name: "Atorvastatin", dose: "20mg", frequency: "Once daily", prescriber: "Dr. Sarah Johnson", since: "Jan 2026" },
  { name: "Vitamin D3", dose: "2000 IU", frequency: "Once daily", prescriber: "Dr. Emily Davis", since: "Jan 2026" },
  { name: "Cetirizine", dose: "10mg", frequency: "As needed", prescriber: "Dr. Michael Chen", since: "Jan 2026" },
];

const conditions = [
  { name: "Borderline High Cholesterol", status: "Active", diagnosed: "Jan 2026" },
  { name: "Mild Atopic Dermatitis", status: "Managed", diagnosed: "Jan 2026" },
  { name: "Migraine with Aura", status: "Active", diagnosed: "Nov 2025" },
  { name: "Low Iron", status: "Monitoring", diagnosed: "Jan 2026" },
];

const severityColor: Record<string, string> = {
  normal: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
};

export default function HealthRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [tab, setTab] = useState("records");

  const filteredRecords = healthRecords.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems} role="Patient" userName="Alex Thompson">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Health Records</h1>
            <p className="text-muted-foreground">Your complete medical history in one place</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 text-success border-success/30">
              <Lock className="h-3 w-3" /> Encrypted
            </Badge>
          </div>
        </div>

        {/* Vitals Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {vitalHistory.map((vital) => (
            <Card key={vital.label}>
              <CardContent className="p-3 text-center space-y-1">
                <vital.icon className={cn("h-5 w-5 mx-auto", vital.color)} />
                <p className="text-lg font-extrabold">{vital.value}<span className="text-xs font-normal text-muted-foreground ml-0.5">{vital.unit}</span></p>
                <p className="text-[10px] text-muted-foreground">{vital.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="allergies">Allergies</TabsTrigger>
          </TabsList>

          {/* Records Tab */}
          <TabsContent value="records" className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records by title, category, or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredRecords.map((record, i) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card
                      className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", severityColor[record.severity || "normal"])}>
                            <record.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-sm">{record.title}</h3>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{record.category}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{record.summary}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{record.date}</span>
                              <span className="flex items-center gap-1"><User className="h-3 w-3" />{record.doctor}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredRecords.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">No records found</p>
                  <p className="text-sm">Try adjusting your search</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Conditions Tab */}
          <TabsContent value="conditions" className="mt-4 space-y-3">
            {conditions.map((condition, i) => (
              <motion.div key={condition.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center",
                        condition.status === "Active" ? "bg-warning/10" : condition.status === "Managed" ? "bg-success/10" : "bg-info/10"
                      )}>
                        <Activity className={cn(
                          "h-4 w-4",
                          condition.status === "Active" ? "text-warning" : condition.status === "Managed" ? "text-success" : "text-info"
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{condition.name}</p>
                        <p className="text-xs text-muted-foreground">Diagnosed: {condition.diagnosed}</p>
                      </div>
                    </div>
                    <Badge variant={condition.status === "Active" ? "default" : "secondary"}
                      className={cn(
                        "text-xs",
                        condition.status === "Active" && "bg-warning text-warning-foreground",
                        condition.status === "Managed" && "bg-success text-success-foreground"
                      )}
                    >
                      {condition.status}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="mt-4 space-y-3">
            {medications.map((med, i) => (
              <motion.div key={med.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Pill className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{med.name}</p>
                          <p className="text-xs text-muted-foreground">{med.dose} · {med.frequency}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{med.prescriber}</p>
                        <p className="text-[10px] text-muted-foreground">Since {med.since}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Allergies Tab */}
          <TabsContent value="allergies" className="mt-4 space-y-3">
            {allergies.map((allergy, i) => (
              <motion.div key={allergy.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center",
                        allergy.severity === "Severe" ? "bg-destructive/10" : allergy.severity === "Moderate" ? "bg-warning/10" : "bg-muted"
                      )}>
                        <AlertTriangle className={cn(
                          "h-4 w-4",
                          allergy.severity === "Severe" ? "text-destructive" : allergy.severity === "Moderate" ? "text-warning" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{allergy.name}</p>
                        <p className="text-xs text-muted-foreground">Reaction: {allergy.reaction}</p>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "text-xs",
                        allergy.severity === "Severe" && "bg-destructive text-destructive-foreground",
                        allergy.severity === "Moderate" && "bg-warning text-warning-foreground",
                        allergy.severity === "Mild" && "bg-muted text-muted-foreground"
                      )}
                    >
                      {allergy.severity}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Record Detail Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedRecord && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", severityColor[selectedRecord.severity || "normal"])}>
                    <selectedRecord.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle>{selectedRecord.title}</DialogTitle>
                    <DialogDescription>{selectedRecord.date} · {selectedRecord.doctor}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="secondary">{selectedRecord.category}</Badge>
                  <span>{selectedRecord.facility}</span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-1">Summary</h4>
                  <p className="text-sm text-muted-foreground">{selectedRecord.summary}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Details</h4>
                  <div className="space-y-2">
                    {selectedRecord.details.map((detail, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                        <span className="text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground border-t border-border">
                  <Shield className="h-3.5 w-3.5 text-success" />
                  <span>This record is encrypted and securely stored</span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
                <Button onClick={() => setSelectedRecord(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
