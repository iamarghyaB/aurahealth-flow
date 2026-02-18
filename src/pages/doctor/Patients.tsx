import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { doctorNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctorByUserId, useAppointments } from "@/hooks/useSupabaseData";
import { Search, User, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function DoctorPatients() {
  const { user, profile } = useAuth();
  const { data: doctorRecord } = useDoctorByUserId(user?.id);
  const { data: appointments = [], isLoading } = useAppointments({ doctorDbId: doctorRecord?.id });
  const [searchQuery, setSearchQuery] = useState("");

  // Derive unique patients from appointments
  const patientMap = new Map<string, { name: string; lastVisit: string; visits: number }>();
  appointments.forEach((a: any) => {
    const existing = patientMap.get(a.patient_id);
    if (!existing || new Date(a.date) > new Date(existing.lastVisit)) {
      patientMap.set(a.patient_id, {
        name: a.patient_name,
        lastVisit: a.date,
        visits: (existing?.visits || 0) + 1,
      });
    } else {
      patientMap.set(a.patient_id, { ...existing, visits: existing.visits + 1 });
    }
  });

  const patients = Array.from(patientMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());

  const displayName = profile?.full_name || "Doctor";

  return (
    <DashboardLayout navItems={doctorNavItems} role="Doctor" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div><h1 className="text-2xl font-extrabold">My Patients</h1><p className="text-muted-foreground">{patients.length} patients</p></div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search patients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="space-y-3">
            {patients.map((p) => (
              <Card key={p.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">{p.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm">{p.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Last: {format(new Date(p.lastVisit), "MMM d, yyyy")}</span>
                      <Badge variant="secondary" className="text-[10px]">{p.visits} visit{p.visits > 1 ? "s" : ""}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {patients.length === 0 && <div className="text-center py-12 text-muted-foreground"><User className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No patients yet</p></div>}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
