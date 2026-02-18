import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { patientNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctorById, useCreateAppointment } from "@/hooks/useSupabaseData";
import {
  Calendar as CalendarIcon, Star, MapPin, Clock, ChevronLeft, User, Video, MessageCircle, Phone,
} from "lucide-react";

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const { data: doctor, isLoading } = useDoctorById(id);
  const createAppointment = useCreateAppointment();

  const [bookingDate, setBookingDate] = useState<Date>();
  const [bookingTime, setBookingTime] = useState("");
  const [bookingType, setBookingType] = useState("In-Person");
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmBooking = async () => {
    if (!doctor || !bookingDate || !bookingTime || !user) return;
    await createAppointment.mutateAsync({
      patient_id: user.id,
      doctor_id: doctor.id,
      date: format(bookingDate, "yyyy-MM-dd"),
      time: bookingTime,
      type: bookingType,
      status: "Pending",
      fee: doctor.fee || 0,
    });
    setShowConfirm(true);
  };

  const displayName = profile?.full_name || "Patient";

  if (isLoading) return <DashboardLayout navItems={patientNavItems} role="Patient" userName={displayName}><div className="text-center py-12 text-muted-foreground">Loading...</div></DashboardLayout>;
  if (!doctor) return <DashboardLayout navItems={patientNavItems} role="Patient" userName={displayName}><div className="text-center py-12 text-muted-foreground">Doctor not found</div></DashboardLayout>;

  return (
    <DashboardLayout navItems={patientNavItems} role="Patient" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" asChild className="gap-1 -ml-2 text-muted-foreground">
          <Link to="/patient/doctors"><ChevronLeft className="h-4 w-4" /> Back to Doctors</Link>
        </Button>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="h-28 w-28 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-extrabold text-3xl shrink-0">
                {doctor.avatar_url ? <img src={doctor.avatar_url} alt={doctor.name} className="h-full w-full object-cover rounded-2xl" /> : (doctor.name || "?").charAt(0)}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-extrabold">{doctor.name}</h1>
                      {doctor.available && <Badge className="bg-success text-success-foreground">Available Today</Badge>}
                    </div>
                    <p className="text-muted-foreground">{doctor.specialty} · {doctor.experience_years} years experience</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-primary">${Number(doctor.fee || 0).toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">per consultation</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 text-warning fill-warning" /><span className="font-bold text-foreground">{Number(doctor.rating || 0).toFixed(1)}</span> ({doctor.reviews_count || 0} reviews)</span>
                  {doctor.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{doctor.location}</span>}
                </div>
                {doctor.tags?.length > 0 && <div className="flex flex-wrap gap-1.5">{doctor.tags.map((t: string) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div>}
                {doctor.bio && <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">About</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{doctor.bio || "No biography available."}</p>
            </CardContent>
          </Card>

          <div id="booking-section" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Book Appointment</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ value: "In-Person", icon: User }, { value: "Video", icon: Video }].map((opt) => (
                      <button key={opt.value} onClick={() => setBookingType(opt.value)} className={cn("flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all", bookingType === opt.value ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground")}>
                        <opt.icon className="h-4 w-4" />{opt.value}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Calendar mode="single" selected={bookingDate} onSelect={setBookingDate} disabled={(date) => date < new Date()} className="p-0 pointer-events-auto" />
                </div>
                {bookingDate && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button key={slot} onClick={() => setBookingTime(slot)} className={cn("p-2 rounded-lg border text-xs font-medium transition-all", bookingTime === slot ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground")}>{slot}</button>
                      ))}
                    </div>
                  </div>
                )}
                <Button className="w-full" onClick={confirmBooking} disabled={!bookingDate || !bookingTime || createAppointment.isPending}>
                  {createAppointment.isPending ? "Booking..." : "Confirm Booking"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6 space-y-4">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto"><CalendarIcon className="h-8 w-8 text-success" /></div>
            <h3 className="text-lg font-bold">Appointment Booked!</h3>
            <p className="text-sm text-muted-foreground">{doctor?.name} · {bookingDate && format(bookingDate, "PPP")} at {bookingTime}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Close</Button>
              <Button asChild><Link to="/patient/appointments">View Appointments</Link></Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
