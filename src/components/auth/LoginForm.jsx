
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser, getDashboardPath, getSetupPath } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    setRegistered(
      new URLSearchParams(window.location.search).get("registered") === "1"
    );
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const user = loginUser(form.identifier, form.password);
      const destination = user.profileCompleted
        ? getDashboardPath(user.role)
        : getSetupPath(user.role);

      router.push(destination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {registered && (
        <output className="auth-success">
          Account created. Log in to continue setting up your profile.
        </output>
      )}
      <div className="form-group">
        <label htmlFor="login-identifier">Email or Username</label>
        <input
          id="login-identifier"
          name="identifier"
          value={form.identifier}
          onChange={handleChange}
          placeholder="Enter email or username"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
      </div>

      {error && <p className="auth-error">{error}</p>}

      <button
        type="submit"
        className="auth-submit"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="auth-switch">
        Don't have an account? <Link href="/register">Register</Link>
      </p>
    </form>
  );
}
