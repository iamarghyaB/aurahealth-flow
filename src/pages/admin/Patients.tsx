import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAllPatients } from "@/hooks/useSupabaseData";
import { Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPatients() {
  const { profile } = useAuth();
  const { data: patients = [], isLoading } = useAllPatients();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = patients.filter((p: any) =>
    (p.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = profile?.full_name || "Admin";

  return (
    <DashboardLayout navItems={adminNavItems} role="Admin" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div><h1 className="text-2xl font-extrabold">Patients</h1><p className="text-muted-foreground">{patients.length} registered patients</p></div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search patients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p: any, i: number) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }}>
                  <Card className="hover:shadow-md transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">{(p.full_name || "?").charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm">{p.full_name}</h3>
                        <p className="text-xs text-muted-foreground">{p.email || "No email"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><User className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No patients found</p></div>}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
