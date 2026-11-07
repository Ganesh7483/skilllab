import "../auth.css";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-heading">
          <span className="auth-tag">JOIN SKILLBRIDGE</span>
          <h1>Create your account</h1>
          <p>
            Connect your skills with real-world opportunities.
          </p>
        </div>

        <RegisterForm />

        <p className="auth-home">
          <Link href="/">← Back to Home</Link>
        </p>
      </div>
    </main>
  );
}
