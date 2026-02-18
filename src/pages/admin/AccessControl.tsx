import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Section } from "@/components/DashboardWidgets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Users, Stethoscope, Shield, Search, UserCog, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { adminNavItems } from "@/constants/navigation";
import { Link } from "react-router-dom";

type AppRole = "patient" | "doctor" | "admin";

interface UserWithRole {
  id: string;
  full_name: string;
  email: string | null;
  created_at: string;
  role: AppRole;
}

const roleBadgeStyles: Record<AppRole, string> = {
  patient: "bg-info/10 text-info border-info/20",
  doctor: "bg-success/10 text-success border-success/20",
  admin: "bg-warning/10 text-warning border-warning/20",
};

export default function AccessControl() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [changingUser, setChangingUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState<AppRole>("patient");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("manage-users", {
      method: "GET",
    });
    if (error) {
      toast({ title: "Error fetching users", description: error.message, variant: "destructive" });
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async () => {
    if (!changingUser) return;
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("manage-users", {
      method: "PUT",
      body: { userId: changingUser.id, newRole },
    });
    setSaving(false);

    if (error || data?.error) {
      toast({ title: "Failed to update role", description: error?.message || data?.error, variant: "destructive" });
      return;
    }

    toast({ title: "Role updated", description: `${changingUser.full_name} is now a ${newRole}` });
    setChangingUser(null);
    fetchUsers();
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const counts = {
    total: users.length,
    patients: users.filter((u) => u.role === "patient").length,
    doctors: users.filter((u) => u.role === "doctor").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return (
    <DashboardLayout navItems={adminNavItems} role="Admin" userName={profile?.full_name || "Admin"}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-extrabold">Access Control</h1>
            </div>
            <p className="text-muted-foreground ml-10">Manage user roles and permissions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Users", value: counts.total, icon: Users },
            { label: "Patients", value: counts.patients, icon: Users },
            { label: "Doctors", value: counts.doctors, icon: Stethoscope },
            { label: "Admins", value: counts.admins, icon: Shield },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <Section title={`Users (${filtered.length})`}>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading users...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">User</th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Email</th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Role</th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Joined</th>
                      <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => (
                      <tr key={u.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                              {u.full_name?.charAt(0) || "?"}
                            </div>
                            <span className="text-sm font-semibold">{u.full_name || "Unnamed"}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{u.email || "—"}</td>
                        <td className="p-4">
                          <Badge variant="outline" className={roleBadgeStyles[u.role]}>
                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setChangingUser(u);
                              setNewRole(u.role);
                            }}
                          >
                            <UserCog className="h-3 w-3 mr-1" /> Change Role
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Section>

        {/* Change Role Dialog */}
        <Dialog open={!!changingUser} onOpenChange={(open) => !open && setChangingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Update the role for <span className="font-semibold text-foreground">{changingUser?.full_name}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {changingUser?.full_name?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="font-semibold text-sm">{changingUser?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{changingUser?.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">New Role</label>
                <Select value={newRole} onValueChange={(v) => setNewRole(v as AppRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setChangingUser(null)}>Cancel</Button>
              <Button onClick={handleChangeRole} disabled={saving || newRole === changingUser?.role}>
                {saving ? "Saving..." : "Update Role"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
