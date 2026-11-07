"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, getUserProfile } from "@/lib/auth";
import {
  applyToOpportunity,
  getApplications,
  getOpportunities,
  getSkillMatchPercent,
} from "@/lib/opportunities";

const categories = [
  { id: "internships", label: "Internships" },
  { id: "jobs", label: "Jobs" },
  { id: "projects", label: "Freelance projects" },
];

export default function OpportunityBoard({ category, limit }) {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState([]);
  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    const currentUser = getCurrentUser();
    setOpportunities(getOpportunities());
    setUser(currentUser);

    if (currentUser?.role === "student") {
      setStudentProfile(getUserProfile(currentUser.id));
      setApplications(getApplications(currentUser.id));
    }
  }, []);

  const sortedOpportunities = opportunities
    .filter((opportunity) => !category || opportunity.category === category)
    .slice()
    .sort((first, second) => {
      const firstMatch = getSkillMatchPercent(studentProfile?.skills, first.skills);
      const secondMatch = getSkillMatchPercent(studentProfile?.skills, second.skills);
      return secondMatch - firstMatch ||
        second.createdAt.localeCompare(first.createdAt);
    });
  const visibleOpportunities = limit
    ? sortedOpportunities.slice(0, limit)
    : sortedOpportunities;
  const heading = category
    ? categories.find((item) => item.id === category)?.label || "Opportunities"
    : "Recently posted opportunities";

  function handleApply(opportunityId) {
    setApplyError("");

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      applyToOpportunity(user, opportunityId);
      setApplications(getApplications(user.id));
    } catch (error) {
      setApplyError(error.message);
    }
  }

  return (
    <section className={`market-section${limit ? " market-section-compact" : ""}`}>
      <div className="container">
        <div className="market-heading">
          <div>
            <span className="section-label">SKILLS MEET OPPORTUNITY</span>
            <h2>{heading}</h2>
            <p>Explore opportunities posted by SkillBridge clients and organizations.</p>
          </div>
          {!category && (
            <Link href="/internships" className="text-link">Browse opportunities</Link>
          )}
        </div>

        <nav className="market-tabs" aria-label="Opportunity categories">
          {categories.map((item) => (
            <Link
              href={`/${item.id}`}
              className={`market-tab${category === item.id ? " active" : ""}`}
              key={item.id}
              aria-current={category === item.id ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {visibleOpportunities.length ? (
          <div className="market-grid">
            {visibleOpportunities.map((opportunity) => (
              <article className="market-card" key={opportunity.id}>
                <div className="market-card-top">
                  <span className="market-type">{opportunity.type}</span>
                  <span className="market-status">{opportunity.status}</span>
                </div>
                <h3>{opportunity.title}</h3>
                <p className="market-publisher">{opportunity.publisher}</p>
                <p className="market-description">{opportunity.description}</p>
                <div className="market-meta">
                  <span>{opportunity.location}</span>
                  <span>{opportunity.compensation}</span>
                </div>
                <div className="market-skills">
                  {opportunity.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
                <div className="market-card-footer">
                  {user?.role === "student" && (
                    <span className="market-match">
                      {getSkillMatchPercent(studentProfile?.skills, opportunity.skills)}% skill match
                    </span>
                  )}
                  {user?.role === "student" ? (
                    <button
                      type="button"
                      className="market-apply"
                      onClick={() => handleApply(opportunity.id)}
                      disabled={applications.some(
                        (application) => application.opportunityId === opportunity.id
                      )}
                    >
                      {applications.some(
                        (application) => application.opportunityId === opportunity.id
                      ) ? "Applied" : "Apply"}
                    </button>
                  ) : !user ? (
                    <Link href="/login" className="market-apply">Log in to apply</Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="market-empty">
            <h3>No opportunities posted here yet</h3>
            <p>Check back soon for new listings from clients and organizations.</p>
          </div>
        )}
        {applyError && <p className="auth-error market-apply-error" role="alert">{applyError}</p>}
      </div>
    </section>
  );
}
