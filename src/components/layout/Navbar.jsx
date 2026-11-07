
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  BriefcaseBusiness,
  ArrowRight,
} from "lucide-react";
import { getCurrentUser, getDashboardPath, logoutUser } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    function syncUser() {
      setUser(getCurrentUser());
    }

    syncUser();
    window.addEventListener("skillbridge-auth-change", syncUser);
    return () => window.removeEventListener("skillbridge-auth-change", syncUser);
  }, []);

  function handleLogout() {
    logoutUser();
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Internships", href: "/internships" },
    { name: "Jobs", href: "/jobs" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <div className="logo-icon">
            <BriefcaseBusiness size={23} />
          </div>

          <span>
            Skill<span className="logo-highlight">Bridge</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          {navLinks.map((link) => (
            <Link
              href={link.href}
              key={link.name}
              className="nav-link"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Authentication Buttons */}
        <div className="nav-actions">
          {user ? (
            <>
              <span className="navbar-user">Hi, {user.name}</span>
              <Link href={getDashboardPath(user.role)} className="login-btn">
                Dashboard
              </Link>
              <button type="button" className="login-btn logout-btn" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="login-btn">
                Login
              </Link>
              <Link href="/register" className="register-btn">
                Get Started
                <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mobile-nav">
          {navLinks.map((link) => (
            <Link
              href={link.href}
              key={link.name}
              onClick={() => setMenuOpen(false)}
              className="mobile-nav-link"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                href={getDashboardPath(user.role)}
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button type="button" className="mobile-nav-link mobile-logout" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="register-btn mobile-register"
                onClick={() => setMenuOpen(false)}
              >
                Get Started <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>
      )}

    </header>
  );
}
