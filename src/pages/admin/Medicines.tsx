import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { adminNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicines, useCreateMedicine, useUpdateMedicine, useDeleteMedicine } from "@/hooks/useSupabaseData";
import { Search, Pill, Plus, Star, DollarSign, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminMedicines() {
  const { profile } = useAuth();
  const { data: medicines = [], isLoading } = useMedicines();
  const createMedicine = useCreateMedicine();
  const updateMedicine = useUpdateMedicine();
  const deleteMedicine = useDeleteMedicine();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Form state
  const [form, setForm] = useState({ name: "", generic_name: "", category: "General", form: "Tablet", dosage: "", price: "", manufacturer: "", description: "", prescription_required: false });

  const filtered = medicines.filter((m: any) =>
    (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.generic_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = profile?.full_name || "Admin";

  const resetForm = () => setForm({ name: "", generic_name: "", category: "General", form: "Tablet", dosage: "", price: "", manufacturer: "", description: "", prescription_required: false });

  const handleCreate = () => {
    if (!form.name) return;
    createMedicine.mutate({ ...form, price: Number(form.price) || 0 }, { onSuccess: () => { setShowCreate(false); resetForm(); } });
  };

  const handleToggleStock = (med: any) => {
    updateMedicine.mutate({ id: med.id, in_stock: !med.in_stock });
    if (selected?.id === med.id) setSelected((p: any) => ({ ...p, in_stock: !p.in_stock }));
  };

  return (
    <DashboardLayout navItems={adminNavItems} role="Admin" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-extrabold">Medicines</h1><p className="text-muted-foreground">{medicines.length} medicines in catalog</p></div>
          <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-1" />Add Medicine</Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search medicines..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((med: any, i: number) => (
                <motion.div key={med.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }}>
                  <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelected(med)}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Pill className="h-5 w-5 text-primary" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm">{med.name}</h3>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{med.category}</Badge>
                          <Badge variant={med.in_stock ? "default" : "destructive"} className={cn("text-[10px] px-1.5 py-0", med.in_stock ? "bg-success text-success-foreground" : "")}>{med.in_stock ? "In Stock" : "Out of Stock"}</Badge>
                          {med.prescription_required && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Rx Required</Badge>}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {med.generic_name && <span>{med.generic_name}</span>}
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />${Number(med.price).toFixed(2)}</span>
                          <span>{med.form} · {med.dosage}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><Pill className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No medicines found</p></div>}
          </div>
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>{selected.generic_name || selected.category} · {selected.form} {selected.dosage}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Price:</span> <span className="font-bold">${Number(selected.price).toFixed(2)}</span></div>
                  <div><span className="text-muted-foreground">Manufacturer:</span> <span className="font-medium">{selected.manufacturer || "N/A"}</span></div>
                </div>
                {selected.description && <p className="text-sm text-muted-foreground">{selected.description}</p>}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleToggleStock(selected)}>{selected.in_stock ? "Mark Out of Stock" : "Mark In Stock"}</Button>
                  <Button size="sm" variant="destructive" onClick={() => { setSelected(null); setDeleteTarget(selected); }}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
                </div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setSelected(null)}>Close</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { deleteMedicine.mutate(deleteTarget.id); setDeleteTarget(null); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Medicine</DialogTitle>
            <DialogDescription>Add a new medicine to the catalog</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Generic Name</Label><Input value={form.generic_name} onChange={(e) => setForm({ ...form, generic_name: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2"><Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  {["General", "Antibiotics", "Pain Relief", "Cardiovascular", "Diabetes", "Vitamins"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>Form</Label>
                <Select value={form.form} onValueChange={(v) => setForm({ ...form, form: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  {["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Drops"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>Price ($)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Dosage</Label><Input placeholder="e.g. 500mg" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} /></div>
              <div className="space-y-2"><Label>Manufacturer</Label><Input value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.name || createMedicine.isPending}>{createMedicine.isPending ? "Adding..." : "Add Medicine"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
