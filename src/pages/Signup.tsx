import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [role, setRole] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);

  const roleLabels = { patient: "Patient", doctor: "Doctor", admin: "Admin" } as const;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/${role}/dashboard`;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Visual */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground text-center">
          <div className="h-20 w-20 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-8">
            <Heart className="h-10 w-10" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4">Join MediFlow today</h2>
          <p className="text-primary-foreground/80 text-lg">
            Start managing your healthcare journey with cutting-edge technology.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <Link to="/" className="flex items-center gap-2 mb-8">
              <Heart className="h-7 w-7 text-primary" fill="currentColor" />
              <span className="text-xl font-extrabold">MediFlow</span>
            </Link>
            <h1 className="text-2xl font-extrabold">Create your account</h1>
            <p className="text-muted-foreground mt-1">Get started with MediFlow</p>
          </div>

          <div className="flex gap-2 p-1 bg-muted rounded-xl">
            {(Object.keys(roleLabels) as Array<keyof typeof roleLabels>).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  role === r
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {roleLabels[r]}
              </button>
            ))}
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Dr. Jane Smith" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button variant="hero" size="lg" className="w-full" type="submit">
              Create Account <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
