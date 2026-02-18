import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { patientNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthRecords } from "@/hooks/useSupabaseData";
import { format } from "date-fns";
import {
  Search, FileText, User, Clock, ChevronRight, Lock, Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const severityColor: Record<string, string> = {
  normal: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
};

export default function HealthRecords() {
  const { user, profile } = useAuth();
  const { data: records = [], isLoading } = useHealthRecords({ patientId: user?.id });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const filtered = records.filter((r: any) =>
    (r.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.doctor_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = profile?.full_name || "Patient";

  return (
    <DashboardLayout navItems={patientNavItems} role="Patient" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-extrabold">Health Records</h1><p className="text-muted-foreground">Your complete medical history</p></div>
          <Badge variant="outline" className="gap-1 text-success border-success/30"><Lock className="h-3 w-3" /> Encrypted</Badge>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
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
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(record.created_at), "MMM d, yyyy")}</span>
                            <span className="flex items-center gap-1"><User className="h-3 w-3" />{record.doctor_name}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><FileText className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No records found</p></div>}
          </div>
        )}
      </div>

      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedRecord && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRecord.title}</DialogTitle>
                <DialogDescription>{format(new Date(selectedRecord.created_at), "MMM d, yyyy")} · {selectedRecord.doctor_name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="secondary">{selectedRecord.category}</Badge>
                  {selectedRecord.facility && <span>{selectedRecord.facility}</span>}
                </div>
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
    </DashboardLayout>
  );
}
