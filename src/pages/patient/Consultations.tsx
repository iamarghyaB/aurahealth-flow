import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { patientNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useConsultations } from "@/hooks/useSupabaseData";
import { format } from "date-fns";
import {
  Calendar, Clock, Video, User, Star, Phone, CheckCircle2, AlertCircle, XCircle, Plus, Pill,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const statusConfig: Record<string, { color: string; icon: any }> = {
  Completed: { color: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  "In Progress": { color: "bg-info/10 text-info border-info/20", icon: Video },
  Upcoming: { color: "bg-primary/10 text-primary border-primary/20", icon: Clock },
  Cancelled: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
  Missed: { color: "bg-warning/10 text-warning border-warning/20", icon: AlertCircle },
};

export default function Consultations() {
  const { user, profile } = useAuth();
  const { data: consultations = [], isLoading } = useConsultations({ patientId: user?.id });
  const [tab, setTab] = useState("all");
  const [detailConsult, setDetailConsult] = useState<any>(null);
  const displayName = profile?.full_name || "Patient";

  const filtered = consultations.filter((c: any) => {
    if (tab === "all") return true;
    if (tab === "upcoming") return c.status === "Upcoming" || c.status === "In Progress";
    if (tab === "completed") return c.status === "Completed";
    if (tab === "missed") return c.status === "Missed" || c.status === "Cancelled";
    return true;
  });

  return (
    <DashboardLayout navItems={patientNavItems} role="Patient" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="text-2xl font-extrabold">Consultations</h1><p className="text-muted-foreground text-sm">Manage your virtual consultations</p></div>
          <Button asChild><Link to="/patient/doctors"><Plus className="h-4 w-4 mr-1" />New Consultation</Link></Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total", value: consultations.length, icon: Video, color: "text-primary" },
            { label: "Completed", value: consultations.filter((c: any) => c.status === "Completed").length, icon: CheckCircle2, color: "text-success" },
            { label: "Upcoming", value: consultations.filter((c: any) => c.status === "Upcoming" || c.status === "In Progress").length, icon: Clock, color: "text-info" },
            { label: "Missed", value: consultations.filter((c: any) => c.status === "Missed" || c.status === "Cancelled").length, icon: AlertCircle, color: "text-warning" },
          ].map((stat) => (
            <Card key={stat.label}><CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
              <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="missed">Missed</TabsTrigger>
            </TabsList>
            <TabsContent value={tab} className="mt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((consult: any) => {
                    const config = statusConfig[consult.status] || statusConfig.Upcoming;
                    const StatusIcon = config.icon;
                    return (
                      <motion.div key={consult.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => setDetailConsult(consult)}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><User className="h-5 w-5 text-primary" /></div>
                            <div className="min-w-0"><p className="font-semibold text-sm truncate">{consult.doctor_name}</p><p className="text-xs text-muted-foreground">{consult.doctor_specialty}</p></div>
                          </div>
                          <Badge variant="outline" className={`${config.color} text-xs flex-shrink-0`}><StatusIcon className="h-3 w-3 mr-1" />{consult.status}</Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(consult.date), "MMM d, yyyy")}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{consult.time}</span>
                          <span className="flex items-center gap-1">{consult.type === "Video" ? <Video className="h-3 w-3" /> : <Phone className="h-3 w-3" />}{consult.type} · {consult.duration || "N/A"}</span>
                        </div>
                        {consult.notes && <p className="mt-2 text-xs text-muted-foreground truncate">{consult.notes}</p>}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {consult.rating && <span className="flex items-center gap-0.5 text-xs text-warning">{Array.from({ length: consult.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}</span>}
                            {consult.has_prescription && <Badge variant="secondary" className="text-[10px] ml-2"><Pill className="h-2.5 w-2.5 mr-0.5" />Prescription</Badge>}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
              {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><Video className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No consultations found</p></div>}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Dialog open={!!detailConsult} onOpenChange={(open) => !open && setDetailConsult(null)}>
        <DialogContent className="sm:max-w-md">
          {detailConsult && (
            <>
              <DialogHeader>
                <DialogTitle>{detailConsult.doctor_name}</DialogTitle>
                <DialogDescription>{detailConsult.doctor_specialty} · {format(new Date(detailConsult.date), "MMM d, yyyy")} at {detailConsult.time}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="flex gap-2">
                  <Badge variant="outline" className={(statusConfig[detailConsult.status] || statusConfig.Upcoming).color}>{detailConsult.status}</Badge>
                  <Badge variant="secondary">{detailConsult.type}</Badge>
                  {detailConsult.duration && <Badge variant="secondary">{detailConsult.duration}</Badge>}
                </div>
                {detailConsult.notes && <div><h4 className="text-sm font-semibold mb-1">Notes</h4><p className="text-sm text-muted-foreground">{detailConsult.notes}</p></div>}
                {detailConsult.follow_up && <p className="text-xs text-muted-foreground">Follow-up: {format(new Date(detailConsult.follow_up), "MMM d, yyyy")}</p>}
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setDetailConsult(null)}>Close</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
