"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { completeUserProfile, getCurrentUser, getUserProfile } from "@/lib/auth";

const initialForm = {
  organizationName: "",
  organizationType: "IT Company",
  officialEmail: "",
  contactPerson: "",
  phone: "",
  website: "",
  location: "",
  registrationId: "",
  description: "",
  logo: "",
  verificationStatus: "pending",
};

export default function OrganizationSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "organization") {
      router.push("/login");
      return;
    }

    const existingProfile = getUserProfile(user.id);
    if (existingProfile) {
      setForm((prev) => ({ ...prev, ...existingProfile }));
    }
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    setSaving(true);

    try {
      completeUserProfile(user.id, "organization", {
        ...form,
        verificationStatus: "pending",
      });
      router.push("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="profile-setup-page">
      <div className="setup-card">
        <div className="setup-header">
          <span className="auth-tag">Organization profile</span>
          <h1>Set up your organization</h1>
          <p>Share your company details and start publishing opportunities after verification.</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="setup-grid">
            <label>
              Organization name
              <input name="organizationName" value={form.organizationName} onChange={handleChange} placeholder="ABC Technologies" required />
            </label>

            <label>
              Organization type
              <select name="organizationType" value={form.organizationType} onChange={handleChange} required>
                <option value="IT Company">IT Company</option>
                <option value="Startup">Startup</option>
                <option value="Educational Institution">Educational Institution</option>
                <option value="Consultancy">Consultancy</option>
              </select>
            </label>

            <label>
              Official email
              <input name="officialEmail" type="email" value={form.officialEmail} onChange={handleChange} placeholder="hr@company.com" required />
            </label>

            <label>
              Contact person
              <input name="contactPerson" value={form.contactPerson} onChange={handleChange} placeholder="HR Manager" required />
            </label>

            <label>
              Phone number
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9988776655" required />
            </label>

            <label>
              Website
              <input name="website" value={form.website} onChange={handleChange} placeholder="https://company.com" />
            </label>

            <label>
              Location
              <input name="location" value={form.location} onChange={handleChange} placeholder="Bengaluru" required />
            </label>

            <label>
              Registration ID
              <input name="registrationId" value={form.registrationId} onChange={handleChange} placeholder="GST / CIN / registration number" />
            </label>

            <label>
              Logo URL
              <input name="logo" value={form.logo} onChange={handleChange} placeholder="https://..." />
            </label>
          </div>

          <label>
            About company
            <textarea name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Write a short description about your company and hiring needs." required />
          </label>

          <div className="setup-actions">
            <button type="submit" className="auth-submit" disabled={saving}>
              {saving ? "Submitting..." : "Submit for verification"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
