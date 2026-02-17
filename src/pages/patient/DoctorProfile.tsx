import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  LayoutDashboard, Search, Calendar as CalendarIcon, FileText, MessageSquare,
  Video, Upload, User, Star, MapPin, Clock, Award, Heart, GraduationCap,
  Phone, MessageCircle, ChevronLeft, Pill, Bot, Shield, ThumbsUp,
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

const doctorsData: Record<string, {
  id: number; name: string; specialty: string; location: string; rating: number; reviews: number;
  experience: number; fee: number; avatar: string; available: boolean; bio: string;
  education: string[]; certifications: string[]; languages: string[]; tags: string[];
  patientsSeen: number; responseTime: string;
}> = {
  "1": { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", location: "Downtown Clinic, 123 Medical Ave", rating: 4.9, reviews: 328, experience: 15, fee: 150, avatar: "SJ", available: true, bio: "Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in diagnosing and treating cardiovascular diseases. She specializes in preventive cardiology, heart failure management, and interventional procedures. Her patient-centered approach has earned her recognition as one of the top cardiologists in the region.", education: ["MD, Harvard Medical School", "Residency, Johns Hopkins Hospital", "Fellowship in Cardiology, Mayo Clinic"], certifications: ["American Board of Internal Medicine", "Board Certified in Cardiovascular Disease", "Fellow of the American College of Cardiology"], languages: ["English", "Spanish"], tags: ["Heart", "ECG", "Hypertension", "Cholesterol", "Heart Failure"], patientsSeen: 4200, responseTime: "< 30 min" },
  "2": { id: 2, name: "Dr. Michael Chen", specialty: "Dermatologist", location: "Westside Medical, 456 Skin Care Blvd", rating: 4.8, reviews: 256, experience: 12, fee: 120, avatar: "MC", available: true, bio: "Dr. Michael Chen is a renowned dermatologist specializing in both medical and cosmetic dermatology. He has extensive experience treating skin conditions ranging from acne and eczema to skin cancer screening. Known for his gentle approach and thorough consultations.", education: ["MD, Stanford University", "Residency, UCSF Medical Center", "Fellowship in Dermatologic Surgery"], certifications: ["American Board of Dermatology", "Fellow of the American Academy of Dermatology"], languages: ["English", "Mandarin"], tags: ["Skin", "Acne", "Allergies", "Cosmetic", "Moles"], patientsSeen: 3100, responseTime: "< 1 hour" },
  "3": { id: 3, name: "Dr. Emily Davis", specialty: "General Physician", location: "City Health Center, 789 Wellness St", rating: 4.7, reviews: 412, experience: 10, fee: 80, avatar: "ED", available: true, bio: "Dr. Emily Davis is a compassionate general physician dedicated to providing comprehensive primary care for patients of all ages. She focuses on preventive medicine, chronic disease management, and patient education. Her holistic approach to healthcare emphasizes lifestyle modifications alongside medical treatment.", education: ["MD, Columbia University", "Residency, Mount Sinai Hospital"], certifications: ["American Board of Family Medicine", "Certified in Lifestyle Medicine"], languages: ["English", "French"], tags: ["General", "Checkup", "Fever", "Diabetes", "Preventive"], patientsSeen: 5600, responseTime: "< 45 min" },
  "4": { id: 4, name: "Dr. James Wilson", specialty: "Orthopedic", location: "Sports Medicine Hub, 321 Athletic Dr", rating: 4.9, reviews: 189, experience: 20, fee: 200, avatar: "JW", available: false, bio: "Dr. James Wilson is a leading orthopedic surgeon specializing in sports medicine and joint replacement. With 20 years of experience, he has helped thousands of athletes and active individuals return to their peak performance.", education: ["MD, Yale School of Medicine", "Residency, Hospital for Special Surgery", "Fellowship in Sports Medicine, Andrews Institute"], certifications: ["American Board of Orthopaedic Surgery", "Certificate of Added Qualification in Sports Medicine"], languages: ["English"], tags: ["Bones", "Joints", "Sports", "Knee", "Shoulder"], patientsSeen: 2800, responseTime: "< 2 hours" },
  "5": { id: 5, name: "Dr. Priya Patel", specialty: "Pediatrician", location: "Kids Care Clinic, 555 Children's Way", rating: 4.8, reviews: 534, experience: 8, fee: 100, avatar: "PP", available: true, bio: "Dr. Priya Patel is a pediatrician passionate about children's health and development. She provides expert care from newborn to adolescent stages, with special interest in childhood nutrition, developmental milestones, and immunization programs.", education: ["MD, University of Pennsylvania", "Residency, Children's Hospital of Philadelphia"], certifications: ["American Board of Pediatrics", "Certified in Pediatric Advanced Life Support"], languages: ["English", "Hindi", "Gujarati"], tags: ["Children", "Vaccination", "Growth", "Newborn", "Adolescent"], patientsSeen: 6200, responseTime: "< 20 min" },
  "6": { id: 6, name: "Dr. Robert Kim", specialty: "Neurologist", location: "Brain & Spine Center, 999 Neuro Plaza", rating: 4.6, reviews: 167, experience: 18, fee: 180, avatar: "RK", available: true, bio: "Dr. Robert Kim is a distinguished neurologist with expertise in diagnosing and treating disorders of the nervous system. He specializes in headache medicine, epilepsy management, and neurodegenerative diseases.", education: ["MD, Washington University", "Residency, Massachusetts General Hospital", "Fellowship in Clinical Neurophysiology, Cleveland Clinic"], certifications: ["American Board of Psychiatry and Neurology", "Board Certified in Clinical Neurophysiology"], languages: ["English", "Korean"], tags: ["Brain", "Migraine", "Nerves", "Epilepsy", "MS"], patientsSeen: 2100, responseTime: "< 1 hour" },
};

const reviewsData = [
  { id: 1, name: "John M.", rating: 5, date: "Feb 10, 2026", text: "Absolutely wonderful experience. The doctor was thorough, patient, and explained everything clearly. Highly recommend!", avatar: "JM" },
  { id: 2, name: "Sarah L.", rating: 5, date: "Feb 5, 2026", text: "Very knowledgeable and made me feel comfortable throughout the consultation. The staff was also very friendly.", avatar: "SL" },
  { id: 3, name: "David R.", rating: 4, date: "Jan 28, 2026", text: "Great doctor, but the wait time was a bit long. Otherwise excellent care and follow-up.", avatar: "DR" },
  { id: 4, name: "Maria G.", rating: 5, date: "Jan 20, 2026", text: "Best experience I've had. Took the time to listen to all my concerns and provided a comprehensive treatment plan.", avatar: "MG" },
  { id: 5, name: "Kevin T.", rating: 4, date: "Jan 15, 2026", text: "Professional and caring. Would definitely visit again for future appointments.", avatar: "KT" },
  { id: 6, name: "Amy W.", rating: 5, date: "Jan 8, 2026", text: "Exceeded my expectations. Very clean facility and the doctor has a great bedside manner.", avatar: "AW" },
];

const ratingBreakdown = [
  { stars: 5, percent: 72 },
  { stars: 4, percent: 20 },
  { stars: 3, percent: 5 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 1 },
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const doctor = doctorsData[id || "1"] || doctorsData["1"];

  const [bookingDate, setBookingDate] = useState<Date>();
  const [bookingTime, setBookingTime] = useState("");
  const [bookingType, setBookingType] = useState("in-person");
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmBooking = () => {
    setShowConfirm(true);
  };
  const resetBooking = () => {
    setShowConfirm(false);
    setBookingDate(undefined);
    setBookingTime("");
  };

  return (
    <DashboardLayout navItems={navItems} role="Patient" userName="Alex Thompson">
      <div className="space-y-6 animate-fade-in">
        {/* Back */}
        <Button variant="ghost" size="sm" asChild className="gap-1 -ml-2 text-muted-foreground">
          <Link to="/patient/doctors"><ChevronLeft className="h-4 w-4" /> Back to Doctors</Link>
        </Button>

        {/* Hero Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-extrabold text-3xl shrink-0">
                {doctor.avatar}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-extrabold">{doctor.name}</h1>
                      {doctor.available && (
                        <Badge className="bg-success text-success-foreground">Available Today</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{doctor.specialty} · {doctor.experience} years experience</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-primary">${doctor.fee}</p>
                    <p className="text-xs text-muted-foreground">per consultation</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <span className="font-bold text-foreground">{doctor.rating}</span> ({doctor.reviews} reviews)
                  </span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{doctor.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />Response: {doctor.responseTime}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" />{doctor.patientsSeen.toLocaleString()} patients</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {doctor.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button size="sm" className="gap-1" onClick={() => document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" })}>
                    <CalendarIcon className="h-4 w-4" /> Book Appointment
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1"><MessageCircle className="h-4 w-4" /> Message</Button>
                  <Button size="sm" variant="outline" className="gap-1"><Phone className="h-4 w-4" /> Call</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Left: Info Tabs */}
          <div className="space-y-6">
            <Tabs defaultValue="about">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({doctor.reviews})</TabsTrigger>
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-4 space-y-6">
                <Card>
                  <CardHeader><CardTitle className="text-base">Biography</CardTitle></CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>
                  </CardContent>
                </Card>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: GraduationCap, label: "Experience", value: `${doctor.experience} years` },
                    { icon: ThumbsUp, label: "Patients Treated", value: doctor.patientsSeen.toLocaleString() },
                    { icon: Clock, label: "Avg Response", value: doctor.responseTime },
                    { icon: MessageCircle, label: "Languages", value: doctor.languages.join(", ") },
                  ].map((item) => (
                    <Card key={item.label}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="text-sm font-bold">{item.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4 space-y-4">
                {/* Rating summary */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-4xl font-extrabold text-primary">{doctor.rating}</p>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("h-4 w-4", i < Math.round(doctor.rating) ? "text-warning fill-warning" : "text-muted")} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{doctor.reviews} reviews</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {ratingBreakdown.map((r) => (
                          <div key={r.stars} className="flex items-center gap-2">
                            <span className="text-xs w-3 text-right text-muted-foreground">{r.stars}</span>
                            <Star className="h-3 w-3 text-warning fill-warning" />
                            <Progress value={r.percent} className="h-2 flex-1" />
                            <span className="text-xs w-8 text-muted-foreground">{r.percent}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual reviews */}
                {reviewsData.map((review, i) => (
                  <motion.div key={review.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs shrink-0">
                            {review.avatar}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold">{review.name}</p>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={cn("h-3 w-3", i < review.rating ? "text-warning fill-warning" : "text-muted")} />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">{review.text}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="credentials" className="mt-4 space-y-4">
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> Education</CardTitle></CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    {doctor.education.map((e, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span className="text-muted-foreground">{e}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Certifications</CardTitle></CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    {doctor.certifications.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Shield className="h-3.5 w-3.5 text-success shrink-0" />
                        <span className="text-muted-foreground">{c}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Booking Sidebar */}
          <div className="space-y-4" id="booking-section">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-base">Book Appointment</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-5">
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

                {/* Calendar */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <Calendar
                    mode="single"
                    selected={bookingDate}
                    onSelect={setBookingDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="p-0 pointer-events-auto rounded-xl border"
                  />
                </div>

                {/* Time Slots */}
                {bookingDate && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                    <label className="text-sm font-medium">Available Slots – {format(bookingDate, "MMM d")}</label>
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
                  </motion.div>
                )}

                {/* Summary & Book */}
                {bookingDate && bookingTime && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="p-3 bg-muted rounded-xl space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{format(bookingDate, "EEEE, MMM d, yyyy")}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{bookingTime}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{bookingType === "video" ? "Video Call" : "In-Person"}</span></div>
                      <div className="flex justify-between border-t border-border pt-1 mt-1"><span className="text-muted-foreground">Fee</span><span className="font-bold text-primary">${doctor.fee}</span></div>
                    </div>
                    <Button className="w-full" onClick={confirmBooking}>
                      Confirm Booking – ${doctor.fee}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-sm">
          <div className="text-center py-6 space-y-4">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-success" fill="currentColor" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Appointment Booked!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {doctor.name} · {bookingType === "video" ? "Video Call" : "In-Person"}
              </p>
              <p className="text-sm font-medium mt-2">
                {bookingDate && format(bookingDate, "EEEE, MMMM d, yyyy")} at {bookingTime}
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" asChild><Link to="/patient/appointments">View Appointments</Link></Button>
              <Button onClick={resetBooking}>Done</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
