import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { doctorNavItems } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctorByUserId, useUpdateDoctor } from "@/hooks/useSupabaseData";
import { Settings as SettingsIcon } from "lucide-react";

export default function DoctorSettings() {
  const { user, profile } = useAuth();
  const { data: doctorRecord } = useDoctorByUserId(user?.id);
  const updateDoctor = useUpdateDoctor();
  const displayName = profile?.full_name || "Doctor";

  return (
    <DashboardLayout navItems={doctorNavItems} role="Doctor" userName={displayName}>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div><h1 className="text-2xl font-extrabold">Settings</h1><p className="text-muted-foreground">Configure your preferences</p></div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><SettingsIcon className="h-5 w-5" />Availability</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Available for appointments</Label>
              <Switch checked={doctorRecord?.available ?? true} onCheckedChange={(checked) => doctorRecord && updateDoctor.mutate({ id: doctorRecord.id, available: checked })} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
