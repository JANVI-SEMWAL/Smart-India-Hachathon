import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Layout from "@/components/layout/Layout";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Facebook,
  Github,
  Phone,
  User2,
  Store,
  ShieldCheck,
  Compass,
  ArrowRight,
  Loader2,
  CheckCircle
} from "lucide-react";
import {
  registerTourist,
  registerArtisan,
  registerAdmin,
  sendEmailOtp,
  sendPhoneOtp,
  verifyEmailOtp,
  verifyPhoneOtp,
  loginUser,
} from "@/lib/mockApi";

type Role = "tourist" | "artisan" | "admin";

const otpDurationSec = 30;

const Login = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<Role>("tourist");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const canResend = useMemo(() => secondsLeft <= 0, [secondsLeft]);

  const [touristForm, setTouristForm] = useState({ 
    fullName: "", 
    email: "", 
    phone: "", 
    address: "", 
    gender: "", 
    dateOfBirth: "", 
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    password: "" 
  });
  const [artisanForm, setArtisanForm] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    aadharNumber: "",
    password: "",
  });
  const [adminForm, setAdminForm] = useState({ 
    fullName: "", 
    email: "", 
    phone: "", 
    address: "", 
    gender: "", 
    dateOfBirth: "", 
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    employeeId: "", 
    password: "" 
  });
  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });

  useEffect(() => {
    if (!otpSent) return;
    setSecondsLeft(otpDurationSec);
  }, [otpSent]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const passwordValid = (pwd: string) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pwd);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      if (activeRole === "tourist") {
        if (!touristForm.email) throw new Error("Email is required");
        const res = await sendEmailOtp(touristForm.email);
        if (res.success) {
          setOtpSent(true);
          if (res.code) alert(`DEV OTP (email): ${res.code}`);
        }
      } else if (activeRole === "artisan") {
        if (!artisanForm.phone) throw new Error("Phone is required");
        const res = await sendPhoneOtp(artisanForm.phone);
        if (res.success) {
          setOtpSent(true);
          if (res.code) alert(`DEV OTP (phone): ${res.code}`);
        }
      } else {
        if (!adminForm.email) throw new Error("Official email is required");
        const res = await sendEmailOtp(adminForm.email);
        if (res.success) {
          setOtpSent(true);
          if (res.code) alert(`DEV OTP (email): ${res.code}`);
        }
      }
    } catch (e: any) {
      alert(e.message ?? "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndSignup = async () => {
    setLoading(true);
    try {
      if (activeRole === "tourist") {
        if (!passwordValid(touristForm.password)) throw new Error("Password must be 8+ chars with letters and numbers");
        const verified = await verifyEmailOtp(touristForm.email, otpCode);
        if (!verified.success) throw new Error("Invalid OTP");
        const res = await registerTourist(touristForm);
        if (!res.success) throw new Error(res.message || "Registration failed");
        alert("Signup successful! You can now log in.");
        setIsLogin(true);
        setOtpSent(false);
        setOtpCode("");
      } else if (activeRole === "artisan") {
        if (!passwordValid(artisanForm.password)) throw new Error("Password must be 8+ chars with letters and numbers");
        const verified = await verifyPhoneOtp(artisanForm.phone, otpCode);
        if (!verified.success) throw new Error("Invalid OTP");
        const res = await registerArtisan(artisanForm);
        if (!res.success) throw new Error(res.message || "Registration failed");
        alert("Phone verified. Waiting for admin approval.");
        setIsLogin(true);
        setOtpSent(false);
        setOtpCode("");
      } else {
        if (!passwordValid(adminForm.password)) throw new Error("Password must be 8+ chars with letters and numbers");
        const verified = await verifyEmailOtp(adminForm.email, otpCode);
        if (!verified.success) throw new Error("Invalid OTP");
        const res = await registerAdmin(adminForm);
        if (!res.success) throw new Error(res.message || "Registration failed");
        alert("Admin email verified. Account created.");
        setIsLogin(true);
        setOtpSent(false);
        setOtpCode("");
      }
    } catch (e: any) {
      alert(e.message ?? "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await loginUser(loginForm.identifier, loginForm.password);
      if (!res.success) throw new Error(res.message || "Login failed");
      localStorage.setItem(
        "auth_user",
        JSON.stringify({ 
          role: res.role, 
          fullName: res.fullName, 
          email: res.email, 
          phone: res.phone,
          address: res.address,
          gender: res.gender,
          dateOfBirth: res.dateOfBirth,
          emergencyContactName: res.emergencyContactName,
          emergencyContactPhone: res.emergencyContactPhone,
          emergencyContactRelation: res.emergencyContactRelation
        })
      );
      navigate("/");
    } catch (e: any) {
      alert(e.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "Create personalized travel itineraries",
    "Access to exclusive cultural experiences",
    "Connect with local communities",
    "Private travel journal",
    "24/7 safety & emergency support",
    "Earn rewards for sustainable travel"
  ];

  return (
    <Layout>
      <div className="min-h-screen flex">
        {/* Left Side - Image and Benefits */}
        <div 
          className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop')`
          }}
        >
          <div className="flex items-center justify-center p-12 text-white w-full">
            <div className="max-w-md text-center">
              <div className="mb-8">
                <Compass className="h-16 w-16 mx-auto mb-4" />
                <h1 className="text-4xl font-bold mb-4">
                  {isLogin ? "Welcome Back" : "Join KalpanaX"}
                </h1>
                <p className="text-xl text-gray-200">
                  {isLogin 
                    ? "Continue your journey through Jharkhand's cultural and ecological wonders"
                    : "Start your adventure through Jharkhand's hidden treasures"
                  }
                </p>
              </div>
              
              <div className="space-y-4 text-left">
                <h3 className="text-lg font-semibold mb-4">Why join our community?</h3>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-eco-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-200">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex space-x-4">
                <Button variant="ghost" className="text-white border-white hover:bg-white hover:text-foreground">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button variant="ghost" className="text-white border-white hover:bg-white hover:text-foreground">
                  <Github className="h-4 w-4 mr-2" />
                  Google
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Compass className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold text-foreground">KalpanaX</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
            </div>

            <Card className="travel-card">
              <CardContent className="p-8">
                <div className="hidden lg:block text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {isLogin ? "Sign In" : "Create Account"}
                  </h2>
                  <p className="text-muted-foreground">
                    {isLogin 
                      ? "Enter your details to access your account"
                      : "Join our community of cultural explorers"
                    }
                  </p>
                </div>
                
                <div className="space-y-6">
                  <Tabs value={activeRole} onValueChange={(v) => setActiveRole(v as Role)}>
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="tourist" className={activeRole === "tourist" ? "text-primary" : ""}>
                        <User2 className="h-4 w-4 mr-2" /> Tourist
                      </TabsTrigger>
                      <TabsTrigger value="artisan" className={activeRole === "artisan" ? "text-primary" : ""}>
                        <Store className="h-4 w-4 mr-2" /> Artisan
                      </TabsTrigger>
                      <TabsTrigger value="admin" className={activeRole === "admin" ? "text-primary" : ""}>
                        <ShieldCheck className="h-4 w-4 mr-2" /> Admin
                      </TabsTrigger>
                    </TabsList>

                    {isLogin && (
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="identifier">Email or Phone</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="identifier"
                              placeholder="name@email.com or 98765xxxxx"
                              className="pl-10"
                              value={loginForm.identifier}
                              onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="password">Password</Label>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              value={loginForm.password}
                              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember" />
                          <Label htmlFor="remember" className="text-sm">Remember me</Label>
                        </div>
                        <Button variant="cultural" size="lg" className="w-full" onClick={handleLogin} disabled={loading}>
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {!isLogin && (
                      <TabsContent value={activeRole} className="mt-4">
                        {activeRole === "tourist" && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Full Name</Label>
                              <Input
                                placeholder="John Doe"
                                value={touristForm.fullName}
                                onChange={(e) => setTouristForm({ ...touristForm, fullName: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email (required)</Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  type="email"
                                  placeholder="name@email.com"
                                  className="pl-10"
                                  value={touristForm.email}
                                  onChange={(e) => setTouristForm({ ...touristForm, email: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Phone (optional)</Label>
                              <Input
                                placeholder="98765xxxxx"
                                value={touristForm.phone}
                                onChange={(e) => setTouristForm({ ...touristForm, phone: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Address</Label>
                              <Input
                                placeholder="Your address"
                                value={touristForm.address}
                                onChange={(e) => setTouristForm({ ...touristForm, address: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Gender</Label>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={touristForm.gender}
                                onChange={(e) => setTouristForm({ ...touristForm, gender: e.target.value })}
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label>Date of Birth</Label>
                              <Input
                                type="date"
                                value={touristForm.dateOfBirth}
                                onChange={(e) => setTouristForm({ ...touristForm, dateOfBirth: e.target.value })}
                              />
                            </div>
                            
                            {/* Emergency Contact Section */}
                            <div className="space-y-4 pt-4 border-t border-border">
                              <h4 className="text-sm font-medium text-foreground">Emergency Contact Information</h4>
                              <div className="space-y-2">
                                <Label>Emergency Contact Name</Label>
                                <Input
                                  placeholder="Full Name"
                                  value={touristForm.emergencyContactName}
                                  onChange={(e) => setTouristForm({ ...touristForm, emergencyContactName: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Emergency Contact Phone</Label>
                                <Input
                                  placeholder="98765xxxxx"
                                  value={touristForm.emergencyContactPhone}
                                  onChange={(e) => setTouristForm({ ...touristForm, emergencyContactPhone: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Relationship</Label>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  value={touristForm.emergencyContactRelation}
                                  onChange={(e) => setTouristForm({ ...touristForm, emergencyContactRelation: e.target.value })}
                                >
                                  <option value="">Select Relationship</option>
                                  <option value="Father">Father</option>
                                  <option value="Mother">Mother</option>
                                  <option value="Spouse">Spouse</option>
                                  <option value="Sibling">Sibling</option>
                                  <option value="Friend">Friend</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Password</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="8+ chars, letters & numbers"
                                  className="pl-10 pr-10"
                                  value={touristForm.password}
                                  onChange={(e) => setTouristForm({ ...touristForm, password: e.target.value })}
                                />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>

                            {!otpSent ? (
                              <Button onClick={handleSendOtp} disabled={loading || !touristForm.email || !touristForm.address || !touristForm.gender || !touristForm.dateOfBirth || !touristForm.emergencyContactName || !touristForm.emergencyContactPhone || !touristForm.emergencyContactRelation || !passwordValid(touristForm.password)} className="w-full" variant="cultural">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Email OTP"}
                              </Button>
                            ) : (
                              <div className="space-y-3">
                                <Label>Enter 6-digit OTP sent to email</Label>
                                <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                                  <InputOTPGroup>
                                    {Array.from({ length: 6 }).map((_, i) => (
                                      <InputOTPSlot key={i} index={i} />
                                    ))}
                                  </InputOTPGroup>
                                </InputOTP>
                                <div className="flex items-center justify-between">
                                  <Button variant="outline" type="button" disabled={!canResend} onClick={handleSendOtp}>
                                    Resend OTP {canResend ? "" : `in ${secondsLeft}s`}
                                  </Button>
                                  <Button variant="cultural" onClick={handleVerifyOtpAndSignup} disabled={loading || otpCode.length !== 6}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Create Account"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {activeRole === "artisan" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input value={artisanForm.fullName} onChange={(e) => setArtisanForm({ ...artisanForm, fullName: e.target.value })} />
                              </div>
                              <div className="space-y-2">
                                <Label>Business Name</Label>
                                <Input value={artisanForm.businessName} onChange={(e) => setArtisanForm({ ...artisanForm, businessName: e.target.value })} />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Email</Label>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                  <Input type="email" className="pl-10" value={artisanForm.email} onChange={(e) => setArtisanForm({ ...artisanForm, email: e.target.value })} />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Phone</Label>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                  <Input className="pl-10" value={artisanForm.phone} onChange={(e) => setArtisanForm({ ...artisanForm, phone: e.target.value })} />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Address / Location</Label>
                              <Input value={artisanForm.address} onChange={(e) => setArtisanForm({ ...artisanForm, address: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Gender</Label>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={artisanForm.gender}
                                onChange={(e) => setArtisanForm({ ...artisanForm, gender: e.target.value })}
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label>Date of Birth</Label>
                              <Input
                                type="date"
                                value={artisanForm.dateOfBirth}
                                onChange={(e) => setArtisanForm({ ...artisanForm, dateOfBirth: e.target.value })}
                              />
                            </div>
                            
                            {/* Emergency Contact Section */}
                            <div className="space-y-4 pt-4 border-t border-border">
                              <h4 className="text-sm font-medium text-foreground">Emergency Contact Information</h4>
                              <div className="space-y-2">
                                <Label>Emergency Contact Name</Label>
                                <Input
                                  placeholder="Full Name"
                                  value={artisanForm.emergencyContactName}
                                  onChange={(e) => setArtisanForm({ ...artisanForm, emergencyContactName: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Emergency Contact Phone</Label>
                                <Input
                                  placeholder="98765xxxxx"
                                  value={artisanForm.emergencyContactPhone}
                                  onChange={(e) => setArtisanForm({ ...artisanForm, emergencyContactPhone: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Relationship</Label>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  value={artisanForm.emergencyContactRelation}
                                  onChange={(e) => setArtisanForm({ ...artisanForm, emergencyContactRelation: e.target.value })}
                                >
                                  <option value="">Select Relationship</option>
                                  <option value="Father">Father</option>
                                  <option value="Mother">Mother</option>
                                  <option value="Spouse">Spouse</option>
                                  <option value="Sibling">Sibling</option>
                                  <option value="Friend">Friend</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Aadhar Number (Required for Artisan Registration)</Label>
                              <Input 
                                placeholder="1234 5678 9012" 
                                value={artisanForm.aadharNumber} 
                                onChange={(e) => setArtisanForm({ ...artisanForm, aadharNumber: e.target.value })} 
                                maxLength={14}
                              />
                              <p className="text-xs text-muted-foreground">
                                Aadhar verification is required for artisan registration to ensure authenticity
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label>Password</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="8+ chars, letters & numbers"
                                  className="pl-10 pr-10"
                                  value={artisanForm.password}
                                  onChange={(e) => setArtisanForm({ ...artisanForm, password: e.target.value })}
                                />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>

                            {!otpSent ? (
                              <Button onClick={handleSendOtp} disabled={loading || !artisanForm.phone || !artisanForm.gender || !artisanForm.dateOfBirth || !artisanForm.emergencyContactName || !artisanForm.emergencyContactPhone || !artisanForm.emergencyContactRelation || !passwordValid(artisanForm.password) || !artisanForm.aadharNumber} className="w-full" variant="cultural">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Phone OTP (Aadhar Verified)"}
                              </Button>
                            ) : (
                              <div className="space-y-3">
                                <Label>Enter 6-digit OTP sent to phone</Label>
                                <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                                  <InputOTPGroup>
                                    {Array.from({ length: 6 }).map((_, i) => (
                                      <InputOTPSlot key={i} index={i} />
                                    ))}
                                  </InputOTPGroup>
                                </InputOTP>
                                <div className="flex items-center justify-between">
                                  <Button variant="outline" type="button" disabled={!canResend} onClick={handleSendOtp}>
                                    Resend OTP {canResend ? "" : `in ${secondsLeft}s`}
                                  </Button>
                                  <Button variant="cultural" onClick={handleVerifyOtpAndSignup} disabled={loading || otpCode.length !== 6}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Submit (Admin Approval)"}
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">After verification, you'll see "Waiting for admin approval."</p>
                              </div>
                            )}
                          </div>
                        )}

                        {activeRole === "admin" && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Full Name</Label>
                              <Input value={adminForm.fullName} onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Official Email</Label>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                  <Input type="email" className="pl-10" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Phone (optional)</Label>
                                <Input value={adminForm.phone} onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Address</Label>
                              <Input
                                placeholder="Your address"
                                value={adminForm.address}
                                onChange={(e) => setAdminForm({ ...adminForm, address: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Gender</Label>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={adminForm.gender}
                                onChange={(e) => setAdminForm({ ...adminForm, gender: e.target.value })}
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label>Date of Birth</Label>
                              <Input
                                type="date"
                                value={adminForm.dateOfBirth}
                                onChange={(e) => setAdminForm({ ...adminForm, dateOfBirth: e.target.value })}
                              />
                            </div>
                            
                            {/* Emergency Contact Section */}
                            <div className="space-y-4 pt-4 border-t border-border">
                              <h4 className="text-sm font-medium text-foreground">Emergency Contact Information</h4>
                              <div className="space-y-2">
                                <Label>Emergency Contact Name</Label>
                                <Input
                                  placeholder="Full Name"
                                  value={adminForm.emergencyContactName}
                                  onChange={(e) => setAdminForm({ ...adminForm, emergencyContactName: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Emergency Contact Phone</Label>
                                <Input
                                  placeholder="98765xxxxx"
                                  value={adminForm.emergencyContactPhone}
                                  onChange={(e) => setAdminForm({ ...adminForm, emergencyContactPhone: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Relationship</Label>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  value={adminForm.emergencyContactRelation}
                                  onChange={(e) => setAdminForm({ ...adminForm, emergencyContactRelation: e.target.value })}
                                >
                                  <option value="">Select Relationship</option>
                                  <option value="Father">Father</option>
                                  <option value="Mother">Mother</option>
                                  <option value="Spouse">Spouse</option>
                                  <option value="Sibling">Sibling</option>
                                  <option value="Friend">Friend</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Employee ID</Label>
                                <Input value={adminForm.employeeId} onChange={(e) => setAdminForm({ ...adminForm, employeeId: e.target.value })} />
                              </div>
                              <div className="space-y-2">
                                <Label>Password</Label>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="8+ chars, letters & numbers"
                                    className="pl-10 pr-10"
                                    value={adminForm.password}
                                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                                  />
                                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {!otpSent ? (
                              <Button onClick={handleSendOtp} disabled={loading || !adminForm.email || !adminForm.address || !adminForm.gender || !adminForm.dateOfBirth || !adminForm.emergencyContactName || !adminForm.emergencyContactPhone || !adminForm.emergencyContactRelation || !passwordValid(adminForm.password)} className="w-full" variant="cultural">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Email Verification"}
                              </Button>
                            ) : (
                              <div className="space-y-3">
                                <Label>Enter 6-digit OTP sent to official email</Label>
                                <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                                  <InputOTPGroup>
                                    {Array.from({ length: 6 }).map((_, i) => (
                                      <InputOTPSlot key={i} index={i} />
                                    ))}
                                  </InputOTPGroup>
                                </InputOTP>
                                <div className="flex items-center justify-between">
                                  <Button variant="outline" type="button" disabled={!canResend} onClick={handleSendOtp}>
                                    Resend OTP {canResend ? "" : `in ${secondsLeft}s`}
                                  </Button>
                                  <Button variant="cultural" onClick={handleVerifyOtpAndSignup} disabled={loading || otpCode.length !== 6}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Create Admin"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button variant="outline" disabled>
                      LinkedIn
                    </Button>
                    <Button variant="outline" disabled>
                      Facebook
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-medium"
                      onClick={() => { setIsLogin(!isLogin); setOtpSent(false); setOtpCode(""); }}
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </Button>
                  </p>
                </div>

                {/* Quick Links */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center mb-3">
                    Quick access for travelers:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Link to="/safety">
                      <Button variant="outline" size="sm">
                        Emergency SOS
                      </Button>
                    </Link>
                    <Link to="/itinerary">
                      <Button variant="outline" size="sm">
                        Plan Trip
                      </Button>
                    </Link>
                    <Link to="/marketplace">
                      <Button variant="outline" size="sm">
                        Local Market
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;