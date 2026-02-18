
-- Doctor profiles (extended info beyond the base profiles table)
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  experience_years INT DEFAULT 0,
  fee NUMERIC(10,2) DEFAULT 0,
  location TEXT DEFAULT '',
  available BOOLEAN DEFAULT true,
  next_slot TEXT DEFAULT '',
  rating NUMERIC(3,2) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'In-Person' CHECK (type IN ('In-Person', 'Video', 'Audio')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Confirmed', 'Pending', 'Completed', 'Cancelled')),
  fee NUMERIC(10,2) DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prescriptions
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  diagnosis TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Expired')),
  notes TEXT DEFAULT '',
  refills_left INT DEFAULT 0,
  next_refill DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prescription medications
CREATE TABLE public.prescription_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL DEFAULT '',
  frequency TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  instructions TEXT DEFAULT ''
);

-- Lab reports
CREATE TABLE public.lab_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  lab_name TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Completed', 'Pending', 'Processing')),
  file_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lab report results
CREATE TABLE public.lab_report_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_report_id UUID NOT NULL REFERENCES public.lab_reports(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  reference_range TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'normal' CHECK (status IN ('normal', 'high', 'low'))
);

-- Health records
CREATE TABLE public.health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  summary TEXT DEFAULT '',
  details TEXT[] DEFAULT '{}',
  severity TEXT DEFAULT 'normal' CHECK (severity IN ('normal', 'warning', 'critical')),
  facility TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Medicines catalog (admin managed)
CREATE TABLE public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  generic_name TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  dosage TEXT DEFAULT '',
  form TEXT DEFAULT 'Tablet',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  prescription_required BOOLEAN DEFAULT false,
  manufacturer TEXT DEFAULT '',
  rating NUMERIC(3,2) DEFAULT 0,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pharmacy orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- Consultations
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  duration TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'Video' CHECK (type IN ('Video', 'Audio')),
  status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Completed', 'In Progress', 'Upcoming', 'Cancelled', 'Missed')),
  notes TEXT DEFAULT '',
  rating INT,
  has_prescription BOOLEAN DEFAULT false,
  follow_up DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_report_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- DOCTORS: public read, doctor can edit own, admin full access
CREATE POLICY "Anyone can view doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Doctors can update own profile" ON public.doctors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage doctors" ON public.doctors FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- APPOINTMENTS: patients see own, doctors see theirs, admin sees all
CREATE POLICY "Patients view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors view their appointments" ON public.appointments FOR SELECT USING (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = appointments.doctor_id AND doctors.user_id = auth.uid()));
CREATE POLICY "Admins view all appointments" ON public.appointments FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Patients can create appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Doctors can update their appointments" ON public.appointments FOR UPDATE USING (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = appointments.doctor_id AND doctors.user_id = auth.uid()));
CREATE POLICY "Admins can manage all appointments" ON public.appointments FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Patients can update own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = patient_id);

