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
import { patientNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicines, useCreateOrder } from "@/hooks/useSupabaseData";
import {
  Search, Pill, ShoppingCart, Plus, Minus, CreditCard, Package, Star, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartItem { medicine: any; quantity: number; }

export default function Pharmacy() {
  const { user, profile } = useAuth();
  const { data: medicines = [], isLoading } = useMedicines();
  const createOrder = useCreateOrder();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const categories = ["All", ...new Set(medicines.map((m: any) => m.category))];

  const filtered = medicines.filter((m: any) => {
    const matchSearch = (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (m.generic_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = category === "All" || m.category === category;
    return matchSearch && matchCategory;
  });

  const addToCart = (medicine: any) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.medicine.id === medicine.id);
      if (existing) return prev.map((c) => c.medicine.id === medicine.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { medicine, quantity: 1 }];
    });
  };
  const updateQuantity = (id: string, delta: number) => setCart((prev) => prev.map((c) => c.medicine.id === id ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c).filter((c) => c.quantity > 0));
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.medicine.id !== id));
  const cartTotal = cart.reduce((sum, c) => sum + Number(c.medicine.price) * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const placeOrder = async () => {
    if (!user) return;
    await createOrder.mutateAsync({
      patient_id: user.id,
      total: cartTotal,
      status: "Pending",
      items: cart.map((c) => ({ medicine_id: c.medicine.id, quantity: c.quantity, price: Number(c.medicine.price) })),
    });
    setOrderPlaced(true);
  };
  const resetOrder = () => { setCart([]); setOrderPlaced(false); setShowCheckout(false); };

  const displayName = profile?.full_name || "Patient";

  return (
    <DashboardLayout navItems={patientNavItems} role="Patient" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-extrabold">Pharmacy</h1><p className="text-muted-foreground">Order medicines and health products</p></div>
          <Button variant="outline" className="gap-1 relative" onClick={() => setShowCart(true)}>
            <ShoppingCart className="h-4 w-4" /><span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{cartCount}</span>}
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search medicines..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((med: any, i: number) => {
                const inCart = cart.find((c) => c.medicine.id === med.id);
                return (
                  <motion.div key={med.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                    <Card className={cn("h-full flex flex-col hover:shadow-md transition-all", !med.in_stock && "opacity-60")}>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Pill className="h-5 w-5 text-primary" /></div>
                          <div className="flex gap-1">
                            {med.prescription_required && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-warning/30 text-warning">Rx Required</Badge>}
                            {!med.in_stock && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-destructive/30 text-destructive">Out of Stock</Badge>}
                          </div>
                        </div>
                        <h3 className="font-bold text-sm">{med.name}</h3>
                        <p className="text-[10px] text-muted-foreground">{med.generic_name}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">{med.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{med.dosage}</Badge>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{med.form}</Badge>
                          <span className="flex items-center gap-0.5 ml-auto"><Star className="h-3 w-3 text-warning fill-warning" />{Number(med.rating || 0).toFixed(1)}</span>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-extrabold text-primary">${Number(med.price).toFixed(2)}</p>
                          {med.in_stock ? (inCart ? (
                            <div className="flex items-center gap-2">
                              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(med.id, -1)}><Minus className="h-3 w-3" /></Button>
                              <span className="text-sm font-bold w-5 text-center">{inCart.quantity}</span>
                              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(med.id, 1)}><Plus className="h-3 w-3" /></Button>
                            </div>
                          ) : (
                            <Button size="sm" className="gap-1" onClick={() => addToCart(med)}><Plus className="h-3 w-3" /> Add</Button>
                          )) : <Button size="sm" variant="outline" disabled>Unavailable</Button>}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
        {filtered.length === 0 && !isLoading && <div className="text-center py-12 text-muted-foreground"><Package className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No medicines found</p></div>}
      </div>

      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Shopping Cart ({cartCount})</DialogTitle><DialogDescription>Review your items</DialogDescription></DialogHeader>
          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground"><ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30" /><p className="text-sm font-medium">Cart is empty</p></div>
          ) : (
            <div className="space-y-3 py-2">
              {cart.map((item) => (
                <div key={item.medicine.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{item.medicine.name}</p><p className="text-[10px] text-muted-foreground">${Number(item.medicine.price).toFixed(2)} each</p></div>
                  <div className="flex items-center gap-1.5">
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.medicine.id, -1)}><Minus className="h-3 w-3" /></Button>
                    <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.medicine.id, 1)}><Plus className="h-3 w-3" /></Button>
                    <button onClick={() => removeFromCart(item.medicine.id)} className="ml-1 text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-base"><span className="font-bold">Total</span><span className="font-extrabold text-primary">${cartTotal.toFixed(2)}</span></div>
            </div>
          )}
          {cart.length > 0 && <DialogFooter>
            <Button variant="outline" onClick={() => setShowCart(false)}>Continue Shopping</Button>
            <Button className="gap-1" onClick={() => { setShowCart(false); setShowCheckout(true); }}><CreditCard className="h-4 w-4" /> Checkout</Button>
          </DialogFooter>}
        </DialogContent>
      </Dialog>

      <Dialog open={showCheckout} onOpenChange={(open) => { if (!open) resetOrder(); }}>
        <DialogContent className="sm:max-w-md">
          {!orderPlaced ? (
            <>
              <DialogHeader><DialogTitle>Checkout</DialogTitle><DialogDescription>Confirm your order of ${cartTotal.toFixed(2)}</DialogDescription></DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCheckout(false)}>Cancel</Button>
                <Button onClick={placeOrder} disabled={createOrder.isPending}>{createOrder.isPending ? "Placing..." : "Place Order"}</Button>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto"><Package className="h-8 w-8 text-success" /></div>
              <h3 className="text-lg font-bold">Order Placed!</h3>
              <p className="text-sm text-muted-foreground">Your order is being processed</p>
              <Button onClick={resetOrder}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
