// Simple in-memory/localStorage mock API to simulate OTP, registration, and approvals
// This is for frontend development only.

type UserRole = "tourist" | "artisan" | "admin";

export type TouristSignup = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
};

export type ArtisanSignup = {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  governmentId: string;
  password: string;
};

export type AdminSignup = {
  fullName: string;
  email: string;
  phone?: string;
  employeeId: string;
  password: string;
};

type StoredUser = {
  id: string;
  role: UserRole;
  email: string;
  phone?: string;
  approved?: boolean; // for artisans
  data: Record<string, unknown>;
  password: string; // plaintext for mock
};

type OtpEntry = {
  code: string; // 6 digits
  target: string; // email or phone
  channel: "email" | "phone";
  expiresAt: number; // epoch ms
};

const STORAGE_KEYS = {
  users: "mock_users",
  otps: "mock_otps",
};

function readUsers(): StoredUser[] {
  const raw = localStorage.getItem(STORAGE_KEYS.users);
  return raw ? (JSON.parse(raw) as StoredUser[]) : [];
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function readOtps(): OtpEntry[] {
  const raw = localStorage.getItem(STORAGE_KEYS.otps);
  return raw ? (JSON.parse(raw) as OtpEntry[]) : [];
}

function writeOtps(otps: OtpEntry[]) {
  localStorage.setItem(STORAGE_KEYS.otps, JSON.stringify(otps));
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function delay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function sendEmailOtp(email: string) {
  const code = generateOtp();
  const otps = readOtps().filter((o) => o.target !== email || o.channel !== "email");
  otps.push({ code, target: email, channel: "email", expiresAt: Date.now() + 5 * 60 * 1000 });
  writeOtps(otps);
  return delay({ success: true, message: `OTP sent to ${email}`, code });
}

export async function sendPhoneOtp(phone: string) {
  const code = generateOtp();
  const otps = readOtps().filter((o) => o.target !== phone || o.channel !== "phone");
  otps.push({ code, target: phone, channel: "phone", expiresAt: Date.now() + 5 * 60 * 1000 });
  writeOtps(otps);
  return delay({ success: true, message: `OTP sent to ${phone}`, code });
}

export async function verifyEmailOtp(email: string, code: string) {
  const otps = readOtps();
  const entry = otps.find((o) => o.target === email && o.channel === "email");
  const ok = !!entry && entry.code === code && entry.expiresAt > Date.now();
  return delay({ success: ok, message: ok ? "Email verified" : "Invalid or expired OTP" });
}

export async function verifyPhoneOtp(phone: string, code: string) {
  const otps = readOtps();
  const entry = otps.find((o) => o.target === phone && o.channel === "phone");
  const ok = !!entry && entry.code === code && entry.expiresAt > Date.now();
  return delay({ success: ok, message: ok ? "Phone verified" : "Invalid or expired OTP" });
}

export async function registerTourist(payload: TouristSignup) {
  const users = readUsers();
  if (users.find((u) => u.email === payload.email)) {
    return delay({ success: false, message: "Email already registered" });
  }
  users.push({
    id: crypto.randomUUID(),
    role: "tourist",
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    data: { fullName: payload.fullName },
  });
  writeUsers(users);
  return delay({ success: true });
}

export async function registerArtisan(payload: ArtisanSignup) {
  const users = readUsers();
  if (users.find((u) => u.email === payload.email)) {
    return delay({ success: false, message: "Email already registered" });
  }
  users.push({
    id: crypto.randomUUID(),
    role: "artisan",
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    approved: false,
    data: {
      fullName: payload.fullName,
      businessName: payload.businessName,
      address: payload.address,
      governmentId: payload.governmentId,
    },
  });
  writeUsers(users);
  return delay({ success: true, message: "Registered. Awaiting admin approval." });
}

export async function registerAdmin(payload: AdminSignup) {
  const users = readUsers();
  if (users.find((u) => u.email === payload.email)) {
    return delay({ success: false, message: "Email already registered" });
  }
  users.push({
    id: crypto.randomUUID(),
    role: "admin",
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    data: { fullName: payload.fullName, employeeId: payload.employeeId },
  });
  writeUsers(users);
  return delay({ success: true });
}

export async function loginUser(identifier: string, password: string) {
  const users = readUsers();
  const user = users.find((u) => u.email === identifier || u.phone === identifier);
  if (!user || user.password !== password) {
    return delay({ success: false, message: "Invalid credentials" });
  }
  if (user.role === "artisan" && user.approved === false) {
    return delay({ success: false, message: "Artisan not approved yet" });
  }
  const fullName = (user.data?.fullName as string) || "User";
  return delay({ success: true, role: user.role as UserRole, email: user.email, phone: user.phone, fullName });
}

export async function getPendingArtisans() {
  const users = readUsers();
  const list = users.filter((u) => u.role === "artisan" && u.approved === false);
  return delay({ success: true, artisans: list });
}

export async function approveArtisan(email: string) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.role === "artisan" && u.email === email);
  if (idx === -1) return delay({ success: false, message: "Artisan not found" });
  users[idx].approved = true;
  writeUsers(users);
  return delay({ success: true });
}


