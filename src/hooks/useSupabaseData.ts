import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Helper to look up profiles by user IDs
async function getProfileMap(userIds: string[]) {
  if (!userIds.length) return new Map<string, { full_name: string; email: string | null }>();
  const { data } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);
  return new Map((data || []).map((p) => [p.id, p]));
}

// Helper to look up doctor info
async function getDoctorMap(doctorIds: string[]) {
  if (!doctorIds.length) return new Map<string, any>();
  const { data } = await supabase.from("doctors").select("*").in("id", doctorIds);
  return new Map((data || []).map((d) => [d.id, d]));
}

// ============= DOCTORS =============
export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data: doctors, error } = await supabase.from("doctors").select("*");
      if (error) throw error;
      const profileMap = await getProfileMap(doctors.map((d) => d.user_id));
      return doctors.map((d) => ({
        ...d,
        name: profileMap.get(d.user_id)?.full_name || "Unknown Doctor",
        email: profileMap.get(d.user_id)?.email || "",
      }));
    },
  });
}

export function useDoctorByUserId(userId: string | undefined) {
  return useQuery({
    queryKey: ["doctor", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*").eq("user_id", userId!).single();
      if (error) throw error;
      return data;
    },
  });
}

export function useDoctorById(doctorId: string | undefined) {
  return useQuery({
    queryKey: ["doctor-detail", doctorId],
    enabled: !!doctorId,
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*").eq("id", doctorId!).single();
      if (error) throw error;
      const profileMap = await getProfileMap([data.user_id]);
      const profile = profileMap.get(data.user_id);
      return { ...data, name: profile?.full_name || "Unknown", email: profile?.email || "" };
    },
  });
}