-- PRESCRIPTIONS: patients see own, doctors manage theirs, admin all
CREATE POLICY "Patients view own prescriptions" ON public.prescriptions FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors view their prescriptions" ON public.prescriptions FOR SELECT USING (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = prescriptions.doctor_id AND doctors.user_id = auth.uid()));
CREATE POLICY "Doctors can create prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = prescriptions.doctor_id AND doctors.user_id = auth.uid()));
CREATE POLICY "Doctors can update their prescriptions" ON public.prescriptions FOR UPDATE USING (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = prescriptions.doctor_id AND doctors.user_id = auth.uid()));
CREATE POLICY "Admins manage all prescriptions" ON public.prescriptions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- PRESCRIPTION_MEDICATIONS: follow prescription access
CREATE POLICY "View medications via prescription" ON public.prescription_medications FOR SELECT USING (EXISTS (SELECT 1 FROM public.prescriptions WHERE prescriptions.id = prescription_medications.prescription_id AND (prescriptions.patient_id = auth.uid() OR EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = prescriptions.doctor_id AND doctors.user_id = auth.uid()))));
CREATE POLICY "Doctors can manage medications" ON public.prescription_medications FOR ALL USING (EXISTS (SELECT 1 FROM public.prescriptions p JOIN public.doctors d ON d.id = p.doctor_id WHERE p.id = prescription_medications.prescription_id AND d.user_id = auth.uid()));
CREATE POLICY "Admins manage all medications" ON public.prescription_medications FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- LAB REPORTS: patients see own, doctors see theirs, admin all
CREATE POLICY "Patients view own lab reports" ON public.lab_reports FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors view their lab reports" ON public.lab_reports FOR SELECT USING (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = lab_reports.doctor_id AND doctors.user_id = auth.uid()));
CREATE POLICY "Doctors can create lab reports" ON public.lab_reports FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = lab_reports.doctor_id AND doctors.user_id = auth.uid()));
CREATE POLICY "Doctors can update their lab reports" ON public.lab_reports FOR UPDATE USING (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = lab_reports.doctor_id AND doctors.user_id = auth.uid()));
CREATE POLICY "Admins manage all lab reports" ON public.lab_reports FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- LAB REPORT RESULTS: follow lab report access
CREATE POLICY "View results via lab report" ON public.lab_report_results FOR SELECT USING (EXISTS (SELECT 1 FROM public.lab_reports WHERE lab_reports.id = lab_report_results.lab_report_id AND (lab_reports.patient_id = auth.uid() OR EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = lab_reports.doctor_id AND doctors.user_id = auth.uid()))));
CREATE POLICY "Doctors can manage results" ON public.lab_report_results FOR ALL USING (EXISTS (SELECT 1 FROM public.lab_reports lr JOIN public.doctors d ON d.id = lr.doctor_id WHERE lr.id = lab_report_results.lab_report_id AND d.user_id = auth.uid()));
CREATE POLICY "Admins manage all results" ON public.lab_report_results FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- HEALTH RECORDS: patients see own, doctors see theirs, admin all
CREATE POLICY "Patients view own health records" ON public.health_records FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors view their health records" ON public.health_records FOR SELECT USING (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = health_records.doctor_id AND doctors.user_id = auth.uid()));
CREATE POLICY "Doctors can create health records" ON public.health_records FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = health_records.doctor_id AND doctors.user_id = auth.uid()));
CREATE POLICY "Doctors can update their health records" ON public.health_records FOR UPDATE USING (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = health_records.doctor_id AND doctors.user_id = auth.uid()));
CREATE POLICY "Admins manage all health records" ON public.health_records FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- MEDICINES: public read, admin manages
CREATE POLICY "Anyone can view medicines" ON public.medicines FOR SELECT USING (true);
CREATE POLICY "Admins manage medicines" ON public.medicines FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ORDERS: patients see own, admin all
CREATE POLICY "Patients view own orders" ON public.orders FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Admins manage all orders" ON public.orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ORDER ITEMS: follow order access
CREATE POLICY "View items via order" ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.patient_id = auth.uid()));
CREATE POLICY "Patients can add order items" ON public.order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.patient_id = auth.uid()));
CREATE POLICY "Admins manage all order items" ON public.order_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- CONSULTATIONS: patients see own, doctors see theirs, admin all
CREATE POLICY "Patients view own consultations" ON public.consultations FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors view their consultations" ON public.consultations FOR SELECT USING (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = consultations.doctor_id AND doctors.user_id = auth.uid()));
CREATE POLICY "Doctors can update their consultations" ON public.consultations FOR UPDATE USING (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = consultations.doctor_id AND doctors.user_id = auth.uid()));
CREATE POLICY "Admins manage all consultations" ON public.consultations FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Doctors can create consultations" ON public.consultations FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = consultations.doctor_id AND doctors.user_id = auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON public.prescriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lab_reports_updated_at BEFORE UPDATE ON public.lab_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON public.health_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON public.medicines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultations;
