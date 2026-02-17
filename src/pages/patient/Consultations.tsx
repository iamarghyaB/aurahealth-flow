import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Search, Calendar, FileText, MessageSquare, Video,
  Upload, User, Pill, Bot, Clock, Star, Phone, PhoneOff, Mic, MicOff,
  VideoOff, Monitor, Send, Maximize2, MessageCircle, CheckCircle2,
  AlertCircle, XCircle, Plus, Filter,
} from "lucide-react";

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

interface Consultation {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  duration: string;
  status: "Completed" | "In Progress" | "Upcoming" | "Cancelled" | "Missed";
  type: "Video" | "Audio";
  notes: string;
  rating?: number;
  prescription?: boolean;
  followUp?: string;
}

const consultations: Consultation[] = [
  { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", date: "Feb 17, 2026", time: "10:00 AM", duration: "30 min", status: "In Progress", type: "Video", notes: "Routine heart checkup", prescription: false },
  { id: 2, doctor: "Dr. Michael Chen", specialty: "Dermatologist", date: "Feb 18, 2026", time: "2:30 PM", duration: "20 min", status: "Upcoming", type: "Video", notes: "Skin rash follow-up" },
  { id: 3, doctor: "Dr. Emily Davis", specialty: "General Physician", date: "Feb 20, 2026", time: "9:00 AM", duration: "15 min", status: "Upcoming", type: "Audio", notes: "General health consultation" },
  { id: 4, doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", date: "Feb 10, 2026", time: "11:00 AM", duration: "25 min", status: "Completed", type: "Video", notes: "ECG results review", rating: 5, prescription: true, followUp: "Feb 17, 2026" },
  { id: 5, doctor: "Dr. James Wilson", specialty: "Orthopedic", date: "Feb 08, 2026", time: "3:00 PM", duration: "30 min", status: "Completed", type: "Video", notes: "Post-surgery follow-up", rating: 4, prescription: true },
  { id: 6, doctor: "Dr. Lisa Park", specialty: "Neurologist", date: "Feb 05, 2026", time: "10:30 AM", duration: "20 min", status: "Completed", type: "Audio", notes: "Migraine management", rating: 5, prescription: true },
  { id: 7, doctor: "Dr. Michael Chen", specialty: "Dermatologist", date: "Feb 03, 2026", time: "1:00 PM", duration: "15 min", status: "Missed", type: "Video", notes: "Acne treatment review" },
  { id: 8, doctor: "Dr. Emily Davis", specialty: "General Physician", date: "Jan 28, 2026", time: "4:00 PM", duration: "20 min", status: "Cancelled", type: "Audio", notes: "Annual physical" },
];

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  Completed: { color: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  "In Progress": { color: "bg-info/10 text-info border-info/20", icon: Video },
  Upcoming: { color: "bg-primary/10 text-primary border-primary/20", icon: Clock },
  Cancelled: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
  Missed: { color: "bg-warning/10 text-warning border-warning/20", icon: AlertCircle },
};

export default function Consultations() {
  const [tab, setTab] = useState("all");
  const [liveConsult, setLiveConsult] = useState<Consultation | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: "Dr. Sarah Johnson", text: "Hello Alex, how are you feeling today?", time: "10:01 AM" },
    { sender: "You", text: "Hi Doctor, I've been feeling much better since the last visit.", time: "10:02 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [detailConsult, setDetailConsult] = useState<Consultation | null>(null);

  const filtered = consultations.filter((c) => {
    if (tab === "all") return true;
    if (tab === "upcoming") return c.status === "Upcoming" || c.status === "In Progress";
    if (tab === "completed") return c.status === "Completed";
    if (tab === "missed") return c.status === "Missed" || c.status === "Cancelled";
    return true;
  });

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages((prev) => [...prev, { sender: "You", text: newMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setNewMessage("");
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { sender: liveConsult?.doctor || "Doctor", text: "Thank you for sharing that. Let me review your records.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 2000);
  };

  const ConsultCard = ({ consult }: { consult: Consultation }) => {
    const config = statusConfig[consult.status];
    const StatusIcon = config.icon;
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
        onClick={() => setDetailConsult(consult)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{consult.doctor}</p>
              <p className="text-xs text-muted-foreground">{consult.specialty}</p>
            </div>
          </div>
          <Badge variant="outline" className={`${config.color} text-xs flex-shrink-0`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {consult.status}
          </Badge>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{consult.date}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{consult.time}</span>
          <span className="flex items-center gap-1">{consult.type === "Video" ? <Video className="h-3 w-3" /> : <Phone className="h-3 w-3" />}{consult.type} · {consult.duration}</span>
        </div>

        <p className="mt-2 text-xs text-muted-foreground truncate">{consult.notes}</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {consult.rating && (
              <span className="flex items-center gap-0.5 text-xs text-warning">
                {Array.from({ length: consult.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </span>
            )}
            {consult.prescription && (
              <Badge variant="secondary" className="text-[10px] ml-2"><Pill className="h-2.5 w-2.5 mr-0.5" />Prescription</Badge>
            )}
          </div>
          {consult.status === "In Progress" && (
            <Button size="sm" onClick={(e) => { e.stopPropagation(); setLiveConsult(consult); }}>
              <Video className="h-3.5 w-3.5 mr-1" /> Join Now
            </Button>
          )}
          {consult.status === "Upcoming" && (
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setLiveConsult(consult); }}>
              <Video className="h-3.5 w-3.5 mr-1" /> Join
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  // Live consultation room
  if (liveConsult) {
    return (
      <DashboardLayout navItems={navItems} role="Patient" userName="Alex Thompson">
        <div className="h-[calc(100vh-5rem)] flex flex-col animate-fade-in">
          {/* Top bar */}
          <div className="flex items-center justify-between bg-card border border-border rounded-xl p-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{liveConsult.doctor}</p>
                <p className="text-xs text-muted-foreground">{liveConsult.specialty}</p>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 ml-2 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-success mr-1 animate-pulse-soft" />Live
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">00:12:34</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setChatOpen(!chatOpen)}>
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex gap-3 min-h-0">
            {/* Video area */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              <div className="flex-1 bg-foreground/5 rounded-xl relative overflow-hidden flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <p className="font-semibold">{liveConsult.doctor}</p>
                  <p className="text-xs text-muted-foreground">{liveConsult.specialty}</p>
                </div>
                {/* Self view */}
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-foreground/10 rounded-lg border border-border flex items-center justify-center">
                  {isVideoOff ? (
                    <VideoOff className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <div className="text-center">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">You</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 py-2">
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button
                  variant={isVideoOff ? "destructive" : "secondary"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>
                <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full">
                  <Monitor className="h-5 w-5" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setLiveConsult(null)}
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Chat sidebar */}
            <AnimatePresence>
              {chatOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="bg-card border border-border rounded-xl flex flex-col overflow-hidden"
                >
                  <div className="p-3 border-b border-border font-semibold text-sm">Chat</div>
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${msg.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1">{msg.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="min-h-[36px] h-9 text-xs resize-none"
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    />
                    <Button size="icon" className="h-9 w-9 flex-shrink-0" onClick={sendMessage}>
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} role="Patient" userName="Alex Thompson">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">Consultations</h1>
            <p className="text-muted-foreground text-sm">Manage your virtual consultations</p>
          </div>
          <Button asChild>
            <a href="/patient/doctors"><Plus className="h-4 w-4 mr-1" />New Consultation</a>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total", value: consultations.length, icon: Video, color: "text-primary" },
            { label: "Completed", value: consultations.filter((c) => c.status === "Completed").length, icon: CheckCircle2, color: "text-success" },
            { label: "Upcoming", value: consultations.filter((c) => c.status === "Upcoming" || c.status === "In Progress").length, icon: Clock, color: "text-info" },
            { label: "Missed", value: consultations.filter((c) => c.status === "Missed" || c.status === "Cancelled").length, icon: AlertCircle, color: "text-warning" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active consultation banner */}
        {consultations.some((c) => c.status === "In Progress") && (
          <Card className="border-info/30 bg-info/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                  <Video className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Active Consultation</p>
                  <p className="text-xs text-muted-foreground">
                    {consultations.find((c) => c.status === "In Progress")?.doctor} — {consultations.find((c) => c.status === "In Progress")?.notes}
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={() => setLiveConsult(consultations.find((c) => c.status === "In Progress")!)}>
                <Video className="h-3.5 w-3.5 mr-1" /> Rejoin
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="missed">Missed / Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-4">
            <div className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((c) => (
                  <ConsultCard key={c.id} consult={c} />
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Video className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No consultations found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Detail dialog */}
        <Dialog open={!!detailConsult} onOpenChange={(o) => !o && setDetailConsult(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Consultation Details</DialogTitle>
              <DialogDescription>Review consultation information</DialogDescription>
            </DialogHeader>
            {detailConsult && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{detailConsult.doctor}</p>
                    <p className="text-sm text-muted-foreground">{detailConsult.specialty}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-muted-foreground text-xs">Date</p><p className="font-medium">{detailConsult.date}</p></div>
                  <div><p className="text-muted-foreground text-xs">Time</p><p className="font-medium">{detailConsult.time}</p></div>
                  <div><p className="text-muted-foreground text-xs">Duration</p><p className="font-medium">{detailConsult.duration}</p></div>
                  <div><p className="text-muted-foreground text-xs">Type</p><p className="font-medium">{detailConsult.type}</p></div>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Notes</p>
                  <p className="text-sm">{detailConsult.notes}</p>
                </div>
                {detailConsult.rating && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Rating</p>
                    <div className="flex items-center gap-0.5 text-warning">
                      {Array.from({ length: detailConsult.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                )}
                {detailConsult.followUp && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Follow-up</p>
                    <p className="text-sm font-medium">{detailConsult.followUp}</p>
                  </div>
                )}
                {detailConsult.prescription && (
                  <Badge variant="secondary"><Pill className="h-3 w-3 mr-1" />Prescription issued</Badge>
                )}
              </div>
            )}
            <DialogFooter>
              {detailConsult?.status === "In Progress" && (
                <Button onClick={() => { setLiveConsult(detailConsult); setDetailConsult(null); }}>
                  <Video className="h-4 w-4 mr-1" /> Join Now
                </Button>
              )}
              {detailConsult?.status === "Upcoming" && (
                <Button variant="outline" onClick={() => { setLiveConsult(detailConsult!); setDetailConsult(null); }}>
                  <Video className="h-4 w-4 mr-1" /> Join
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
