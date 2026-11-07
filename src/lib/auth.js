
import { readStorage, removeStorage, writeStorage } from "./storage";

const USERS_KEY = "skillbridge_users";
const CURRENT_USER_KEY = "skillbridge_current_user";
const PROFILES_KEY = "skillbridge_profiles";

function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("skillbridge-auth-change"));
  }
}

export const DEMO_USERS = [
  {
    id: "demo-student",
    name: "Rahul Sharma",
    username: "student",
    email: "student@skillbridge.demo",
    password: "Student@123",
    role: "student",
    profileCompleted: true,
    status: "active",
  },
  {
    id: "demo-client",
    name: "Aisha Khan",
    username: "client",
    email: "client@skillbridge.demo",
    password: "Client@123",
    role: "client",
    profileCompleted: true,
    status: "active",
  },
  {
    id: "demo-organization",
    name: "SkillBridge Org",
    username: "organization",
    email: "organization@skillbridge.demo",
    password: "Org@123",
    role: "organization",
    profileCompleted: true,
    status: "active",
  },
  {
    id: "demo-admin",
    name: "SkillBridge Admin",
    username: "admin",
    email: "admin@skillbridge.demo",
    password: "Admin@123",
    role: "admin",
    profileCompleted: true,
    status: "active",
  },
];

// Demo admin account. Admin is not available in public registration.
export const ADMIN_ACCOUNT = DEMO_USERS.find((user) => user.role === "admin");

function ensureSeedUsers() {
  if (typeof window === "undefined") return;

  const existingUsers = readStorage(USERS_KEY, []);

  if (existingUsers.length === 0) {
    writeStorage(USERS_KEY, DEMO_USERS);
  }
}

function ensureSeedProfiles() {
  if (typeof window === "undefined") return;

  const profiles = readStorage(PROFILES_KEY, []);
  const seedProfiles = [
    {
      userId: "demo-student",
      role: "student",
      profilePhoto: "",
      college: "National Institute of Technology",
      degree: "B.Tech in Computer Science",
      graduationYear: "2026",
      location: "Bengaluru, Karnataka",
      skills: "React, JavaScript, Python",
      experience: "Fresher",
      preferredWork: "Internship",
      resume: "",
      portfolio: "https://linkedin.com/in/rahulsharma",
      about: "Focused on frontend development and product building.",
    },
    {
      userId: "demo-client",
      role: "client",
      profilePhoto: "",
      phone: "+91 98765 43210",
      location: "Hyderabad, Telangana",
      profession: "Freelance Product Designer",
      organizationName: "Aisha Studio",
      workDescription: "Looking for student designers and frontend developers for short-term freelance work.",
      website: "https://aishastudio.example",
      linkedin: "https://linkedin.com/in/aishakhan",
    },
    {
      userId: "demo-organization",
      role: "organization",
      organizationName: "SkillBridge Labs",
      organizationType: "IT Company",
      officialEmail: "hr@skillbridgelabs.example",
      contactPerson: "Nisha Verma",
      phone: "+91 99887 66554",
      website: "https://skillbridgelabs.example",
      location: "Bengaluru",
      registrationId: "REG-2024-101",
      description: "We help students build real-world products and internship experiences.",
      logo: "",
      verificationStatus: "verified",
    },
  ];

  const missingProfiles = seedProfiles.filter(
    (seedProfile) =>
      !profiles.some((profile) => profile.userId === seedProfile.userId)
  );

  if (missingProfiles.length > 0) {
    writeStorage(PROFILES_KEY, [...profiles, ...missingProfiles]);
  }
}

export function getUsers() {
  ensureSeedUsers();
  return readStorage(USERS_KEY, []);
}

export function getCurrentUser() {
  return readStorage(CURRENT_USER_KEY, null);
}

export function getProfiles() {
  ensureSeedProfiles();
  return readStorage(PROFILES_KEY, []);
}

export function getUserProfile(userId) {
  if (!userId) return null;
  return getProfiles().find((profile) => profile.userId === userId) || null;
}

export function saveUserProfile(profileData) {
  const profiles = getProfiles();
  const existingIndex = profiles.findIndex(
    (profile) => profile.userId === profileData.userId
  );

  const profile = {
    ...(existingIndex >= 0 ? profiles[existingIndex] : {}),
    ...profileData,
  };

  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }

  writeStorage(PROFILES_KEY, profiles);
  return profile;
}

export function completeUserProfile(userId, role, profileData) {
  const users = getUsers();
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    throw new Error("User not found.");
  }

  users[userIndex] = {
    ...users[userIndex],
    role,
    profileCompleted: true,
  };

  writeStorage(USERS_KEY, users);

  const profile = saveUserProfile({
    userId,
    role,
    ...profileData,
  });

  const updatedUser = users[userIndex];
  writeStorage(CURRENT_USER_KEY, updatedUser);
  notifyAuthChange();

  return { user: updatedUser, profile };
}

export function registerUser(userData) {
  const users = getUsers();

  const emailExists = users.some(
    (user) => user.email.toLowerCase() === userData.email.toLowerCase()
  );

  if (emailExists) {
    throw new Error("This email is already registered.");
  }

  const usernameExists = users.some(
    (user) => user.username.toLowerCase() === userData.username.toLowerCase()
  );

  if (usernameExists) {
    throw new Error("This username is already taken.");
  }

  const newUser = {
    id: crypto.randomUUID(),
    name: userData.name.trim(),
    username: userData.username.trim(),
    email: userData.email.trim().toLowerCase(),
    password: userData.password,
    role: userData.role,
    profileCompleted: false,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeStorage(USERS_KEY, users);
  removeStorage(CURRENT_USER_KEY);
  notifyAuthChange();

  return newUser;
}

export function loginUser(identifier, password) {
  const normalizedIdentifier = identifier.trim().toLowerCase();

  if (
    normalizedIdentifier === ADMIN_ACCOUNT.email ||
    normalizedIdentifier === ADMIN_ACCOUNT.username
  ) {
    if (password !== ADMIN_ACCOUNT.password) {
      throw new Error("Incorrect admin password.");
    }

    writeStorage(CURRENT_USER_KEY, ADMIN_ACCOUNT);
    notifyAuthChange();
    return ADMIN_ACCOUNT;
  }

  const users = getUsers();

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === normalizedIdentifier ||
      item.username.toLowerCase() === normalizedIdentifier
  );

  if (!user || user.password !== password) {
    throw new Error("Invalid username/email or password.");
  }

  if (user.status !== "active") {
    throw new Error("Your account is currently inactive.");
  }

  writeStorage(CURRENT_USER_KEY, user);
  notifyAuthChange();
  return user;
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CURRENT_USER_KEY);
  notifyAuthChange();
}

export function getSetupPath(role) {
  const routes = {
    student: "/student/setup",
    client: "/client/setup",
    organization: "/organization/setup",
    admin: "/admin/dashboard",
  };

  return routes[role] || "/login";
}

export function getDashboardPath(role) {
  const routes = {
    student: "/student/dashboard",
    client: "/client/dashboard",
    organization: "/organization/dashboard",
    admin: "/admin/dashboard",
  };

  return routes[role] || "/login";
}
