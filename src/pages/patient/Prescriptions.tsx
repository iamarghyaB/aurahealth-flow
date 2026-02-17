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
import {
  LayoutDashboard, Search, Calendar, FileText, MessageSquare,
  Video, Upload, User, Pill, Bot, Download, Clock, ChevronRight,
  CheckCircle2, AlertCircle, RefreshCw, Heart, Printer,
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

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  id: number;
  date: string;
  doctor: string;
  doctorAvatar: string;
  specialty: string;
  facility: string;
  diagnosis: string;
  status: "Active" | "Completed" | "Expired";
  medications: Medication[];
  notes: string;
  refillsLeft: number;
  nextRefill?: string;
}

const prescriptions: Prescription[] = [
  {
    id: 1, date: "Feb 12, 2026", doctor: "Dr. Sarah Johnson", doctorAvatar: "SJ", specialty: "Cardiologist", facility: "Downtown Clinic",
    diagnosis: "Borderline Hypercholesterolemia", status: "Active", refillsLeft: 5, nextRefill: "Mar 12, 2026",
    medications: [
      { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", duration: "6 months", instructions: "Take at bedtime with or without food" },
      { name: "Omega-3 Fish Oil", dosage: "1000mg", frequency: "Twice daily", duration: "6 months", instructions: "Take with meals" },
    ],
    notes: "Follow up in 3 months for lipid panel recheck. Maintain low-fat diet and regular exercise.",
  },
  {
    id: 2, date: "Jan 28, 2026", doctor: "Dr. Michael Chen", doctorAvatar: "MC", specialty: "Dermatologist", facility: "Westside Medical",
    diagnosis: "Mild Atopic Dermatitis", status: "Active", refillsLeft: 2,
    medications: [
      { name: "Hydrocortisone Cream 1%", dosage: "Apply thin layer", frequency: "Twice daily", duration: "2 weeks", instructions: "Apply to affected areas. Do not use on face." },
      { name: "Cetirizine", dosage: "10mg", frequency: "Once daily as needed", duration: "As needed", instructions: "Take for itching relief. May cause drowsiness." },
      { name: "Cetaphil Moisturizer", dosage: "Apply liberally", frequency: "After shower", duration: "Ongoing", instructions: "Use fragrance-free. Apply to damp skin." },
    ],
    notes: "Avoid hot showers. Use gentle, fragrance-free products. Return if symptoms worsen.",
  },
  {
    id: 3, date: "Jan 10, 2026", doctor: "Dr. Emily Davis", doctorAvatar: "ED", specialty: "General Physician", facility: "City Health Center",
    diagnosis: "Iron Deficiency, Vitamin D Insufficiency", status: "Active", refillsLeft: 3, nextRefill: "Feb 10, 2026",
    medications: [
      { name: "Ferrous Sulfate", dosage: "325mg", frequency: "Once daily", duration: "3 months", instructions: "Take on empty stomach with Vitamin C for better absorption" },
      { name: "Vitamin D3", dosage: "2000 IU", frequency: "Once daily", duration: "3 months", instructions: "Take with a fatty meal" },
    ],
    notes: "Recheck iron and vitamin D levels in 3 months. Increase dietary iron intake.",
  },
  {
    id: 4, date: "Nov 18, 2025", doctor: "Dr. Robert Kim", doctorAvatar: "RK", specialty: "Neurologist", facility: "Brain & Spine Center",
    diagnosis: "Migraine with Aura", status: "Active", refillsLeft: 4,
    medications: [
      { name: "Sumatriptan", dosage: "50mg", frequency: "As needed at onset", duration: "As needed", instructions: "Take at first sign of migraine. Max 2 doses in 24 hours." },
      { name: "Magnesium Glycinate", dosage: "400mg", frequency: "Once daily", duration: "Ongoing", instructions: "Take at bedtime for migraine prevention" },
    ],
    notes: "Keep migraine diary. Avoid triggers (stress, bright lights, certain foods). Follow up in 3 months.",
  },
  {
    id: 5, date: "Sep 15, 2025", doctor: "Dr. Emily Davis", doctorAvatar: "ED", specialty: "General Physician", facility: "City Health Center",
    diagnosis: "Upper Respiratory Infection", status: "Completed", refillsLeft: 0,
    medications: [
      { name: "Amoxicillin", dosage: "500mg", frequency: "Three times daily", duration: "7 days", instructions: "Complete full course even if feeling better" },
      { name: "Guaifenesin", dosage: "400mg", frequency: "Every 4 hours as needed", duration: "5 days", instructions: "Drink plenty of water" },
    ],
    notes: "Rest and hydrate. Return if symptoms persist beyond 10 days or fever exceeds 103°F.",
  },
  {
    id: 6, date: "Jun 20, 2025", doctor: "Dr. Sarah Johnson", doctorAvatar: "SJ", specialty: "Cardiologist", facility: "Downtown Clinic",
    diagnosis: "Mild Hypertension (resolved)", status: "Expired", refillsLeft: 0,
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "3 months", instructions: "Take in the morning. Monitor blood pressure regularly." },
    ],
    notes: "Blood pressure normalized with lifestyle changes. Medication discontinued.",
  },
];

const statusConfig = {
  Active: { color: "bg-success text-success-foreground", icon: CheckCircle2 },
  Completed: { color: "bg-muted text-muted-foreground", icon: CheckCircle2 },
  Expired: { color: "bg-destructive/10 text-destructive", icon: AlertCircle },
};

