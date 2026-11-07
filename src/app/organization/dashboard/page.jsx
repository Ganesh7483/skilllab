"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getUserProfile } from "@/lib/auth";
import { getOpportunities } from "@/lib/opportunities";

export default function OrganizationDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser || currentUser.role !== "organization") {
      router.push("/login");
      return;
    }

    setUser(currentUser);
    setProfile(getUserProfile(currentUser.id));
    setListings(getOpportunities().filter((listing) => listing.ownerId === currentUser.id));
  }, [router]);

  if (!user) return null;

  const verificationStatus = profile?.verificationStatus || "pending";
  const internshipCount = listings.filter(
    (listing) => listing.category === "internships",
  ).length;
  const jobCount = listings.filter((listing) => listing.category === "jobs").length;

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="dashboard-brand">SkillBridge</div>
          <nav className="dashboard-nav">
            <Link href="/organization/dashboard">Overview</Link>
            <Link href="/organization/setup">Edit profile</Link>
            <Link href="/">Home</Link>
          </nav>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-header dashboard-role-header organization-dashboard-header">
            <div>
              <p className="eyebrow">Organization hiring workspace</p>
              <h1>{profile?.organizationName || "Your organization"}</h1>
              <p className="dashboard-header-copy">
                Create internships and early-career jobs, then publish them directly to student opportunity tabs.
              </p>
            </div>
            <span className={`status-pill ${verificationStatus === "verified" ? "green" : ""}`}>
              {verificationStatus}
            </span>
          </header>

          <div className="dashboard-stats">
            <div className="stat-card">
              <strong>{internshipCount}</strong>
              <span>Internships posted</span>
            </div>
            <div className="stat-card">
              <strong>{jobCount}</strong>
              <span>Jobs posted</span>
            </div>
            <div className="stat-card">
              <strong>{listings.filter((listing) => listing.status === "open").length}</strong>
              <span>Published opportunities</span>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <h3>Organization details</h3>
              <p>{profile?.organizationType || "Organization type"}</p>
              <p>{profile?.location || "Location not set"}</p>
              <p>{profile?.officialEmail || "Official email"}</p>
            </div>

            <div className="info-card">
              <h3>Verification</h3>
              <p>Status: {verificationStatus}</p>
              <p>{profile?.website || "Website not added"}</p>
              <p>{profile?.description || "Description pending"}</p>
            </div>
          </div>

          <div className="section-title-row">
            <div>
              <p className="eyebrow">Manage your listings</p>
              <h2>Internships and jobs</h2>
            </div>
            {verificationStatus === "verified" ? (
              <div className="dashboard-action-group">
                <Link
                  href="/organization/opportunities/new?type=Internship"
                  className="secondary-button"
                >
                  Post internship
                </Link>
                <Link
                  href="/organization/opportunities/new?type=Part-time%20Job"
                  className="primary-button"
                >
                  Post a job
                </Link>
              </div>
            ) : (
              <span className="status-pill">Posting opens after verification</span>
            )}
          </div>

          <div className="opportunity-list">
            {listings.length === 0 && (
              <article className="opportunity-card">
                <h3>No student opportunities published yet</h3>
                <p className="company-name">
                  Once your organization is verified, create an internship or job and it will appear in the matching website tab.
                </p>
              </article>
            )}
            {listings.map((listing) => (
              <article className="opportunity-card" key={listing.title}>
                <div className="card-top">
                  <div>
                    <p className="tag">{listing.type}</p>
                    <h3>{listing.title}</h3>
                  </div>
                  <span className="match-pill">{listing.status}</span>
                </div>

                <p className="company-name">
                  {listing.location} · {listing.workMode} · {listing.compensation}
                </p>
                <p className="dashboard-description">{listing.description}</p>
                <div className="skill-tags">
                  {listing.skills.map((skill) => <span key={skill}>{skill}</span>)}
                </div>
                <Link
                  href={`/${listing.category}`}
                  className="primary-button small-btn"
                >
                  View in {listing.category}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
