import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { patientNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateProfile } from "@/hooks/useSupabaseData";
import {
  User, Shield, Mail, Phone, MapPin, Save, Edit2, Lock, Eye, EyeOff, Camera,
} from "lucide-react";

export default function PatientProfile() {
  const { user, profile } = useAuth();
  const updateProfile = useUpdateProfile();
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    await updateProfile.mutateAsync({ id: user.id, full_name: fullName });
    setEditingPersonal(false);
  };

  const displayName = profile?.full_name || "Patient";

  return (
    <DashboardLayout navItems={patientNavItems} role="Patient" userName={displayName}>
      <div className="space-y-6 animate-fade-in">
        <div><h1 className="text-2xl font-extrabold">My Profile</h1><p className="text-muted-foreground">Manage your personal information</p></div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-extrabold text-3xl">{(displayName || "?").charAt(0)}</div>
                <button className="absolute inset-0 rounded-2xl bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="h-6 w-6 text-background" /></button>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl font-extrabold">{displayName}</h2>
                <p className="text-sm text-muted-foreground">Patient</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 justify-center sm:justify-start text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{email}</span>
                </div>
              </div>
              <Badge variant="outline" className="gap-1 text-success border-success/30"><Shield className="h-3 w-3" /> Verified</Badge>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

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
                    <Label>Full Name</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!editingPersonal} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" value={email} disabled />
                  </div>
                </div>
                {editingPersonal && (
                  <div className="flex justify-end pt-2">
                    <Button className="gap-1" onClick={handleSave} disabled={updateProfile.isPending}>
                      <Save className="h-4 w-4" /> {updateProfile.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

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
                  <div className="space-y-2"><Label>New Password</Label><Input type="password" placeholder="Enter new password" /></div>
                  <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" placeholder="Confirm new password" /></div>
                </div>
                <div className="flex justify-end"><Button className="gap-1"><Lock className="h-4 w-4" /> Update Password</Button></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
