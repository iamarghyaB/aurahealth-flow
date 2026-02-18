import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { patientNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctors, useCreateAppointment } from "@/hooks/useSupabaseData";
import {
  Search, Calendar as CalendarIcon, Star, MapPin, Clock, Filter, X, User, Video,
} from "lucide-react";
import { motion } from "framer-motion";

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

export default function FindDoctors() {
  const { user, profile } = useAuth();
  const { data: doctors = [], isLoading } = useDoctors();
  const createAppointment = useCreateAppointment();

  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  const [bookingDoctor, setBookingDoctor] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState<Date>();
  const [bookingTime, setBookingTime] = useState("");
  const [bookingType, setBookingType] = useState("In-Person");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const specialties = ["All Specialties", ...new Set(doctors.map((d: any) => d.specialty).filter(Boolean))];

  const filtered = doctors
    .filter((d: any) => {
      const matchesSearch = (d.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.specialty || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.tags || []).some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSpecialty = specialty === "All Specialties" || d.specialty === specialty;
      const matchesAvailability = availability === "all" || (availability === "available" && d.available);
      return matchesSearch && matchesSpecialty && matchesAvailability;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "experience") return (b.experience_years || 0) - (a.experience_years || 0);
      if (sortBy === "fee-low") return (a.fee || 0) - (b.fee || 0);
      if (sortBy === "fee-high") return (b.fee || 0) - (a.fee || 0);
      return (b.reviews_count || 0) - (a.reviews_count || 0);
    });

  const openBooking = (doctor: any) => {
    setBookingDoctor(doctor);
    setBookingDate(undefined);
    setBookingTime("");
    setBookingType("In-Person");
    setBookingConfirmed(false);
  };

  const confirmBooking = async () => {
    if (!bookingDoctor || !bookingDate || !bookingTime || !user) return;
    await createAppointment.mutateAsync({
      patient_id: user.id,
      doctor_id: bookingDoctor.id,
      date: format(bookingDate, "yyyy-MM-dd"),
      time: bookingTime,
      type: bookingType,
      status: "Pending",
      fee: bookingDoctor.fee || 0,
    });
    setBookingConfirmed(true);
  };

  const closeBooking = () => {
    setBookingDoctor(null);
    setBookingConfirmed(false);
  };

  const displayName = profile?.full_name || "Patient";

  return (
    <DashboardLayout navItems={patientNavItems} role="Patient" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-extrabold">Find Doctors</h1>
          <p className="text-muted-foreground">Search and book appointments with top specialists</p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, specialty, or condition..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <Filter className="h-4 w-4" /><span className="hidden sm:inline">Filters</span>
            </Button>
          </div>

          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-wrap gap-3 p-4 bg-card rounded-xl border border-border">
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Specialty" /></SelectTrigger>
                <SelectContent>{specialties.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Availability" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  <SelectItem value="available">Available Today</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="fee-low">Fee: Low to High</SelectItem>
                  <SelectItem value="fee-high">Fee: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}
          <p className="text-sm text-muted-foreground">{filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading doctors...</div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((doctor: any, i: number) => (
              <motion.div key={doctor.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:shadow-md hover:border-primary/20 transition-all">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <Link to={`/patient/doctors/${doctor.id}`} className="h-14 w-14 rounded-2xl shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {doctor.avatar_url ? <img src={doctor.avatar_url} alt={doctor.name} className="h-full w-full object-cover" /> : (doctor.name || "?").charAt(0)}
                      </Link>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link to={`/patient/doctors/${doctor.id}`} className="font-bold text-base hover:text-primary transition-colors">{doctor.name}</Link>
                          {doctor.available && <Badge variant="default" className="bg-success text-success-foreground text-[10px] px-1.5 py-0">Available</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{doctor.specialty} · {doctor.experience_years} yrs experience</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                            <span className="font-semibold text-foreground">{Number(doctor.rating || 0).toFixed(1)}</span>
                            <span>({doctor.reviews_count || 0})</span>
                          </span>
                          {doctor.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{doctor.location}</span>}
                        </div>
                        {doctor.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {doctor.tags.map((tag: string) => <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0">{tag}</Badge>)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0 sm:text-right">
                        <p className="text-xl font-extrabold text-primary">${Number(doctor.fee || 0).toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">per consultation</p>
                        {doctor.next_slot && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{doctor.next_slot}</div>}
                        <Button size="sm" onClick={() => openBooking(doctor)} className="mt-1">Book Appointment</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {filtered.length === 0 && !isLoading && (
              <div className="text-center py-16 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No doctors found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={!!bookingDoctor} onOpenChange={(open) => !open && closeBooking()}>
        <DialogContent className="sm:max-w-md">
          {bookingDoctor && !bookingConfirmed && (
            <>
              <DialogHeader>
                <DialogTitle>Book Appointment</DialogTitle>
                <DialogDescription>Schedule a visit with {bookingDoctor.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-2">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {(bookingDoctor.name || "?").charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{bookingDoctor.name}</p>
                    <p className="text-xs text-muted-foreground">{bookingDoctor.specialty} · ${Number(bookingDoctor.fee || 0).toFixed(0)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Consultation Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ value: "In-Person", label: "In-Person", icon: User }, { value: "Video", label: "Video Call", icon: Video }].map((opt) => (
                      <button key={opt.value} onClick={() => setBookingType(opt.value)} className={cn("flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all", bookingType === opt.value ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30")}>
                        <opt.icon className="h-4 w-4" />{opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !bookingDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />{bookingDate ? format(bookingDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={bookingDate} onSelect={setBookingDate} disabled={(date) => date < new Date()} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                {bookingDate && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button key={slot} onClick={() => setBookingTime(slot)} className={cn("p-2 rounded-lg border text-xs font-medium transition-all", bookingTime === slot ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/30")}>{slot}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeBooking}>Cancel</Button>
                <Button onClick={confirmBooking} disabled={!bookingDate || !bookingTime || createAppointment.isPending}>
                  {createAppointment.isPending ? "Booking..." : "Confirm Booking"}
                </Button>
              </DialogFooter>
            </>
          )}
          {bookingConfirmed && (
            <div className="text-center py-6 space-y-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <CalendarIcon className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Appointment Booked!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {bookingDoctor?.name} · {bookingDate && format(bookingDate, "PPP")} at {bookingTime}
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={closeBooking}>Close</Button>
                <Button asChild><Link to="/patient/appointments">View Appointments</Link></Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
