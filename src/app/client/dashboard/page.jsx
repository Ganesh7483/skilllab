"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getUserProfile } from "@/lib/auth";
import { getOpportunities } from "@/lib/opportunities";

export default function ClientDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser || currentUser.role !== "client") {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    setProfile(getUserProfile(currentUser.id));
    setJobs(
      getOpportunities().filter(
        (job) => job.ownerId === currentUser.id && job.category === "projects",
      ),
    );
  }, [router]);

  if (!user) return null;

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="dashboard-brand">SkillBridge</div>
          <nav className="dashboard-nav">
            <Link href="/client/dashboard">Overview</Link>
            <Link href="/client/setup">Edit profile</Link>
            <Link href="/">Home</Link>
          </nav>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-header dashboard-role-header client-dashboard-header">
            <div>
              <p className="eyebrow">Freelance client workspace</p>
              <h1>Find student talent for your next project</h1>
              <p className="dashboard-header-copy">
                Post a small freelance opportunity and make it visible in the student projects tab.
              </p>
            </div>
            <Link href="/client/opportunities/new" className="primary-button">
              Post a project
            </Link>
          </header>

          <div className="dashboard-stats">
            <div className="stat-card">
              <strong>{jobs.length}</strong>
              <span>Your freelance projects</span>
            </div>
            <div className="stat-card">
              <strong>{jobs.filter((job) => job.status === "open").length}</strong>
              <span>Currently published</span>
            </div>
            <div className="stat-card">
              <strong>Students</strong>
              <span>Audience for your projects</span>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <h3>Business info</h3>
              <p>{profile?.organizationName || "Individual freelancer"}</p>
              <p>{profile?.profession || "Your profession"}</p>
              <p>{profile?.location || "Location not set"}</p>
            </div>

            <div className="info-card">
              <h3>Hire preferences</h3>
              <p>{profile?.workDescription || "Describe your hiring needs"}</p>
              <p>{profile?.website || "Portfolio link not added"}</p>
            </div>
          </div>

          <div className="section-title-row">
            <div>
              <p className="eyebrow">Your posts</p>
              <h2>Freelance projects</h2>
            </div>
            <Link href="/projects" className="secondary-button">
              View projects tab
            </Link>
          </div>

          <div className="opportunity-list">
            {jobs.length === 0 && (
              <article className="opportunity-card">
                <h3>Your first student project starts here</h3>
                <p className="company-name">
                  Add the task, budget, skills, and due date. Published projects appear in the Projects tab.
                </p>
                <Link href="/client/opportunities/new" className="primary-button small-btn">
                  Create freelance project
                </Link>
              </article>
            )}
            {jobs.map((job) => (
              <article className="opportunity-card" key={job.title}>
                <div className="card-top">
                  <div>
                    <p className="tag">{job.type}</p>
                    <h3>{job.title}</h3>
                  </div>
                  <span className="match-pill">{job.status}</span>
                </div>

                <p className="company-name">
                  {job.location} · Budget: {job.compensation} · Due {job.deliveryDate}
                </p>
                <p className="dashboard-description">{job.description}</p>
                <div className="skill-tags">
                  {job.skills.map((skill) => <span key={skill}>{skill}</span>)}
                </div>
                <Link href="/projects" className="primary-button small-btn">
                  View in Projects
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
