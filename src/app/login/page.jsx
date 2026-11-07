import "../auth.css";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <aside className="auth-visual">
          <div className="auth-visual-content">
            <span className="auth-visual-badge">SkillBridge</span>
            <h2>Grow your career with the right opportunities.</h2>
            <p>
              Discover internships, freelance projects, and fresher jobs built for
              your skills and ambitions.
            </p>

            <ul className="auth-points">
              <li>Personalized matches for students and talent</li>
              <li>Build real experience with trusted opportunities</li>
              <li>Connect with clients and organizations faster</li>
            </ul>
          </div>
        </aside>

        <div className="auth-container">
          <div className="auth-heading">
            <span className="auth-tag">WELCOME BACK</span>
            <h1>Login to SkillBridge</h1>
            <p>
              Continue discovering opportunities and growing your career.
            </p>
          </div>

          <LoginForm />

          <p className="auth-home">
            <Link href="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
