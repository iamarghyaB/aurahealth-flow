import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Search, Calendar, FileText, MessageSquare,
  Video, Upload, User, Pill, Bot, Shield, Bell, Lock, Eye, EyeOff,
  Camera, Mail, Phone, MapPin, Heart, Activity, Droplets,
  Save, CheckCircle2, AlertTriangle, Edit2,
} from "lucide-react";
import { motion } from "framer-motion";

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

export default function PatientProfile() {
  const [saved, setSaved] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Personal info
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Thompson");
  const [email, setEmail] = useState("alex.thompson@email.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [dob, setDob] = useState("1990-03-15");
  const [gender, setGender] = useState("male");
  const [address, setAddress] = useState("123 Health Street, Apt 4B");
  const [city, setCity] = useState("Medical City");
  const [state, setState] = useState("MC");
  const [zip, setZip] = useState("10001");

  // Medical info
  const [bloodType, setBloodType] = useState("O+");
  const [height, setHeight] = useState("5'10\"");
  const [weight, setWeight] = useState("165");
  const [emergencyName, setEmergencyName] = useState("Sarah Thompson");
  const [emergencyPhone, setEmergencyPhone] = useState("+1 (555) 987-6543");
  const [emergencyRelation, setEmergencyRelation] = useState("Spouse");

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [labResults, setLabResults] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditingPersonal(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout navItems={navItems} role="Patient" userName="Alex Thompson">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-extrabold text-3xl">
                  AT
                </div>
                <button className="absolute inset-0 rounded-2xl bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-background" />
                </button>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl font-extrabold">{firstName} {lastName}</h2>
                <p className="text-sm text-muted-foreground">Patient · Member since Jan 2025</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 justify-center sm:justify-start text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{phone}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{city}, {state}</span>
                </div>
              </div>
              <Badge variant="outline" className="gap-1 text-success border-success/30">
                <Shield className="h-3 w-3" /> Verified
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="medical">Medical Info</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Personal Info */}
          <TabsContent value="personal" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="flex-row items-center justify-between pb-4">
                <CardTitle className="text-base">Personal Information</CardTitle>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditingPersonal(!editingPersonal)}>
                  <Edit2 className="h-3 w-3" /> {editingPersonal ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={!editingPersonal} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={!editingPersonal} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editingPersonal} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editingPersonal} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} disabled={!editingPersonal} />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={gender} onValueChange={setGender} disabled={!editingPersonal}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Address</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Street Address</Label>
                      <Input value={address} onChange={(e) => setAddress(e.target.value)} disabled={!editingPersonal} />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={city} onChange={(e) => setCity(e.target.value)} disabled={!editingPersonal} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input value={state} onChange={(e) => setState(e.target.value)} disabled={!editingPersonal} />
                      </div>
                      <div className="space-y-2">
                        <Label>ZIP Code</Label>
                        <Input value={zip} onChange={(e) => setZip(e.target.value)} disabled={!editingPersonal} />
                      </div>
                    </div>
                  </div>
                </div>

                {editingPersonal && (
                  <div className="flex justify-end pt-2">
                    <Button className="gap-1" onClick={handleSave}>
                      <Save className="h-4 w-4" /> Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical Info */}
          <TabsContent value="medical" className="mt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Medical Details</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Blood Type</Label>
                    <Select value={bloodType} onValueChange={setBloodType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Height</Label>
                    <Input value={height} onChange={(e) => setHeight(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (lbs)</Label>
                    <Input value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Known Allergies</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-2">
                {[
                  { name: "Penicillin", severity: "Severe" },
                  { name: "Peanuts", severity: "Moderate" },
                  { name: "Latex", severity: "Mild" },
                ].map((a) => (
                  <div key={a.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn("h-4 w-4", a.severity === "Severe" ? "text-destructive" : a.severity === "Moderate" ? "text-warning" : "text-muted-foreground")} />
                      <span className="text-sm font-medium">{a.name}</span>
                    </div>
                    <Badge className={cn("text-xs",
                      a.severity === "Severe" && "bg-destructive text-destructive-foreground",
                      a.severity === "Moderate" && "bg-warning text-warning-foreground",
                      a.severity === "Mild" && "bg-muted text-muted-foreground"
                    )}>{a.severity}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Emergency Contact</CardTitle></CardHeader>
              <CardContent className="pt-0">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Name</Label>
                    <Input value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Select value={emergencyRelation} onValueChange={setEmergencyRelation}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"].map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button className="gap-1" onClick={handleSave}><Save className="h-4 w-4" /> Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-1">
                {[
                  { label: "Email Notifications", desc: "Receive updates via email", value: emailNotifs, setter: setEmailNotifs, icon: Mail },
                  { label: "SMS Notifications", desc: "Receive updates via text message", value: smsNotifs, setter: setSmsNotifs, icon: Phone },
                  { label: "Appointment Reminders", desc: "Get reminded before scheduled appointments", value: appointmentReminders, setter: setAppointmentReminders, icon: Calendar },
                  { label: "Lab Results Ready", desc: "Get notified when lab results are available", value: labResults, setter: setLabResults, icon: FileText },
                  { label: "Promotions & Offers", desc: "Receive pharmacy deals and health tips", value: promotions, setter: setPromotions, icon: Heart },
                ].map((item, i) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <Switch checked={item.value} onCheckedChange={item.setter} />
                    </div>
                    {i < 4 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="mt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="Enter current password" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="gap-1" onClick={handleSave}><Lock className="h-4 w-4" /> Update Password</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Two-Factor Authentication</CardTitle></CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">2FA is not enabled</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Active Sessions</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-3">
                {[
                  { device: "Chrome on macOS", location: "Medical City, MC", time: "Current session", current: true },
                  { device: "Safari on iPhone", location: "Medical City, MC", time: "2 hours ago", current: false },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{session.device}</p>
                      <p className="text-xs text-muted-foreground">{session.location} · {session.time}</p>
                    </div>
                    {session.current ? (
                      <Badge className="bg-success text-success-foreground text-xs">Current</Badge>
                    ) : (
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">Revoke</Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader><CardTitle className="text-base text-destructive">Danger Zone</CardTitle></CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Delete Account</p>
                    <p className="text-xs text-muted-foreground">Permanently delete your account and all associated data</p>
                  </div>
                  <Button variant="destructive" size="sm">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Save confirmation */}
      <Dialog open={saved} onOpenChange={setSaved}>
        <DialogContent className="sm:max-w-xs">
          <div className="text-center py-4 space-y-3">
            <div className="h-14 w-14 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h3 className="text-lg font-bold">Changes Saved!</h3>
            <p className="text-sm text-muted-foreground">Your profile has been updated successfully.</p>
            <Button onClick={() => setSaved(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
