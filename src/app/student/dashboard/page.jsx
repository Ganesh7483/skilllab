"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getUserProfile } from "@/lib/auth";
import {
  applyToOpportunity,
  getApplications,
  getOpportunities,
  getSkillMatchPercent,
} from "@/lib/opportunities";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser || currentUser.role !== "student") {
      router.push("/login");
      return;
    }

    setUser(currentUser);
    setProfile(getUserProfile(currentUser.id));
    setOpportunities(getOpportunities());
    setApplications(getApplications(currentUser.id));
  }, [router]);

  if (!user) return null;

  const recommendedOpportunities = opportunities
    .slice()
    .sort(
      (first, second) =>
        getSkillMatchPercent(profile?.skills, second.skills) -
          getSkillMatchPercent(profile?.skills, first.skills) ||
        second.createdAt.localeCompare(first.createdAt),
    )
    .slice(0, 6);

  function handleApply(opportunityId) {
    setApplyError("");

    try {
      applyToOpportunity(user, opportunityId);
      setApplications(getApplications(user.id));
    } catch (error) {
      setApplyError(error.message);
    }
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="dashboard-brand">SkillBridge</div>
          <nav className="dashboard-nav">
            <Link href="/student/dashboard">Overview</Link>
            <Link href="/student/setup">Edit profile</Link>
            <Link href="/internships">Internships</Link>
            <Link href="/jobs">Jobs</Link>
            <Link href="/projects">Freelance projects</Link>
            <Link href="/">Home</Link>
          </nav>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <p className="eyebrow">Student dashboard</p>
              <h1>Welcome back, {user.name}</h1>
            </div>
            <span className="status-pill">Profile active</span>
          </header>

          <div className="dashboard-stats">
            <div className="stat-card">
              <strong>{opportunities.length}</strong>
              <span>Available opportunities</span>
            </div>
            <div className="stat-card">
              <strong>{applications.length}</strong>
              <span>Applications</span>
            </div>
            <div className="stat-card">
              <strong>{profile?.preferredWork || "Any"}</strong>
              <span>Preferred work</span>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <h3>Profile summary</h3>
              <p>{profile?.college || "Your college"}</p>
              <p>{profile?.degree || "Degree not added yet"}</p>
              <p>{profile?.skills || "Add your skills"}</p>
            </div>

            <div className="info-card">
              <h3>Career goals</h3>
              <p>{profile?.preferredWork || "Internship"}</p>
              <p>{profile?.location || "Location not added yet"}</p>
              <p>{profile?.portfolio || "Portfolio not added yet"}</p>
            </div>
          </div>

          <div className="section-title-row">
            <h2>Recommended opportunities</h2>
            <Link href="/internships" className="secondary-button">Browse all</Link>
          </div>

          <div className="opportunity-list">
            {recommendedOpportunities.length === 0 && (
              <article className="opportunity-card dashboard-empty-card">
                <h3>No opportunities available yet</h3>
                <p className="company-name">
                  Browse the category tabs to check for new internships, jobs, and freelance projects.
                </p>
              </article>
            )}
            {recommendedOpportunities.map((opportunity) => (
              <article className="opportunity-card" key={opportunity.id}>
                <div className="card-top">
                  <div>
                    <p className="tag">{opportunity.type}</p>
                    <h3>{opportunity.title}</h3>
                  </div>
                  <span className="match-pill">
                    {getSkillMatchPercent(profile?.skills, opportunity.skills)}% match
                  </span>
                </div>

                <p className="company-name">
                  {opportunity.publisher} · {opportunity.location}
                </p>
                <p className="dashboard-description">{opportunity.description}</p>
                <div className="skill-tags">
                  {opportunity.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

                <div className="dashboard-card-actions">
                  <Link href={`/${opportunity.category}`} className="secondary-button small-btn">
                    Open {opportunity.category}
                  </Link>
                  <button
                    type="button"
                    className="primary-button small-btn"
                    onClick={() => handleApply(opportunity.id)}
                    disabled={applications.some(
                      (application) => application.opportunityId === opportunity.id,
                    )}
                  >
                    {applications.some(
                      (application) => application.opportunityId === opportunity.id,
                    )
                      ? "Applied"
                      : "Apply"}
                  </button>
                </div>
              </article>
            ))}
          </div>
          {applyError && <p className="auth-error" role="alert">{applyError}</p>}
        </section>
      </div>
    </main>
  );
}
