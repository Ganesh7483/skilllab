"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { completeUserProfile, getCurrentUser, getUserProfile } from "@/lib/auth";

const initialForm = {
  profilePhoto: "",
  college: "",
  degree: "",
  graduationYear: "",
  location: "",
  skills: "",
  experience: "Fresher",
  preferredWork: "Internship",
  resume: "",
  portfolio: "",
  about: "",
};

export default function StudentSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "student") {
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
      completeUserProfile(user.id, "student", form);
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
          <span className="auth-tag">Student profile</span>
          <h1>Complete your student profile</h1>
          <p>Tell employers about your academic background, skills and goals.</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="setup-grid">
            <label>
              Profile photo URL
              <input
                name="profilePhoto"
                value={form.profilePhoto}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>

            <label>
              College
              <input
                name="college"
                value={form.college}
                onChange={handleChange}
                placeholder="Your college name"
                required
              />
            </label>

            <label>
              Degree / Program
              <input
                name="degree"
                value={form.degree}
                onChange={handleChange}
                placeholder="B.Tech in Computer Science"
                required
              />
            </label>

            <label>
              Graduation year
              <input
                name="graduationYear"
                type="number"
                value={form.graduationYear}
                onChange={handleChange}
                placeholder="2026"
                required
              />
            </label>

            <label>
              Location
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Bengaluru, Karnataka"
                required
              />
            </label>

            <label>
              Skills
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, Python"
                required
              />
            </label>

            <label>
              Experience
              <select name="experience" value={form.experience} onChange={handleChange} required>
                <option value="Fresher">Fresher</option>
                <option value="Experienced">Experienced</option>
              </select>
            </label>

            <label>
              Preferred work
              <select name="preferredWork" value={form.preferredWork} onChange={handleChange} required>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
              </select>
            </label>

            <label>
              Resume link
              <input
                name="resume"
                value={form.resume}
                onChange={handleChange}
                placeholder="Google Drive / PDF link"
              />
            </label>

            <label>
              Portfolio / LinkedIn
              <input
                name="portfolio"
                value={form.portfolio}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourname"
              />
            </label>
          </div>

          <label>
            About you
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows={5}
              placeholder="Write a short introduction about your skills and career goals."
            />
          </label>

          <div className="setup-actions">
            <button type="submit" className="auth-submit" disabled={saving}>
              {saving ? "Saving profile..." : "Save profile & continue"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
