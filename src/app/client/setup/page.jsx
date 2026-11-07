"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { completeUserProfile, getCurrentUser, getUserProfile } from "@/lib/auth";

const initialForm = {
  profilePhoto: "",
  phone: "",
  location: "",
  profession: "",
  organizationName: "",
  workDescription: "",
  website: "",
  linkedin: "",
};

export default function ClientSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "client") {
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
      completeUserProfile(user.id, "client", form);
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
          <span className="auth-tag">Client profile</span>
          <h1>Set up your hiring profile</h1>
          <p>Create a strong profile so students can discover your work quickly.</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="setup-grid">
            <label>
              Profile photo URL
              <input name="profilePhoto" value={form.profilePhoto} onChange={handleChange} placeholder="https://..." />
            </label>

            <label>
              Phone number
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
            </label>

            <label>
              Location
              <input name="location" value={form.location} onChange={handleChange} placeholder="Bengaluru, Karnataka" required />
            </label>

            <label>
              Profession
              <input name="profession" value={form.profession} onChange={handleChange} placeholder="Freelance Developer" required />
            </label>

            <label>
              Business / organization name
              <input name="organizationName" value={form.organizationName} onChange={handleChange} placeholder="Optional" />
            </label>

            <label>
              Website / portfolio
              <input name="website" value={form.website} onChange={handleChange} placeholder="https://yourwebsite.com" />
            </label>

            <label>
              LinkedIn
              <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourname" />
            </label>
          </div>

          <label>
            Work description
            <textarea name="workDescription" value={form.workDescription} onChange={handleChange} rows={5} placeholder="Describe the kind of projects or jobs you need help with." required />
          </label>

          <div className="setup-actions">
            <button type="submit" className="auth-submit" disabled={saving}>
              {saving ? "Saving profile..." : "Create client profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
