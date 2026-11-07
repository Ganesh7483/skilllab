
import Link from "next/link";
import {
  Search,
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  Palette,
  Database,
  Megaphone,
  MapPin,
  Clock,
  IndianRupee,
  Sparkles,
  Users,
  Building2,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import OpportunityBoard from "@/components/opportunities/OpportunityBoard";

const categories = [
  {
    title: "Freelance Projects",
    description: "Work on real projects and earn money.",
    count: "Explore projects",
    icon: BriefcaseBusiness,
    color: "blue",
    href: "/projects",
  },
  {
    title: "Internships",
    description: "Gain practical experience and learn.",
    count: "Explore internships",
    icon: GraduationCap,
    color: "purple",
    href: "/internships",
  },
  {
    title: "Fresher Jobs",
    description: "Find your first professional opportunity.",
    count: "Explore jobs",
    icon: Rocket,
    color: "green",
    href: "/jobs",
  },
];

const skills = [
  { name: "Web Development", icon: Code2 },
  { name: "UI/UX Design", icon: Palette },
  { name: "Python", icon: Database },
  { name: "Digital Marketing", icon: Megaphone },
];

const opportunities = [
  {
    id: 1,
    title: "React Developer - Landing Page",
    company: "Creative Solutions",
    type: "Freelance Project",
    location: "Remote",
    budget: "₹2,000",
    duration: "1 Week",
    skills: ["React", "CSS", "JavaScript"],
    icon: Code2,
    color: "blue",
  },
  {
    id: 2,
    title: "Python Development Intern",
    company: "Tech Innovations",
    type: "Internship",
    location: "Remote",
    budget: "₹8,000/month",
    duration: "3 Months",
    skills: ["Python", "Django", "SQL"],
    icon: Database,
    color: "purple",
  },
  {
    id: 3,
    title: "Junior UI/UX Designer",
    company: "Design Studio",
    type: "Fresher Job",
    location: "Bengaluru",
    budget: "₹3 LPA",
    duration: "Full-time",
    skills: ["Figma", "UI Design", "Prototyping"],
    icon: Palette,
    color: "green",
  },
];

export default function Home() {
  return (
    <main>

      {/* HERO SECTION */}
      <section className="hero-section">

        <div className="hero-bg-circle circle-one"></div>
        <div className="hero-bg-circle circle-two"></div>

        <div className="container hero-container">

          <div className="hero-content">

            <div className="hero-badge">
              <Sparkles size={15} />
              Your career journey starts here
            </div>

            <h1>
              Your Skills.
              <br />
              Your Future.
              <br />
              <span>One Bridge Away.</span>
            </h1>

            <p className="hero-description">
              Discover freelance projects, internships and
              fresher jobs that match your skills. Turn what
              you learn into real-world opportunities.
            </p>

            <div className="hero-buttons">

              <Link href="/projects" className="primary-button">
                Explore Opportunities
                <ArrowRight size={18} />
              </Link>

              <Link href="/register" className="secondary-button">
                Join SkillBridge
              </Link>

            </div>

            <div className="hero-trust">

              <div className="trust-item">
                <CheckCircle2 size={17} />
                Skill-based opportunities
              </div>

              <div className="trust-item">
                <CheckCircle2 size={17} />
                Student-friendly platform
              </div>

            </div>

          </div>

          {/* Hero Illustration */}
          <div className="hero-visual">

            <div className="visual-glow"></div>

            <div className="hero-illustration">

              <div className="illustration-icon main-icon">
                <BriefcaseBusiness size={54} />
              </div>

              <div className="floating-card floating-top">
                <div className="floating-icon purple-icon">
                  <GraduationCap size={22} />
                </div>

                <div>
                  <strong>New Internship</strong>
                  <p>Opportunity waiting</p>
                </div>
              </div>

              <div className="floating-card floating-bottom">
                <div className="floating-icon green-icon">
                  <IndianRupee size={22} />
                </div>

                <div>
                  <strong>Earn with Skills</strong>
                  <p>Build your experience</p>
                </div>
              </div>

              <div className="visual-dots"></div>

            </div>

          </div>

        </div>
      </section>


      {/* SEARCH SECTION */}
      <section className="search-section">

        <div className="container">

          <div className="search-box">

            <div className="search-input-group">
              <Search size={21} />

              <input
                type="text"
                placeholder="What skill or opportunity are you looking for?"
                aria-label="Search opportunities"
              />
            </div>

            <select aria-label="Opportunity category" defaultValue="all">
              <option value="all">All Opportunities</option>
              <option value="project">Projects</option>
              <option value="internship">Internships</option>
              <option value="job">Jobs</option>
            </select>

            <button type="button" className="search-button">
              Search
            </button>

          </div>

          <div className="popular-searches">
            <span>Popular skills:</span>

            {skills.map((skill) => (
              <span key={skill.name} className="popular-skill">
                {skill.name}
              </span>
            ))}

          </div>

        </div>
      </section>


      {/* CATEGORIES SECTION */}
      <section className="categories-section section-padding">

        <div className="container">

          <div className="section-heading">

            <div>
              <span className="section-label">EXPLORE OPPORTUNITIES</span>

              <h2>
                Find the right opportunity
                <span> for you.</span>
              </h2>

              <p>
                Whether you want to earn, learn or start
                your career, we have a place for you.
              </p>
            </div>

            <Link href="/projects" className="text-link">
              Explore all <ArrowRight size={17} />
            </Link>

          </div>

          <div className="category-grid">

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  href={category.href}
                  className="category-card"
                  key={category.title}
                >

                  <div className={`category-icon ${category.color}`}>
                    <Icon size={28} />
                  </div>

                  <h3>{category.title}</h3>

                  <p>{category.description}</p>

                  <div className="category-link">
                    {category.count}
                    <ArrowRight size={17} />
                  </div>

                </Link>
              );
            })}

          </div>

        </div>
      </section>


      {/* FEATURED OPPORTUNITIES */}
      <section className="featured-section section-padding">

        <div className="container">

          <div className="section-heading">

            <div>
              <span className="section-label">HANDPICKED FOR YOU</span>

              <h2>
                Featured <span>opportunities.</span>
              </h2>

              <p>
                Discover exciting opportunities to put your
                skills into action.
              </p>
            </div>

            <Link href="/projects" className="text-link">
              View all <ArrowRight size={17} />
            </Link>

          </div>


          <div className="opportunity-grid">

            {opportunities.map((item) => {
              const Icon = item.icon;

              return (
                <article className="opportunity-card" key={item.id}>

                  <div className="opportunity-top">

                    <div className={`opportunity-icon ${item.color}`}>
                      <Icon size={26} />
                    </div>

                    <span className="opportunity-type">
                      {item.type}
                    </span>

                  </div>

                  <h3>{item.title}</h3>

                  <p className="company-name">
                    <Building2 size={15} />
                    {item.company}
                  </p>

                  <div className="opportunity-details">

                    <span>
                      <MapPin size={15} />
                      {item.location}
                    </span>

                    <span>
                      <Clock size={15} />
                      {item.duration}
                    </span>

                  </div>

                  <div className="skill-tags">
                    {item.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>

                  <div className="opportunity-bottom">

                    <div>
                      <small>Compensation</small>
                      <strong>{item.budget}</strong>
                    </div>

                    <Link
                      href={
                        item.type === "Internship"
                          ? "/internships"
                          : item.type === "Fresher Job"
                          ? "/jobs"
                          : `/projects/${item.id}`
                      }
                      className="view-button"
                    >
                      View <ArrowRight size={16} />
                    </Link>

                  </div>

                </article>
              );
            })}

          </div>

        </div>
      </section>


      <OpportunityBoard limit={3} />


      {/* WHY SKILLBRIDGE */}
      <section className="why-section section-padding">

        <div className="container">

          <div className="why-content">

            <span className="section-label">WHY SKILLBRIDGE?</span>

            <h2>
              More than opportunities.
              <br />
              <span>A bridge to your future.</span>
            </h2>

            <p>
              We connect students, clients and organizations
              through one platform where skills meet real-world
              opportunities.
            </p>

            <div className="why-features">

              <div>
                <Users size={22} />
                <span>Connect with clients and organizations</span>
              </div>

              <div>
                <GraduationCap size={22} />
                <span>Build practical experience while studying</span>
              </div>

              <div>
                <Rocket size={22} />
                <span>Take your first step towards a career</span>
              </div>

            </div>

            <Link href="/register" className="primary-button">
              Get Started Today
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="cta-section">

        <div className="container cta-container">

          <div>
            <span>YOUR NEXT OPPORTUNITY IS WAITING</span>

            <h2>
              Ready to turn your skills
              into opportunities?
            </h2>

            <p>
              Join SkillBridge and start building your future today.
            </p>
          </div>

          <Link href="/register" className="cta-button">
            Join SkillBridge
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </main>
  );
}
