import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { adminNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAllOrders, useUpdateOrder } from "@/hooks/useSupabaseData";
import { format } from "date-fns";
import { Search, ShoppingCart, Clock, DollarSign, ChevronRight, Pill } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statusColor: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  Processing: "bg-info/10 text-info",
  Shipped: "bg-primary/10 text-primary",
  Delivered: "bg-success/10 text-success",
  Cancelled: "bg-destructive/10 text-destructive",
};

export default function AdminOrders() {
  const { profile } = useAuth();
  const { data: orders = [], isLoading } = useAllOrders();
  const updateOrder = useUpdateOrder();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<any>(null);

  const filtered = orders.filter((o: any) => {
    const matchSearch = (o.patient_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const displayName = profile?.full_name || "Admin";
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);

  const handleStatusChange = (id: string, status: string) => {
    updateOrder.mutate({ id, status });
    if (selected?.id === id) setSelected((p: any) => p ? { ...p, status } : null);
  };

  return (
    <DashboardLayout navItems={adminNavItems} role="Admin" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-extrabold">Orders</h1><p className="text-muted-foreground">{orders.length} orders · ${totalRevenue.toFixed(2)} total revenue</p></div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by patient..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((order: any, i: number) => (
                <motion.div key={order.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }}>
                  <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelected(order)}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><ShoppingCart className="h-5 w-5 text-primary" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm">{order.patient_name}</h3>
                          <Badge className={cn("text-[10px] px-1.5 py-0", statusColor[order.status] || statusColor.Pending)}>{order.status}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(order.created_at), "MMM d, yyyy")}</span>
                          <span className="flex items-center gap-1"><Pill className="h-3 w-3" />{order.order_items?.length || 0} items</span>
                          <span className="font-bold text-primary flex items-center gap-1"><DollarSign className="h-3 w-3" />${Number(order.total).toFixed(2)}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No orders found</p></div>}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Order — {selected.patient_name}</DialogTitle>
                <DialogDescription>{format(new Date(selected.created_at), "MMM d, yyyy")} · ${Number(selected.total).toFixed(2)}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Items ({selected.order_items?.length || 0})</h4>
                  {(selected.order_items || []).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg mb-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-primary" />
                        <span className="font-medium">{item.medicines?.name || "Unknown"}</span>
                        <span className="text-muted-foreground">×{item.quantity}</span>
                      </div>
                      <span className="font-bold">${Number(item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Update Status</h4>
                  <div className="flex gap-2 flex-wrap">
                    {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                      <Button key={s} size="sm" variant={selected.status === s ? "default" : "outline"} onClick={() => handleStatusChange(selected.id, s)}
                        className={s === "Cancelled" ? "border-destructive/30 text-destructive hover:bg-destructive/10" : ""}>
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setSelected(null)}>Close</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
