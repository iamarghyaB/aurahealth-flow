import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Search, Calendar as CalendarIcon, FileText, MessageSquare,
  Video, Upload, User, Clock, MapPin, Plus, Pill, Bot, RotateCcw, X as XIcon,
  CheckCircle2, AlertCircle, Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { title: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { title: "Find Doctors", href: "/patient/doctors", icon: Search },
  { title: "Appointments", href: "/patient/appointments", icon: CalendarIcon },
  { title: "Consultations", href: "/patient/consultations", icon: Video },
  { title: "Messages", href: "/patient/messages", icon: MessageSquare },
  { title: "Health Records", href: "/patient/records", icon: FileText },
  { title: "Lab Reports", href: "/patient/lab-reports", icon: Upload },
  { title: "Prescriptions", href: "/patient/prescriptions", icon: Pill },
  { title: "Pharmacy", href: "/patient/pharmacy", icon: Pill },
  { title: "AI Symptom Checker", href: "/patient/symptom-checker", icon: Bot },
  { title: "Profile", href: "/patient/profile", icon: User },
];

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  location: string;
  date: Date;
  time: string;
  type: "In-Person" | "Video";
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  avatar: string;
  fee: number;
}

const initialAppointments: Appointment[] = [
  { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", location: "Downtown Clinic", date: new Date(2026, 1, 18), time: "10:00 AM", type: "In-Person", status: "Confirmed", avatar: "SJ", fee: 150 },
  { id: 2, doctor: "Dr. Michael Chen", specialty: "Dermatologist", location: "Westside Medical", date: new Date(2026, 1, 20), time: "2:30 PM", type: "Video", status: "Pending", avatar: "MC", fee: 120 },
  { id: 3, doctor: "Dr. Emily Davis", specialty: "General Physician", location: "City Health Center", date: new Date(2026, 1, 25), time: "9:00 AM", type: "In-Person", status: "Confirmed", avatar: "ED", fee: 80 },
  { id: 4, doctor: "Dr. Priya Patel", specialty: "Pediatrician", location: "Kids Care Clinic", date: new Date(2026, 1, 17), time: "3:00 PM", type: "Video", status: "Completed", avatar: "PP", fee: 100 },
  { id: 5, doctor: "Dr. Robert Kim", specialty: "Neurologist", location: "Brain & Spine Center", date: new Date(2026, 1, 10), time: "11:00 AM", type: "In-Person", status: "Completed", avatar: "RK", fee: 180 },
  { id: 6, doctor: "Dr. James Wilson", specialty: "Orthopedic", location: "Sports Medicine Hub", date: new Date(2026, 1, 5), time: "10:30 AM", type: "In-Person", status: "Cancelled", avatar: "JW", fee: 200 },
  { id: 7, doctor: "Dr. Lisa Thompson", specialty: "Cardiologist", location: "Heart Health Institute", date: new Date(2026, 2, 3), time: "2:00 PM", type: "In-Person", status: "Confirmed", avatar: "LT", fee: 160 },
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  Confirmed: { color: "bg-success text-success-foreground", icon: CheckCircle2 },
  Pending: { color: "bg-warning text-warning-foreground", icon: AlertCircle },
  Completed: { color: "bg-muted text-muted-foreground", icon: CheckCircle2 },
  Cancelled: { color: "bg-destructive/10 text-destructive", icon: XIcon },
};

export default function Appointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 1, 17));
  const [tab, setTab] = useState("upcoming");

  // Reschedule state
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<Date>();
  const [newTime, setNewTime] = useState("");
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  // Cancel state
  const [cancelApt, setCancelApt] = useState<Appointment | null>(null);

  const now = new Date(2026, 1, 17);

  const upcoming = appointments.filter((a) => a.date >= now && a.status !== "Cancelled" && a.status !== "Completed");
  const past = appointments.filter((a) => a.status === "Completed");
  const cancelled = appointments.filter((a) => a.status === "Cancelled");

  const displayedList = tab === "upcoming" ? upcoming : tab === "past" ? past : cancelled;
  const appointmentsOnDate = appointments.filter((a) => isSameDay(a.date, selectedDate) && a.status !== "Cancelled");
  const datesWithAppointments = appointments.filter((a) => a.status !== "Cancelled").map((a) => a.date);

  const handleReschedule = () => {
    if (!rescheduleApt || !newDate || !newTime) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === rescheduleApt.id ? { ...a, date: newDate, time: newTime, status: "Pending" as const } : a
      )
    );
    setRescheduleSuccess(true);
  };

  const closeReschedule = () => {
    setRescheduleApt(null);
    setNewDate(undefined);
    setNewTime("");
    setRescheduleSuccess(false);
  };

  const handleCancel = () => {
    if (!cancelApt) return;
    setAppointments((prev) =>
      prev.map((a) => (a.id === cancelApt.id ? { ...a, status: "Cancelled" as const } : a))
    );
    setCancelApt(null);
  };

  const AppointmentCard = ({ apt }: { apt: Appointment }) => {
    const config = statusConfig[apt.status];
    const isActionable = apt.status === "Confirmed" || apt.status === "Pending";

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
      >
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                {apt.avatar}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm">{apt.doctor}</h3>
                  <Badge className={cn("text-[10px] px-1.5 py-0", config.color)}>
                    {apt.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {format(apt.date, "MMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {apt.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {apt.location}
                  </span>
                  <Badge variant={apt.type === "Video" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                    {apt.type === "Video" ? <Video className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                    {apt.type}
                  </Badge>
                </div>
              </div>

              {isActionable && (
                <div className="flex items-center gap-2 shrink-0">
                  {apt.type === "Video" && apt.status === "Confirmed" && (
                    <Button size="sm" variant="default" className="gap-1">
                      <Phone className="h-3 w-3" /> Join
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => {
                    setRescheduleApt(apt);
                    setRescheduleSuccess(false);
                    setNewDate(undefined);
                    setNewTime("");
                  }}>
                    <RotateCcw className="h-3 w-3" /> Reschedule
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-destructive hover:text-destructive" onClick={() => setCancelApt(apt)}>
                    <XIcon className="h-3 w-3" /> Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <DashboardLayout navItems={navItems} role="Patient" userName="Alex Thompson">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Appointments</h1>
            <p className="text-muted-foreground">Manage your upcoming and past appointments</p>
          </div>
          <Button asChild>
            <Link to="/patient/doctors"><Plus className="h-4 w-4 mr-1" /> Book New</Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          {/* Calendar sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  className="p-0 pointer-events-auto"
                  modifiers={{ hasAppointment: datesWithAppointments }}
                  modifiersClassNames={{ hasAppointment: "bg-primary/10 font-bold text-primary" }}
                />
              </CardContent>
            </Card>

            {/* Day detail */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  {format(selectedDate, "EEEE, MMMM d")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {appointmentsOnDate.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">No appointments this day</p>
                ) : (
                  appointmentsOnDate.map((apt) => (
                    <div key={apt.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {apt.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{apt.doctor}</p>
                        <p className="text-[10px] text-muted-foreground">{apt.time} · {apt.type}</p>
                      </div>
                      <Badge className={cn("text-[10px] px-1.5 py-0", statusConfig[apt.status].color)}>
                        {apt.status}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Upcoming", value: upcoming.length, color: "text-primary" },
                { label: "Completed", value: past.length, color: "text-success" },
                { label: "Cancelled", value: cancelled.length, color: "text-destructive" },
              ].map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-3 text-center">
                    <p className={cn("text-xl font-extrabold", stat.color)}>{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Appointment list */}
          <div className="space-y-4">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
                <TabsTrigger value="past">Completed ({past.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({cancelled.length})</TabsTrigger>
              </TabsList>

              <TabsContent value={tab} className="mt-4">
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {displayedList.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="font-semibold">No {tab} appointments</p>
                        {tab === "upcoming" && (
                          <Button variant="link" asChild className="mt-2">
                            <Link to="/patient/doctors">Find a doctor</Link>
                          </Button>
                        )}
                      </div>
                    ) : (
                      displayedList
                        .sort((a, b) => (tab === "upcoming" ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime()))
                        .map((apt) => <AppointmentCard key={apt.id} apt={apt} />)
                    )}
                  </AnimatePresence>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={!!rescheduleApt} onOpenChange={(open) => !open && closeReschedule()}>
        <DialogContent className="sm:max-w-md">
          {rescheduleApt && !rescheduleSuccess && (
            <>
              <DialogHeader>
                <DialogTitle>Reschedule Appointment</DialogTitle>
                <DialogDescription>
                  Choose a new date and time for your appointment with {rescheduleApt.doctor}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-2">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {rescheduleApt.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{rescheduleApt.doctor}</p>
                    <p className="text-xs text-muted-foreground">
                      Currently: {format(rescheduleApt.date, "MMM d, yyyy")} at {rescheduleApt.time}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">New Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !newDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newDate ? format(newDate, "PPP") : "Pick a new date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newDate}
                        onSelect={setNewDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {newDate && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setNewTime(slot)}
                          className={cn(
                            "p-2 rounded-lg border text-xs font-medium transition-all",
                            newTime === slot
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground hover:border-primary/30"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeReschedule}>Cancel</Button>
                <Button onClick={handleReschedule} disabled={!newDate || !newTime}>
                  Confirm Reschedule
                </Button>
              </DialogFooter>
            </>
          )}

          {rescheduleApt && rescheduleSuccess && (
            <div className="text-center py-6 space-y-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Rescheduled!</h3>
                <p className="text-sm text-muted-foreground mt-1">{rescheduleApt.doctor}</p>
                <p className="text-sm font-medium mt-2">
                  {newDate && format(newDate, "EEEE, MMMM d, yyyy")} at {newTime}
                </p>
              </div>
              <Button onClick={closeReschedule}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation */}
      <AlertDialog open={!!cancelApt} onOpenChange={(open) => !open && setCancelApt(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              {cancelApt && (
                <>
                  Are you sure you want to cancel your appointment with <strong>{cancelApt.doctor}</strong> on{" "}
                  <strong>{format(cancelApt.date, "MMM d, yyyy")}</strong> at <strong>{cancelApt.time}</strong>?
                  This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
