"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOpportunity } from "@/lib/opportunities";
import { getCurrentUser, getUserProfile } from "@/lib/auth";

const initialForm = {
  type: "Internship",
  title: "",
  description: "",
  skills: "",
  location: "",
  workMode: "Remote",
  duration: "",
  compensation: "",
  deadline: "",
  eligibility: "",
  deliveryDate: "",
};

export default function CreateOpportunityForm({ accountRole }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [organizationVerified, setOrganizationVerified] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser || currentUser.role !== accountRole) {
      router.replace("/login");
      return;
    }

    setUser(currentUser);

    if (accountRole === "organization") {
      const profile = getUserProfile(currentUser.id);
      setOrganizationVerified(profile?.verificationStatus === "verified");
      const requestedType = new URLSearchParams(window.location.search).get("type");
      if (["Internship", "Part-time Job", "Fresher Job"].includes(requestedType)) {
        setForm((previous) => ({ ...previous, type: requestedType }));
      }
    }

    setCheckingAccess(false);
  }, [accountRole, router]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!user) {
      router.replace("/login");
      return;
    }

    const category = accountRole === "client"
      ? "projects"
      : form.type === "Internship"
        ? "internships"
        : "jobs";

    setSaving(true);

    try {
      createOpportunity(user, {
        ...form,
        category,
        type: accountRole === "client" ? "Freelance Project" : form.type,
      });
      router.push(`/${category}`);
    } catch (submitError) {
      setError(submitError.message);
      setSaving(false);
    }
  }

  if (checkingAccess) return null;

  if (accountRole === "organization" && !organizationVerified) {
    return (
      <section className="posting-card">
        <span className="auth-tag">Organization posting</span>
        <h1>Verification required</h1>
        <p>
          Your organization profile must be verified before you can publish
          internships or jobs.
        </p>
        <Link className="primary-button" href="/organization/dashboard">
          Return to dashboard
        </Link>
      </section>
    );
  }

  return (
    <section className="posting-card">
      <div className="posting-heading">
        <span className="auth-tag">
          {accountRole === "client" ? "Freelance opportunity" : "Organization opportunity"}
        </span>
        <h1>
          {accountRole === "client" ? "Post a student freelance project" : "Create an opportunity"}
        </h1>
        <p>
          {accountRole === "client"
            ? "Share a small project and find students with the skills to deliver it."
            : "Create an internship or job listing for students and recent graduates."}
        </p>
      </div>

      <form className="opportunity-form" onSubmit={handleSubmit}>
        {accountRole === "organization" && (
          <label>
            Opportunity type
            <select name="type" value={form.type} onChange={handleChange} required>
              <option value="Internship">Internship</option>
              <option value="Part-time Job">Part-time job</option>
              <option value="Fresher Job">Fresher job</option>
            </select>
          </label>
        )}

        <label>
          Opportunity title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={accountRole === "client" ? "Build a responsive landing page" : "Frontend developer intern"}
            required
            maxLength={100}
          />
        </label>

        <label>
          Description and responsibilities
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the work, expectations, and what the student will learn or deliver."
            rows={5}
            required
            maxLength={2000}
          />
        </label>

        <label>
          Required skills (comma separated)
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, JavaScript, CSS"
            required
          />
        </label>

        <div className="posting-grid">
          <label>
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Bengaluru or Remote"
              required
            />
          </label>

          <label>
            Work arrangement
            <select name="workMode" value={form.workMode} onChange={handleChange} required>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </label>

          <label>
            {accountRole === "client" ? "Project budget" : "Stipend / salary"}
            <input
              name="compensation"
              value={form.compensation}
              onChange={handleChange}
              placeholder={accountRole === "client" ? "₹5,000 fixed" : "₹10,000 per month"}
              required
            />
          </label>

          <label>
            {accountRole === "client" ? "Expected delivery date" : "Duration"}
            <input
              name={accountRole === "client" ? "deliveryDate" : "duration"}
              type={accountRole === "client" ? "date" : "text"}
              value={accountRole === "client" ? form.deliveryDate : form.duration}
              onChange={handleChange}
              placeholder={accountRole === "client" ? undefined : "3 months"}
              required
            />
          </label>

          {accountRole === "organization" ? (
            <label>
              Application deadline
              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                required
              />
            </label>
          ) : (
            <label>
              Experience level
              <select name="eligibility" value={form.eligibility} onChange={handleChange} required>
                <option value="">Select experience level</option>
                <option value="Student / Fresher">Student / Fresher</option>
                <option value="Some experience">Some experience</option>
              </select>
            </label>
          )}
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <div className="posting-actions">
          <button type="submit" className="auth-submit" disabled={saving}>
            {saving ? "Publishing..." : "Publish opportunity"}
          </button>
          <Link
            className="posting-cancel"
            href={accountRole === "client" ? "/client/dashboard" : "/organization/dashboard"}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
