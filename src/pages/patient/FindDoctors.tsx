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
import {
  LayoutDashboard, Search, Calendar as CalendarIcon, FileText, MessageSquare,
  Video, Upload, User, Star, MapPin, Clock, Filter, X, Pill, Bot, Heart,
} from "lucide-react";
import { motion } from "framer-motion";

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

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  reviews: number;
  experience: number;
  fee: number;
  avatar: string;
  available: boolean;
  nextSlot: string;
  tags: string[];
}

const doctors: Doctor[] = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", location: "Downtown Clinic", rating: 4.9, reviews: 328, experience: 15, fee: 150, avatar: "SJ", available: true, nextSlot: "Today, 3:00 PM", tags: ["Heart", "ECG", "Hypertension"] },
  { id: 2, name: "Dr. Michael Chen", specialty: "Dermatologist", location: "Westside Medical", rating: 4.8, reviews: 256, experience: 12, fee: 120, avatar: "MC", available: true, nextSlot: "Today, 5:30 PM", tags: ["Skin", "Acne", "Allergies"] },
  { id: 3, name: "Dr. Emily Davis", specialty: "General Physician", location: "City Health Center", rating: 4.7, reviews: 412, experience: 10, fee: 80, avatar: "ED", available: true, nextSlot: "Tomorrow, 9:00 AM", tags: ["General", "Checkup", "Fever"] },
  { id: 4, name: "Dr. James Wilson", specialty: "Orthopedic", location: "Sports Medicine Hub", rating: 4.9, reviews: 189, experience: 20, fee: 200, avatar: "JW", available: false, nextSlot: "Feb 20, 10:00 AM", tags: ["Bones", "Joints", "Sports"] },
  { id: 5, name: "Dr. Priya Patel", specialty: "Pediatrician", location: "Kids Care Clinic", rating: 4.8, reviews: 534, experience: 8, fee: 100, avatar: "PP", available: true, nextSlot: "Today, 4:00 PM", tags: ["Children", "Vaccination", "Growth"] },
  { id: 6, name: "Dr. Robert Kim", specialty: "Neurologist", location: "Brain & Spine Center", rating: 4.6, reviews: 167, experience: 18, fee: 180, avatar: "RK", available: true, nextSlot: "Tomorrow, 11:00 AM", tags: ["Brain", "Migraine", "Nerves"] },
  { id: 7, name: "Dr. Lisa Thompson", specialty: "Cardiologist", location: "Heart Health Institute", rating: 4.7, reviews: 293, experience: 14, fee: 160, avatar: "LT", available: true, nextSlot: "Tomorrow, 2:00 PM", tags: ["Heart", "Cholesterol", "BP"] },
  { id: 8, name: "Dr. Ahmed Hassan", specialty: "General Physician", location: "Family Care Clinic", rating: 4.5, reviews: 378, experience: 11, fee: 70, avatar: "AH", available: false, nextSlot: "Feb 21, 9:30 AM", tags: ["General", "Diabetes", "Thyroid"] },
];

const specialties = ["All Specialties", "Cardiologist", "Dermatologist", "General Physician", "Orthopedic", "Pediatrician", "Neurologist"];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

export default function FindDoctors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  // Booking modal state
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState<Date>();
  const [bookingTime, setBookingTime] = useState("");
  const [bookingType, setBookingType] = useState("in-person");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const filtered = doctors
    .filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSpecialty = specialty === "All Specialties" || d.specialty === specialty;
      const matchesAvailability = availability === "all" || (availability === "available" && d.available);
      return matchesSearch && matchesSpecialty && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "experience") return b.experience - a.experience;
      if (sortBy === "fee-low") return a.fee - b.fee;
      if (sortBy === "fee-high") return b.fee - a.fee;
      return b.reviews - a.reviews;
    });

  const openBooking = (doctor: Doctor) => {
    setBookingDoctor(doctor);
    setBookingDate(undefined);
    setBookingTime("");
    setBookingType("in-person");
    setBookingConfirmed(false);
  };

  const confirmBooking = () => {
    setBookingConfirmed(true);
  };

  const closeBooking = () => {
    setBookingDoctor(null);
    setBookingConfirmed(false);
  };

  return (
    <DashboardLayout navItems={navItems} role="Patient" userName="Alex Thompson">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold">Find Doctors</h1>
          <p className="text-muted-foreground">Search and book appointments with top specialists</p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, specialty, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-3 p-4 bg-card rounded-xl border border-border"
            >
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  <SelectItem value="available">Available Today</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
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

        {/* Doctor Cards */}
        <div className="grid gap-4">
          {filtered.map((doctor, i) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-md hover:border-primary/20 transition-all">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Avatar */}
                    <Link to={`/patient/doctors/${doctor.id}`} className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0 hover:bg-primary/20 transition-colors">
                      {doctor.avatar}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link to={`/patient/doctors/${doctor.id}`} className="font-bold text-base hover:text-primary transition-colors">{doctor.name}</Link>
                        {doctor.available && (
                          <Badge variant="default" className="bg-success text-success-foreground text-[10px] px-1.5 py-0">Available</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{doctor.specialty} · {doctor.experience} yrs experience</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                          <span className="font-semibold text-foreground">{doctor.rating}</span>
                          <span>({doctor.reviews})</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {doctor.location}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {doctor.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0">{tag}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Booking Section */}
                    <div className="flex flex-col items-end gap-2 shrink-0 sm:text-right">
                      <p className="text-xl font-extrabold text-primary">${doctor.fee}</p>
                      <p className="text-xs text-muted-foreground">per consultation</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {doctor.nextSlot}
                      </div>
                      <Button size="sm" onClick={() => openBooking(doctor)} className="mt-1">
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No doctors found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={!!bookingDoctor} onOpenChange={(open) => !open && closeBooking()}>
        <DialogContent className="sm:max-w-md">
          {bookingDoctor && !bookingConfirmed && (
            <>
              <DialogHeader>
                <DialogTitle>Book Appointment</DialogTitle>
                <DialogDescription>
                  Schedule a visit with {bookingDoctor.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-2">
                {/* Doctor summary */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {bookingDoctor.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{bookingDoctor.name}</p>
                    <p className="text-xs text-muted-foreground">{bookingDoctor.specialty} · ${bookingDoctor.fee}</p>
                  </div>
                </div>

                {/* Consultation type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Consultation Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "in-person", label: "In-Person", icon: User },
                      { value: "video", label: "Video Call", icon: Video },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setBookingType(opt.value)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all",
                          bookingType === opt.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/30"
                        )}
                      >
                        <opt.icon className="h-4 w-4" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date picker */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !bookingDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingDate ? format(bookingDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={bookingDate}
                        onSelect={setBookingDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time slots */}
                {bookingDate && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setBookingTime(slot)}
                          className={cn(
                            "p-2 rounded-lg border text-xs font-medium transition-all",
                            bookingTime === slot
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
                <Button variant="outline" onClick={closeBooking}>Cancel</Button>
                <Button onClick={confirmBooking} disabled={!bookingDate || !bookingTime}>
                  Confirm Booking
                </Button>
              </DialogFooter>
            </>
          )}

          {bookingDoctor && bookingConfirmed && (
            <div className="text-center py-6 space-y-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-success" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Appointment Booked!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {bookingDoctor.name} · {bookingType === "video" ? "Video Call" : "In-Person"}
                </p>
                <p className="text-sm font-medium mt-2">
                  {bookingDate && format(bookingDate, "EEEE, MMMM d, yyyy")} at {bookingTime}
                </p>
              </div>
              <Button onClick={closeBooking} className="mt-2">Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
