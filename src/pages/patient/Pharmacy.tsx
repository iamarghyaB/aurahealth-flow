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
  Video, Upload, User, Pill, Bot, ShoppingCart, Plus, Minus,
  Truck, Clock, CheckCircle2, Package, CreditCard, MapPin,
  X, Star, Shield, Trash2, Heart,
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

interface Medicine {
  id: number;
  name: string;
  generic: string;
  category: string;
  dosage: string;
  form: string;
  price: number;
  inStock: boolean;
  prescriptionRequired: boolean;
  manufacturer: string;
  rating: number;
  description: string;
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

const medicines: Medicine[] = [
  { id: 1, name: "Atorvastatin", generic: "Atorvastatin Calcium", category: "Cardiovascular", dosage: "20mg", form: "Tablet", price: 12.99, inStock: true, prescriptionRequired: true, manufacturer: "Pfizer", rating: 4.8, description: "Used to lower cholesterol and reduce the risk of heart disease." },
  { id: 2, name: "Cetirizine", generic: "Cetirizine Hydrochloride", category: "Allergy", dosage: "10mg", form: "Tablet", price: 8.49, inStock: true, prescriptionRequired: false, manufacturer: "Johnson & Johnson", rating: 4.6, description: "Antihistamine for relief of allergy symptoms including sneezing, runny nose, and itchy eyes." },
  { id: 3, name: "Sumatriptan", generic: "Sumatriptan Succinate", category: "Neurology", dosage: "50mg", form: "Tablet", price: 24.99, inStock: true, prescriptionRequired: true, manufacturer: "GlaxoSmithKline", rating: 4.7, description: "Treats acute migraine headaches with or without aura in adults." },
  { id: 4, name: "Ferrous Sulfate", generic: "Iron Supplement", category: "Supplements", dosage: "325mg", form: "Tablet", price: 6.99, inStock: true, prescriptionRequired: false, manufacturer: "Nature Made", rating: 4.4, description: "Iron supplement for the treatment and prevention of iron deficiency anemia." },
  { id: 5, name: "Vitamin D3", generic: "Cholecalciferol", category: "Supplements", dosage: "2000 IU", form: "Softgel", price: 9.99, inStock: true, prescriptionRequired: false, manufacturer: "Nature's Bounty", rating: 4.7, description: "Supports bone health, immune function, and calcium absorption." },
  { id: 6, name: "Omega-3 Fish Oil", generic: "EPA/DHA", category: "Supplements", dosage: "1000mg", form: "Softgel", price: 14.99, inStock: true, prescriptionRequired: false, manufacturer: "Nordic Naturals", rating: 4.8, description: "Supports heart and brain health with essential fatty acids." },
  { id: 7, name: "Hydrocortisone Cream", generic: "Hydrocortisone 1%", category: "Dermatology", dosage: "1%", form: "Cream", price: 7.49, inStock: true, prescriptionRequired: false, manufacturer: "Cortizone", rating: 4.5, description: "Topical corticosteroid for temporary relief of itching and rashes." },
  { id: 8, name: "Magnesium Glycinate", generic: "Magnesium", category: "Supplements", dosage: "400mg", form: "Capsule", price: 11.99, inStock: true, prescriptionRequired: false, manufacturer: "Doctor's Best", rating: 4.6, description: "Highly absorbable magnesium for muscle relaxation and migraine prevention." },
  { id: 9, name: "Amoxicillin", generic: "Amoxicillin Trihydrate", category: "Antibiotics", dosage: "500mg", form: "Capsule", price: 15.99, inStock: false, prescriptionRequired: true, manufacturer: "Teva", rating: 4.5, description: "Broad-spectrum antibiotic for bacterial infections." },
  { id: 10, name: "Guaifenesin", generic: "Guaifenesin", category: "Respiratory", dosage: "400mg", form: "Tablet", price: 5.99, inStock: true, prescriptionRequired: false, manufacturer: "Mucinex", rating: 4.3, description: "Expectorant that helps loosen and thin mucus in the airways." },
  { id: 11, name: "Lisinopril", generic: "Lisinopril", category: "Cardiovascular", dosage: "10mg", form: "Tablet", price: 10.49, inStock: true, prescriptionRequired: true, manufacturer: "Merck", rating: 4.6, description: "ACE inhibitor used to treat high blood pressure and heart failure." },
  { id: 12, name: "Cetaphil Moisturizer", generic: "Moisturizing Lotion", category: "Skincare", dosage: "500ml", form: "Lotion", price: 13.99, inStock: true, prescriptionRequired: false, manufacturer: "Cetaphil", rating: 4.9, description: "Gentle, fragrance-free moisturizer for dry and sensitive skin." },
];

const prescriptionMeds = [
  { rxId: "MF-RX-00001", doctor: "Dr. Sarah Johnson", medicines: ["Atorvastatin", "Omega-3 Fish Oil"], date: "Feb 12, 2026" },
  { rxId: "MF-RX-00002", doctor: "Dr. Michael Chen", medicines: ["Hydrocortisone Cream", "Cetirizine", "Cetaphil Moisturizer"], date: "Jan 28, 2026" },
  { rxId: "MF-RX-00003", doctor: "Dr. Emily Davis", medicines: ["Ferrous Sulfate", "Vitamin D3"], date: "Jan 10, 2026" },
  { rxId: "MF-RX-00004", doctor: "Dr. Robert Kim", medicines: ["Sumatriptan", "Magnesium Glycinate"], date: "Nov 18, 2025" },
];

const categories = ["All", "Cardiovascular", "Allergy", "Neurology", "Supplements", "Dermatology", "Antibiotics", "Respiratory", "Skincare"];

export default function Pharmacy() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showRxOrder, setShowRxOrder] = useState(false);
  const [selectedRx, setSelectedRx] = useState<typeof prescriptionMeds[0] | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filtered = medicines.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.generic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = category === "All" || m.category === category;
    return matchSearch && matchCategory;
  });

  const addToCart = (medicine: Medicine) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.medicine.id === medicine.id);
      if (existing) return prev.map((c) => c.medicine.id === medicine.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { medicine, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => prev.map((c) => c.medicine.id === id ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c).filter((c) => c.quantity > 0));
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((c) => c.medicine.id !== id));

  const cartTotal = cart.reduce((sum, c) => sum + c.medicine.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const addRxToCart = (rx: typeof prescriptionMeds[0]) => {
    rx.medicines.forEach((name) => {
      const med = medicines.find((m) => m.name === name);
      if (med && med.inStock) addToCart(med);
    });
    setShowRxOrder(false);
    setSelectedRx(null);
  };

  const placeOrder = () => {
    setOrderPlaced(true);
  };

  const resetOrder = () => {
    setCart([]);
    setOrderPlaced(false);
    setShowCheckout(false);
  };

  return (
    <DashboardLayout navItems={navItems} role="Patient" userName="Alex Thompson">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Pharmacy</h1>
            <p className="text-muted-foreground">Order medicines and health products</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1" onClick={() => setShowRxOrder(true)}>
              <FileText className="h-4 w-4" /> Order from Prescription
            </Button>
            <Button variant="outline" className="gap-1 relative" onClick={() => setShowCart(true)}>
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search medicines by name or category..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        {/* Medicine Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((med, i) => {
              const inCart = cart.find((c) => c.medicine.id === med.id);
              return (
                <motion.div key={med.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className={cn("h-full flex flex-col hover:shadow-md transition-all", !med.inStock && "opacity-60")}>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Pill className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex gap-1">
                          {med.prescriptionRequired && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-warning/30 text-warning">Rx Required</Badge>
                          )}
                          {!med.inStock && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-destructive/30 text-destructive">Out of Stock</Badge>
                          )}
                        </div>
                      </div>

                      <h3 className="font-bold text-sm">{med.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{med.generic}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">{med.description}</p>

                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{med.dosage}</Badge>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{med.form}</Badge>
                        <span className="flex items-center gap-0.5 ml-auto">
                          <Star className="h-3 w-3 text-warning fill-warning" />{med.rating}
                        </span>
                      </div>

                      <Separator className="my-3" />

                      <div className="flex items-center justify-between">
                        <p className="text-lg font-extrabold text-primary">${med.price.toFixed(2)}</p>
                        {med.inStock ? (
                          inCart ? (
                            <div className="flex items-center gap-2">
                              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(med.id, -1)}>
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-bold w-5 text-center">{inCart.quantity}</span>
                              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(med.id, 1)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" className="gap-1" onClick={() => addToCart(med)}>
                              <Plus className="h-3 w-3" /> Add
                            </Button>
                          )
                        ) : (
                          <Button size="sm" variant="outline" disabled>Unavailable</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No medicines found</p>
            <p className="text-sm">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shopping Cart ({cartCount})</DialogTitle>
            <DialogDescription>Review your items before checkout</DialogDescription>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              {cart.map((item) => (
                <div key={item.medicine.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Pill className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.medicine.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.medicine.dosage} · ${item.medicine.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.medicine.id, -1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.medicine.id, 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                    <button onClick={() => removeFromCart(item.medicine.id)} className="ml-1 text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">${cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="font-medium text-success">Free</span></div>
                <Separator />
                <div className="flex justify-between text-base"><span className="font-bold">Total</span><span className="font-extrabold text-primary">${cartTotal.toFixed(2)}</span></div>
              </div>
            </div>
          )}

          {cart.length > 0 && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCart(false)}>Continue Shopping</Button>
              <Button className="gap-1" onClick={() => { setShowCart(false); setShowCheckout(true); }}>
                <CreditCard className="h-4 w-4" /> Checkout
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={(open) => { if (!open) resetOrder(); }}>
        <DialogContent className="sm:max-w-md">
          {!orderPlaced ? (
            <>
              <DialogHeader>
                <DialogTitle>Checkout</DialogTitle>
                <DialogDescription>Confirm your order details</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="p-3 bg-muted rounded-xl space-y-2">
                  <h4 className="text-sm font-semibold">Delivery Address</h4>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>123 Health Street, Apt 4B, Medical City, MC 10001</span>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-xl space-y-2">
                  <h4 className="text-sm font-semibold">Estimated Delivery</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>2-3 business days (Free delivery)</span>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-xl space-y-2">
                  <h4 className="text-sm font-semibold">Order Summary</h4>
                  {cart.map((item) => (
                    <div key={item.medicine.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.medicine.name} × {item.quantity}</span>
                      <span className="font-medium">${(item.medicine.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">Total</span>
                    <span className="font-extrabold text-primary">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {cart.some((c) => c.medicine.prescriptionRequired) && (
                  <div className="p-3 rounded-xl bg-warning/5 border border-warning/20 flex items-start gap-2">
                    <Shield className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Some items require a valid prescription. Your prescriptions on file will be verified before dispensing.
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setShowCheckout(false); setShowCart(true); }}>Back to Cart</Button>
                <Button className="gap-1" onClick={placeOrder}>
                  <CreditCard className="h-4 w-4" /> Place Order – ${cartTotal.toFixed(2)}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Order Placed!</h3>
                <p className="text-sm text-muted-foreground mt-1">Order #MF-ORD-{String(Date.now()).slice(-6)}</p>
                <p className="text-sm text-muted-foreground mt-1">Estimated delivery: 2-3 business days</p>
              </div>
              <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>You'll receive tracking details via email</span>
              </div>
              <Button onClick={resetOrder}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Prescription Order Dialog */}
      <Dialog open={showRxOrder} onOpenChange={setShowRxOrder}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order from Prescription</DialogTitle>
            <DialogDescription>Select a prescription to add all medications to your cart</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {prescriptionMeds.map((rx) => (
              <Card
                key={rx.rxId}
                className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
                onClick={() => addRxToCart(rx)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{rx.rxId}</p>
                      <p className="text-xs text-muted-foreground">{rx.doctor} · {rx.date}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rx.medicines.map((m) => (
                          <Badge key={m} variant="secondary" className="text-[10px] px-1.5 py-0">{m}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1 shrink-0">
                      <Plus className="h-3 w-3" /> Add All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRxOrder(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
