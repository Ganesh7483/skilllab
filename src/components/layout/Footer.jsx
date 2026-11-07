
import Link from "next/link";
import {
  BriefcaseBusiness,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-brand">

          <Link href="/" className="footer-logo">
            <div className="logo-icon">
              <BriefcaseBusiness size={22} />
            </div>

            <span>
              Skill<span className="logo-highlight">Bridge</span>
            </span>
          </Link>

          <p>
            Connecting student skills with real-world
            opportunities. Learn, work, grow and build
            your future with SkillBridge.
          </p>



        </div>

        {/* Platform Links */}
        <div className="footer-column">
          <h3>Platform</h3>

          <Link href="/projects">Freelance Projects</Link>
          <Link href="/internships">Internships</Link>
          <Link href="/jobs">Fresher Jobs</Link>
          <Link href="/skills">Browse Skills</Link>
        </div>

        {/* Company Links */}
        <div className="footer-column">
          <h3>Company</h3>

          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>

        {/* User Links */}
        <div className="footer-column">
          <h3>Get Started</h3>

          <Link href="/register">
            Join as Student <ArrowUpRight size={14} />
          </Link>

          <Link href="/register">
            Join as Client <ArrowUpRight size={14} />
          </Link>

          <Link href="/register">
            Join as Organization <ArrowUpRight size={14} />
          </Link>
        </div>

      </div>

      

    </footer>
  );
}
