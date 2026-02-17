import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "patient";
  const [role, setRole] = useState(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const roleLabels = { patient: "Patient", doctor: "Doctor", admin: "Admin" } as const;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to dashboard based on role
    window.location.href = `/${role}/dashboard`;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
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
            <h1 className="text-2xl font-extrabold">Welcome back</h1>
            <p className="text-muted-foreground mt-1">Sign in to your account</p>
          </div>

          {/* Role Selector */}
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

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              Sign In <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground text-center">
          <div className="h-20 w-20 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-8">
            <Heart className="h-10 w-10" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4">Your health, simplified</h2>
          <p className="text-primary-foreground/80 text-lg">
            Access appointments, consultations, and health records all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
