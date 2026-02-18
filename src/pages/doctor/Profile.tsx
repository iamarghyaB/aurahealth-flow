import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { doctorNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctorByUserId, useUpdateDoctor, useUpdateProfile } from "@/hooks/useSupabaseData";
import { User } from "lucide-react";

export default function DoctorProfilePage() {
  const { user, profile } = useAuth();
  const { data: doctorRecord } = useDoctorByUserId(user?.id);
  const updateDoctor = useUpdateDoctor();
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [fee, setFee] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");

  useEffect(() => {
    if (profile) setFullName(profile.full_name || "");
    if (doctorRecord) {
      setSpecialty(doctorRecord.specialty || "");
      setBio(doctorRecord.bio || "");
      setFee(String(doctorRecord.fee || ""));
      setLocation(doctorRecord.location || "");
      setExperience(String(doctorRecord.experience_years || ""));
    }
  }, [profile, doctorRecord]);

  const handleSave = () => {
    if (user) updateProfile.mutate({ id: user.id, full_name: fullName });
    if (doctorRecord) updateDoctor.mutate({ id: doctorRecord.id, specialty, bio, fee: Number(fee) || 0, location, experience_years: Number(experience) || 0 });
  };

  const displayName = profile?.full_name || "Doctor";

  return (
    <DashboardLayout navItems={doctorNavItems} role="Doctor" userName={displayName}>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div><h1 className="text-2xl font-extrabold">Profile</h1><p className="text-muted-foreground">Manage your doctor profile</p></div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Personal Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Specialty</Label><Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} /></div>
              <div className="space-y-2"><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Consultation Fee ($)</Label><Input type="number" value={fee} onChange={(e) => setFee(e.target.value)} /></div>
              <div className="space-y-2"><Label>Experience (years)</Label><Input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} /></div>
            <Button onClick={handleSave} disabled={updateDoctor.isPending || updateProfile.isPending}>
              {updateDoctor.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