export default function Prescriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  const filtered = prescriptions.filter((rx) => {
    const matchSearch =
      rx.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.medications.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === "All" || rx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const active = prescriptions.filter((r) => r.status === "Active").length;
  const totalMeds = prescriptions.filter((r) => r.status === "Active").reduce((sum, r) => sum + r.medications.length, 0);

  const handleDownloadPDF = (rx: Prescription) => {
    const content = [
      "═══════════════════════════════════════════",
      "              MEDIFLOW PRESCRIPTION          ",
      "═══════════════════════════════════════════",
      "",
      `Date: ${rx.date}`,
      `Prescription ID: MF-RX-${String(rx.id).padStart(5, "0")}`,
      "",
      "─── PRESCRIBER ────────────────────────────",
      `Doctor: ${rx.doctor}`,
      `Specialty: ${rx.specialty}`,
      `Facility: ${rx.facility}`,
      "",
      "─── PATIENT ───────────────────────────────",
      "Name: Alex Thompson",
      "DOB: March 15, 1990",
      "",
      "─── DIAGNOSIS ─────────────────────────────",
      rx.diagnosis,
      "",
      "─── MEDICATIONS ───────────────────────────",
      ...rx.medications.flatMap((m, i) => [
        "",
        `  ${i + 1}. ${m.name}`,
        `     Dosage: ${m.dosage}`,
        `     Frequency: ${m.frequency}`,
        `     Duration: ${m.duration}`,
        `     Instructions: ${m.instructions}`,
      ]),
      "",
      "─── NOTES ─────────────────────────────────",
      rx.notes,
      "",
      `Refills Remaining: ${rx.refillsLeft}`,
      rx.nextRefill ? `Next Refill Date: ${rx.nextRefill}` : "",
      "",
      "═══════════════════════════════════════════",
      "  This is a digitally generated prescription",
      "  Verified by MediFlow Healthcare Platform  ",
      "═══════════════════════════════════════════",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prescription-${rx.doctor.replace(/\s+/g, "-").toLowerCase()}-${rx.date.replace(/[\s,]+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout navItems={navItems} role="Patient" userName="Alex Thompson">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold">Prescriptions</h1>
          <p className="text-muted-foreground">View and download your digital prescriptions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Prescriptions", value: prescriptions.length, icon: FileText, color: "text-primary" },
            { label: "Active", value: active, icon: CheckCircle2, color: "text-success" },
            { label: "Active Medications", value: totalMeds, icon: Pill, color: "text-info" },
            { label: "Refills Available", value: prescriptions.reduce((s, r) => s + r.refillsLeft, 0), icon: RefreshCw, color: "text-warning" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
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

        {/* Prescription List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((rx, i) => {
              const config = statusConfig[rx.status];
              return (
                <motion.div key={rx.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }}>
                  <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelectedRx(rx)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {rx.doctorAvatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm">{rx.diagnosis}</h3>
                            <Badge className={cn("text-[10px] px-1.5 py-0", config.color)}>{rx.status}</Badge>
                            {rx.refillsLeft > 0 && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                <RefreshCw className="h-2.5 w-2.5 mr-0.5" /> {rx.refillsLeft} refills
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {rx.medications.map((m) => m.name).join(", ")}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{rx.date}</span>
                            <span className="flex items-center gap-1"><User className="h-3 w-3" />{rx.doctor}</span>
                            <span className="flex items-center gap-1"><Pill className="h-3 w-3" />{rx.medications.length} med{rx.medications.length > 1 ? "s" : ""}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button variant="outline" size="sm" className="gap-1" onClick={(e) => { e.stopPropagation(); handleDownloadPDF(rx); }}>
                            <Download className="h-3 w-3" /> PDF
                          </Button>
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
              <Pill className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No prescriptions found</p>
              <p className="text-sm">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Detail Dialog */}
      <Dialog open={!!selectedRx} onOpenChange={(open) => !open && setSelectedRx(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedRx && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {selectedRx.doctorAvatar}
                  </div>
                  <div>
                    <DialogTitle className="text-base">{selectedRx.diagnosis}</DialogTitle>
                    <DialogDescription>{selectedRx.doctor} · {selectedRx.date}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5 py-2">
                {/* Info row */}
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge className={cn("text-xs", statusConfig[selectedRx.status].color)}>{selectedRx.status}</Badge>
                  <Badge variant="secondary" className="text-xs">{selectedRx.specialty}</Badge>
                  <span className="text-xs text-muted-foreground">{selectedRx.facility}</span>
                </div>

                {/* Medications */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Medications ({selectedRx.medications.length})</h4>
                  {selectedRx.medications.map((med, i) => (
                    <Card key={i} className="bg-muted/30">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <span className="font-bold text-sm">{med.name}</span>
                          <Badge variant="secondary" className="text-[10px] ml-auto">{med.dosage}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Frequency: </span>
                            <span className="font-medium">{med.frequency}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration: </span>
                            <span className="font-medium">{med.duration}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground italic">📋 {med.instructions}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Separator />

                {/* Notes */}
                <div>
                  <h4 className="text-sm font-semibold mb-1">Doctor's Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedRx.notes}</p>
                </div>

                {/* Refill info */}
                {selectedRx.status === "Active" && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-primary" />
                        <span className="font-medium">Refills Remaining: <span className="text-primary font-bold">{selectedRx.refillsLeft}</span></span>
                      </div>
                      {selectedRx.nextRefill && (
                        <span className="text-xs text-muted-foreground">Next: {selectedRx.nextRefill}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Prescription ID */}
                <p className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border">
                  Prescription ID: MF-RX-{String(selectedRx.id).padStart(5, "0")} · Digitally verified by MediFlow
                </p>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" className="gap-1" onClick={() => handleDownloadPDF(selectedRx)}>
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Button variant="outline" className="gap-1" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" /> Print
                </Button>
                <Button onClick={() => setSelectedRx(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
