import { getUserProfile } from "./auth";
import { readStorage, writeStorage } from "./storage";

const OPPORTUNITIES_KEY = "skillbridge_opportunities";
const APPLICATIONS_KEY = "skillbridge_applications";

export function getOpportunities() {
  const opportunities = readStorage(OPPORTUNITIES_KEY, []);
  return Array.isArray(opportunities) ? opportunities : [];
}

export function getApplications(userId) {
  const applications = readStorage(APPLICATIONS_KEY, []);
  const safeApplications = Array.isArray(applications) ? applications : [];
  return userId
    ? safeApplications.filter((application) => application.studentId === userId)
    : safeApplications;
}

export function applyToOpportunity(user, opportunityId) {
  if (!user?.id || user.role !== "student") {
    throw new Error("Log in with a student account to apply.");
  }

  if (
    !getOpportunities().some((opportunity) => opportunity.id === opportunityId)
  ) {
    throw new Error("This opportunity is no longer available.");
  }

  const applications = getApplications();
  if (
    applications.some(
      (application) =>
        application.studentId === user.id &&
        application.opportunityId === opportunityId,
    )
  ) {
    return false;
  }

  writeStorage(APPLICATIONS_KEY, [
    ...applications,
    {
      id: crypto.randomUUID(),
      studentId: user.id,
      opportunityId,
      status: "Applied",
      appliedAt: new Date().toISOString(),
    },
  ]);
  return true;
}

export function getSkillMatchPercent(studentSkills, requiredSkills) {
  const skillList = (
    Array.isArray(studentSkills)
      ? studentSkills
      : String(studentSkills || "").split(",")
  )
    .map((skill) => skill.trim().toLowerCase())
    .filter(Boolean);
  const uniqueStudentSkills = new Set(skillList);
  const uniqueRequiredSkills = [
    ...new Set(
      (Array.isArray(requiredSkills) ? requiredSkills : [])
        .map((skill) => skill.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];

  if (!uniqueRequiredSkills.length) return 0;

  const matchedCount = uniqueRequiredSkills.filter((skill) =>
    uniqueStudentSkills.has(skill),
  ).length;

  return Math.round((matchedCount / uniqueRequiredSkills.length) * 100);
}

export function createOpportunity(user, opportunityData) {
  if (!user?.id) {
    throw new Error("Please log in before posting an opportunity.");
  }

  const allowedCategories = {
    client: ["projects"],
    organization: ["internships", "jobs"],
  };

  if (!allowedCategories[user.role]?.includes(opportunityData.category)) {
    throw new Error("Your account is not allowed to post this opportunity.");
  }

  const profile = getUserProfile(user.id);
  if (
    user.role === "organization" &&
    profile?.verificationStatus !== "verified"
  ) {
    throw new Error("Your organization must be verified before posting.");
  }

  const opportunity = {
    id: crypto.randomUUID(),
    ownerId: user.id,
    ownerRole: user.role,
    publisher:
      user.role === "organization" ? profile.organizationName : user.name,
    ...opportunityData,
    title: opportunityData.title.trim(),
    description: opportunityData.description.trim(),
    skills: opportunityData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    createdAt: new Date().toISOString(),
    status: "open",
  };

  writeStorage(OPPORTUNITIES_KEY, [...getOpportunities(), opportunity]);
  return opportunity;
}
