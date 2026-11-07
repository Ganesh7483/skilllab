"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getProfiles, getUsers } from "@/lib/auth";
import { writeStorage } from "@/lib/storage";
import { getOpportunities } from "@/lib/opportunities";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login");
      return;
    }

    setUser(currentUser);
    setUsers(getUsers());
    setProfiles(getProfiles());
    setOpportunities(getOpportunities());
  }, [router]);

  function updateVerification(userId, status) {
    const currentProfiles = getProfiles();
    const nextProfiles = currentProfiles.map((profile) =>
      profile.userId === userId ? { ...profile, verificationStatus: status } : profile
    );

    writeStorage("skillbridge_profiles", nextProfiles);
    setProfiles(nextProfiles);
  }

  if (!user) return null;

  const orgProfiles = profiles.filter((profile) => profile.role === "organization");
  const students = users.filter((account) => account.role === "student");
  const clients = users.filter((account) => account.role === "client");
  const organizations = users.filter((account) => account.role === "organization");
  const pendingOrganizations = orgProfiles.filter(
    (profile) => (profile.verificationStatus || "pending") === "pending",
  );
  const internships = opportunities.filter((item) => item.category === "internships");
  const jobs = opportunities.filter((item) => item.category === "jobs");
  const projects = opportunities.filter((item) => item.category === "projects");
  const profileByUserId = new Map(
    profiles.map((profile) => [profile.userId, profile]),
  );

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="dashboard-brand">SkillBridge Admin</div>
          <nav className="dashboard-nav">
            <Link href="/admin/dashboard">Overview</Link>
            <a href="#role-overview">Role overview</a>
            <a href="#verification">Organization verification</a>
            <a href="#opportunities">Opportunity listings</a>
            <Link href="/">Home</Link>
          </nav>
        </aside>

        <section className="dashboard-main admin-dashboard">
          <header className="dashboard-header dashboard-role-header">
            <div>
              <p className="eyebrow">Platform administration</p>
              <h1>SkillBridge overview</h1>
              <p className="dashboard-header-copy">
                Review the people, organizations, and opportunities using the platform.
              </p>
            </div>
            <span className="status-pill">Admin</span>
          </header>

          <div className="dashboard-stats admin-dashboard-stats">
            <div className="stat-card">
              <strong>{students.length}</strong>
              <span>Students</span>
            </div>
            <div className="stat-card">
              <strong>{clients.length}</strong>
              <span>Clients</span>
            </div>
            <div className="stat-card">
              <strong>{organizations.length}</strong>
              <span>Organizations</span>
            </div>
            <div className="stat-card">
              <strong>{opportunities.length}</strong>
              <span>Published opportunities</span>
            </div>
          </div>

          <div className="admin-section-heading" id="role-overview">
            <p className="eyebrow">People and profiles</p>
            <h2>Role overview</h2>
            <p>Review the registered users and their submitted profile information.</p>
          </div>

          <div className="admin-user-grid">
            {users
              .filter((account) => account.role !== "admin")
              .map((account) => {
                const profile = profileByUserId.get(account.id);

                return (
                  <article className="admin-user-card" key={account.id}>
                    <div className="admin-user-card-heading">
                      <div>
                        <span className="admin-role-label">{account.role}</span>
                        <h3>{account.name}</h3>
                      </div>
                      <span className="status-pill">{account.status || "active"}</span>
                    </div>
                    <p>{account.email}</p>
                    {account.role === "student" && (
                      <>
                        <p>{profile?.college || "College not provided"}</p>
                        <p>Skills: {profile?.skills || "Not provided"}</p>
                      </>
                    )}
                    {account.role === "client" && (
                      <>
                        <p>{profile?.profession || "Profession not provided"}</p>
                        <p>{profile?.location || "Location not provided"}</p>
                      </>
                    )}
                    {account.role === "organization" && (
                      <>
                        <p>{profile?.organizationName || "Organization profile pending"}</p>
                        <p>{profile?.location || "Location not provided"}</p>
                        <p>
                          Verification: {profile?.verificationStatus || "profile incomplete"}
                        </p>
                      </>
                    )}
                  </article>
                );
              })}
          </div>

          <div className="admin-section-heading" id="verification">
            <p className="eyebrow">Organization access</p>
            <h2>Verification requests</h2>
            <p>{pendingOrganizations.length} organization(s) waiting for review.</p>
          </div>

          <div className="admin-list">
            {orgProfiles.length === 0 ? (
              <article className="admin-empty">No organization profiles submitted yet.</article>
            ) : (
              orgProfiles.map((profile) => {
                const account = users.find((item) => item.id === profile.userId);

                return (
                  <article className="admin-list-card" key={profile.userId}>
                    <div>
                      <span className="admin-role-label">
                        {profile.organizationType || "Organization"}
                      </span>
                      <h3>{profile.organizationName || account?.name || "Organization"}</h3>
                      <p>{account?.email || profile.officialEmail}</p>
                      <p>
                        {profile.location || "Location not provided"} · {profile.registrationId || "Registration ID not provided"}
                      </p>
                    </div>
                    <div className="admin-list-actions">
                      <span className={`status-pill ${profile.verificationStatus === "verified" ? "green" : ""}`}>
                        {profile.verificationStatus || "pending"}
                      </span>
                      <button
                        type="button"
                        className="primary-button small-btn"
                        onClick={() => updateVerification(profile.userId, "verified")}
                      >
                        Verify
                      </button>
                      <button
                        type="button"
                        className="secondary-button small-btn"
                        onClick={() => updateVerification(profile.userId, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <div className="admin-section-heading" id="opportunities">
            <p className="eyebrow">Marketplace</p>
            <h2>Opportunity listings</h2>
            <p>Current postings created by clients and verified organizations.</p>
          </div>

          <div className="dashboard-stats admin-listing-stats">
            <Link href="/internships" className="stat-card">
              <strong>{internships.length}</strong>
              <span>Internships</span>
            </Link>
            <Link href="/jobs" className="stat-card">
              <strong>{jobs.length}</strong>
              <span>Jobs</span>
            </Link>
            <Link href="/projects" className="stat-card">
              <strong>{projects.length}</strong>
              <span>Freelance projects</span>
            </Link>
          </div>

          <div className="admin-list">
            {opportunities.length === 0 ? (
              <article className="admin-empty">No opportunities have been posted yet.</article>
            ) : (
              opportunities
                .slice()
                .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
                .map((opportunity) => {
                  const owner = users.find((account) => account.id === opportunity.ownerId);

                  return (
                    <article className="admin-list-card" key={opportunity.id}>
                      <div>
                        <span className="admin-role-label">{opportunity.type}</span>
                        <h3>{opportunity.title}</h3>
                        <p>
                          {opportunity.publisher} · {owner?.role || opportunity.ownerRole}
                        </p>
                        <p>{opportunity.location} · {opportunity.compensation}</p>
                      </div>
                      <Link
                        href={`/${opportunity.category}`}
                        className="secondary-button small-btn"
                      >
                        View listing
                      </Link>
                    </article>
                  );
                })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
