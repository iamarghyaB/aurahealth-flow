import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Shield,
  Calendar,
  Video,
  MessageSquare,
  FileText,
  Star,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Activity,
  Users,
  Building2,
  Bot,
  Clock,
  Pill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  { icon: Calendar, title: "Smart Scheduling", desc: "AI-powered appointment booking with real-time availability" },
  { icon: Video, title: "Telemedicine", desc: "HD video consultations from anywhere, anytime" },
  { icon: MessageSquare, title: "Secure Chat", desc: "HIPAA-compliant messaging between patients and doctors" },
  { icon: FileText, title: "Digital Records", desc: "Paperless prescriptions and lab reports" },
  { icon: Shield, title: "Data Security", desc: "End-to-end encryption for all medical data" },
  { icon: Activity, title: "Analytics", desc: "Real-time insights for clinics and hospitals" },
];

const roles = [
  { icon: Users, title: "For Patients", desc: "Book appointments, consult doctors, manage health records seamlessly.", link: "/login?role=patient", color: "bg-primary/10 text-primary" },
  { icon: Stethoscope, title: "For Doctors", desc: "Manage schedules, prescriptions, and patient care efficiently.", link: "/login?role=doctor", color: "bg-info/10 text-info" },
  { icon: Building2, title: "For Clinics", desc: "Complete clinic management with analytics and staff control.", link: "/login?role=admin", color: "bg-warning/10 text-warning" },
];

const pricingPlans = [
  { name: "Starter", price: "Free", period: "", desc: "For individual practitioners", features: ["Up to 50 patients", "Basic scheduling", "Secure messaging", "Digital prescriptions"], highlighted: false },
  { name: "Professional", price: "$49", period: "/month", desc: "For growing practices", features: ["Unlimited patients", "Telemedicine", "Analytics dashboard", "Priority support", "Custom branding"], highlighted: true },
  { name: "Enterprise", price: "Custom", period: "", desc: "For hospitals & chains", features: ["Multi-clinic support", "Advanced analytics", "API access", "Dedicated account manager", "SLA guarantee", "Custom integrations"], highlighted: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-7 w-7 text-primary" fill="currentColor" />
            <span className="text-xl font-extrabold text-foreground">MediFlow</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#roles" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                <Bot className="h-4 w-4" />
                AI-Powered Healthcare Platform
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Healthcare made{" "}
                <span className="text-gradient">simple</span>,{" "}
                secure & smart
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground max-w-lg">
                The all-in-one platform connecting patients, doctors, and clinics. 
                Book appointments, consult online, and manage health records — all in one place.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/signup">
                    Start Free Trial <ArrowRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="hero-outline" size="xl" asChild>
                  <Link to="/login">View Demo</Link>
                </Button>
              </motion.div>
              <motion.div variants={fadeUp} custom={4} className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" /> No credit card required
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" /> HIPAA Compliant
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img src={heroImage} alt="MediFlow healthcare dashboard" className="w-full h-auto rounded-2xl" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-lg border border-border animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">2,847 Appointments</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-gradient-subtle">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-extrabold mb-4">
              Everything your practice needs
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From appointment scheduling to telemedicine, MediFlow handles it all.
            </motion.p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Built for every stakeholder</h2>
            <p className="text-muted-foreground text-lg">Tailored experiences for patients, doctors, and administrators.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((r, i) => (
              <motion.div
                key={r.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-all text-center"
              >
                <div className={`h-16 w-16 rounded-2xl ${r.color} flex items-center justify-center mx-auto mb-6`}>
                  <r.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{r.title}</h3>
                <p className="text-muted-foreground mb-6">{r.desc}</p>
                <Button variant="outline" asChild>
                  <Link to={r.link}>Learn More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gradient-subtle">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground text-lg">Start free, scale as you grow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`rounded-2xl p-8 border ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground border-primary shadow-glow scale-105"
                    : "bg-card border-border"
                }`}
              >
                <h3 className={`text-lg font-bold mb-1 ${plan.highlighted ? "" : ""}`}>{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${plan.highlighted ? "text-primary-foreground" : "text-success"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? "hero-outline" : "default"}
                  className={`w-full ${plan.highlighted ? "border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" : ""}`}
                  asChild
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="bg-primary rounded-3xl p-12 md:p-16 text-center text-primary-foreground"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to transform your practice?</h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Join thousands of healthcare professionals already using MediFlow.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero-outline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link to="/signup">Start Free Trial <ArrowRight className="ml-1" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-primary" fill="currentColor" />
                <span className="text-lg font-extrabold">MediFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">Modern healthcare management for the digital age.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><Link to="/login" className="hover:text-foreground transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">HIPAA Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2026 MediFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
