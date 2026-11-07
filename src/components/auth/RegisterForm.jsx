
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/auth";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.name.trim() || !form.username.trim()) {
      setError("Please enter your name and username.");
      return;
    }

    try {
      setLoading(true);

      registerUser(form);
      router.push("/login?registered=1");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label htmlFor="register-name">Full Name</label>
        <input
          id="register-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-username">Username</label>
        <input
          id="register-username"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Choose a username"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-email">Email Address</label>
        <input
          id="register-email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Create a password"
          minLength={6}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-confirm-password">Confirm Password</label>
        <input
          id="register-confirm-password"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-role">Register As</label>
        <select
          id="register-role"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="student">Student</option>
          <option value="client">Client</option>
          <option value="organization">Organization</option>
        </select>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <button
        type="submit"
        className="auth-submit"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      <p className="auth-switch">
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </form>
  );
}