export function useUpdateDoctor() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from("doctors").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctors"] });
      toast({ title: "Doctor updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

// ============= APPOINTMENTS =============
export function useAppointments(filters?: { patientId?: string; doctorDbId?: string }) {
  return useQuery({
    queryKey: ["appointments", filters],
    queryFn: async () => {
      let q = supabase.from("appointments").select("*");
      if (filters?.patientId) q = q.eq("patient_id", filters.patientId);
      if (filters?.doctorDbId) q = q.eq("doctor_id", filters.doctorDbId);
      const { data, error } = await q.order("date", { ascending: false });
      if (error) throw error;
      const doctorIds = [...new Set(data.map((a) => a.doctor_id))];
      const doctorMap = await getDoctorMap(doctorIds);
      const doctorUserIds = [...doctorMap.values()].map((d) => d.user_id);
      const profileMap = await getProfileMap(doctorUserIds);
      // Also get patient profiles
      const patientIds = [...new Set(data.map((a) => a.patient_id))];
      const patientProfileMap = await getProfileMap(patientIds);
      return data.map((a) => {
        const doc = doctorMap.get(a.doctor_id);
        return {
          ...a,
          doctor_name: doc ? profileMap.get(doc.user_id)?.full_name || "Unknown" : "Unknown",
          doctor_specialty: doc?.specialty || "",
          doctor_location: doc?.location || "",
          patient_name: patientProfileMap.get(a.patient_id)?.full_name || "Unknown",
        };
      });
    },
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (apt: any) => {
      const { error } = await supabase.from("appointments").insert(apt);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      toast({ title: "Appointment booked!" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useUpdateAppointment() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from("appointments").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      toast({ title: "Appointment updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

// ============= PRESCRIPTIONS =============
export function usePrescriptions(filters?: { patientId?: string; doctorDbId?: string }) {
  return useQuery({
    queryKey: ["prescriptions", filters],
    queryFn: async () => {
      let q = supabase.from("prescriptions").select("*, prescription_medications(*)");
      if (filters?.patientId) q = q.eq("patient_id", filters.patientId);
      if (filters?.doctorDbId) q = q.eq("doctor_id", filters.doctorDbId);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      const doctorIds = [...new Set(data.map((p) => p.doctor_id))];
      const patientIds = [...new Set(data.map((p) => p.patient_id))];
      const doctorMap = await getDoctorMap(doctorIds);
      const profileMap = await getProfileMap([...doctorMap.values()].map((d) => d.user_id));
      const patientProfileMap = await getProfileMap(patientIds);
      return data.map((p) => {
        const doc = doctorMap.get(p.doctor_id);
        return {
          ...p,
          doctor_name: doc ? profileMap.get(doc.user_id)?.full_name || "Unknown" : "Unknown",
          doctor_specialty: doc?.specialty || "",
          patient_name: patientProfileMap.get(p.patient_id)?.full_name || "Unknown",
          patient_email: patientProfileMap.get(p.patient_id)?.email || "",
          medications: p.prescription_medications || [],
        };
      });
    },
  });
}

export function useCreatePrescription() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ medications, ...rx }: any) => {
      const { data, error } = await supabase.from("prescriptions").insert(rx).select().single();
      if (error) throw error;
      if (medications?.length) {
        const meds = medications.map((m: any) => ({ ...m, prescription_id: data.id }));
        const { error: medError } = await supabase.from("prescription_medications").insert(meds);
        if (medError) throw medError;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prescriptions"] });
      toast({ title: "Prescription created!" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useUpdatePrescription() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from("prescriptions").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prescriptions"] });
      toast({ title: "Prescription updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

// ============= LAB REPORTS =============
export function useLabReports(filters?: { patientId?: string; doctorDbId?: string }) {
  return useQuery({
    queryKey: ["lab-reports", filters],
    queryFn: async () => {
      let q = supabase.from("lab_reports").select("*, lab_report_results(*)");
      if (filters?.patientId) q = q.eq("patient_id", filters.patientId);
      if (filters?.doctorDbId) q = q.eq("doctor_id", filters.doctorDbId);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      const doctorIds = [...new Set(data.filter((r) => r.doctor_id).map((r) => r.doctor_id!))];
      const patientIds = [...new Set(data.map((r) => r.patient_id))];
      const doctorMap = await getDoctorMap(doctorIds);
      const profileMap = await getProfileMap([...doctorMap.values()].map((d) => d.user_id));
      const patientProfileMap = await getProfileMap(patientIds);
      return data.map((r) => {
        const doc = r.doctor_id ? doctorMap.get(r.doctor_id) : null;
        return {
          ...r,
          ordered_by: doc ? profileMap.get(doc.user_id)?.full_name || "Unknown" : "Unknown",
          patient_name: patientProfileMap.get(r.patient_id)?.full_name || "Unknown",
          patient_email: patientProfileMap.get(r.patient_id)?.email || "",
          results: r.lab_report_results || [],
        };
      });
    },
  });
}

export function useCreateLabReport() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ results, ...report }: any) => {
      const { data, error } = await supabase.from("lab_reports").insert(report).select().single();
      if (error) throw error;
      if (results?.length) {
        const items = results.map((r: any) => ({ ...r, lab_report_id: data.id }));
        const { error: resError } = await supabase.from("lab_report_results").insert(items);
        if (resError) throw resError;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lab-reports"] });
      toast({ title: "Lab report created!" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

// ============= HEALTH RECORDS =============
export function useHealthRecords(filters?: { patientId?: string; doctorDbId?: string }) {
  return useQuery({
    queryKey: ["health-records", filters],
    queryFn: async () => {
      let q = supabase.from("health_records").select("*");
      if (filters?.patientId) q = q.eq("patient_id", filters.patientId);
      if (filters?.doctorDbId) q = q.eq("doctor_id", filters.doctorDbId);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      const doctorIds = [...new Set(data.filter((r) => r.doctor_id).map((r) => r.doctor_id!))];
      const patientIds = [...new Set(data.map((r) => r.patient_id))];
      const doctorMap = await getDoctorMap(doctorIds);
      const profileMap = await getProfileMap([...doctorMap.values()].map((d) => d.user_id));
      const patientProfileMap = await getProfileMap(patientIds);
      return data.map((r) => {
        const doc = r.doctor_id ? doctorMap.get(r.doctor_id) : null;
        return {
          ...r,
          doctor_name: doc ? profileMap.get(doc.user_id)?.full_name || "Unknown" : "Unknown",
          patient_name: patientProfileMap.get(r.patient_id)?.full_name || "Unknown",
          patient_email: patientProfileMap.get(r.patient_id)?.email || "",
        };
      });
    },
  });
}

export function useCreateHealthRecord() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (record: any) => {
      const { error } = await supabase.from("health_records").insert(record);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["health-records"] });
      toast({ title: "Health record created!" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

// ============= MEDICINES =============
export function useMedicines() {
  return useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const { data, error } = await supabase.from("medicines").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateMedicine() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (med: any) => {
      const { error } = await supabase.from("medicines").insert(med);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medicines"] });
      toast({ title: "Medicine added!" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useUpdateMedicine() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from("medicines").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medicines"] });
      toast({ title: "Medicine updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useDeleteMedicine() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("medicines").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medicines"] });
      toast({ title: "Medicine deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

// ============= ORDERS =============
export function useOrders(filters?: { patientId?: string }) {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: async () => {
      let q = supabase.from("orders").select("*, order_items(*, medicines(*))");
      if (filters?.patientId) q = q.eq("patient_id", filters.patientId);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ items, ...order }: any) => {
      const { data, error } = await supabase.from("orders").insert(order).select().single();
      if (error) throw error;
      if (items?.length) {
        const orderItems = items.map((i: any) => ({ ...i, order_id: data.id }));
        const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
        if (itemsError) throw itemsError;
      }
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Order placed!" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

// ============= CONSULTATIONS =============
export function useConsultations(filters?: { patientId?: string; doctorDbId?: string }) {
  return useQuery({
    queryKey: ["consultations", filters],
    queryFn: async () => {
      let q = supabase.from("consultations").select("*");
      if (filters?.patientId) q = q.eq("patient_id", filters.patientId);
      if (filters?.doctorDbId) q = q.eq("doctor_id", filters.doctorDbId);
      const { data, error } = await q.order("date", { ascending: false });
      if (error) throw error;
      const doctorIds = [...new Set(data.map((c) => c.doctor_id))];
      const doctorMap = await getDoctorMap(doctorIds);
      const profileMap = await getProfileMap([...doctorMap.values()].map((d) => d.user_id));
      return data.map((c) => {
        const doc = doctorMap.get(c.doctor_id);
        return {
          ...c,
          doctor_name: doc ? profileMap.get(doc.user_id)?.full_name || "Unknown" : "Unknown",
          doctor_specialty: doc?.specialty || "",
        };
      });
    },
  });
}

export function useCreateConsultation() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (consult: any) => {
      const { error } = await supabase.from("consultations").insert(consult);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["consultations"] });
      toast({ title: "Consultation created!" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useUpdateConsultation() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from("consultations").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["consultations"] });
      toast({ title: "Consultation updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

// ============= PROFILES =============
export function useUpdateProfile() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from("profiles").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast({ title: "Profile updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

// ============= ALL APPOINTMENTS (admin) =============
export function useAllAppointments() {
  return useQuery({
    queryKey: ["all-appointments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("appointments").select("*").order("date", { ascending: false });
      if (error) throw error;
      const doctorIds = [...new Set(data.map((a) => a.doctor_id))];
      const patientIds = [...new Set(data.map((a) => a.patient_id))];
      const doctorMap = await getDoctorMap(doctorIds);
      const doctorUserIds = [...doctorMap.values()].map((d) => d.user_id);
      const allProfileIds = [...new Set([...doctorUserIds, ...patientIds])];
      const profileMap = await getProfileMap(allProfileIds);
      return data.map((a) => {
        const doc = doctorMap.get(a.doctor_id);
        return {
          ...a,
          doctor_name: doc ? profileMap.get(doc.user_id)?.full_name || "Unknown" : "Unknown",
          patient_name: profileMap.get(a.patient_id)?.full_name || "Unknown",
          patient_email: profileMap.get(a.patient_id)?.email || "",
        };
      });
    },
  });
}

// ============= ALL ORDERS (admin) =============
export function useAllOrders() {
  return useQuery({
    queryKey: ["all-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*, order_items(*, medicines(*))").order("created_at", { ascending: false });
      if (error) throw error;
      const patientIds = [...new Set(data.map((o) => o.patient_id))];
      const profileMap = await getProfileMap(patientIds);
      return data.map((o) => ({
        ...o,
        patient_name: profileMap.get(o.patient_id)?.full_name || "Unknown",
        patient_email: profileMap.get(o.patient_id)?.email || "",
      }));
    },
  });
}
