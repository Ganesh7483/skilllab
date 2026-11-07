
import "./globals.css";
import "./auth.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "SkillBridge | Student Opportunities",
  description:
    "Find freelance projects, internships and fresher jobs with SkillBridge.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}
