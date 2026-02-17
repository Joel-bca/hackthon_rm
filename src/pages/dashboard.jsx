import { useState, useEffect } from "react";
import Navbar from "../components/components/navbar";
import Sidebar from "../components/components/Sidebar";
import ExamPanel from "../components/components/ExamPanel";
import QuestionBank from "../components/components/QuestionBank";
import StudentNotes from "../components/components/StudentNotes";
import { getDepartmentTheme } from "../config/departmentMap";
import { FaBook, FaFileAlt, FaRobot, FaStar, FaDownload, FaFire, FaSearch, FaComments } from "react-icons/fa";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [theme, setTheme] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const dept = localStorage.getItem("department");
    if (dept) {
      setTheme(getDepartmentTheme(dept));
    }
  }, []);

  // Carousel images (placeholder URLs)
  const slides = [
    { 
      id: 1, 
      title: "Welcome to Academic Hub", 
      subtitle: "Your personalized learning journey starts here",
      icon: <FaBook />
    },
    { 
      id: 2, 
      title: "Question Bank", 
      subtitle: "Access past year question papers",
      icon: <FaFileAlt />
    },
    { 
      id: 3, 
      title: "Student Notes", 
      subtitle: "Download and share study materials",
      icon: <FaDownload />
    },
    { 
      id: 4, 
      title: "AI Exam Assistant", 
      subtitle: "Get AI-powered exam preparation",
      icon: <FaRobot />
    },
  ];

  // Motivational quotes
  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Education is the passport to the future. - Malcolm X",
    "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The expert in anything was once a beginner. - Helen Hayes",
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Sample top-rated resources
  const topResources = [
    { id: 1, title: "Python Programming Notes", rating: 4.8, downloads: 1250 },
    { id: 2, title: "Database SQL Queries", rating: 4.7, downloads: 980 },
    { id: 3, title: "Data Structures MCQs", rating: 4.6, downloads: 856 },
  ];

  const renderDashboard = () => (
    <div style={styles.dashboardContent}>
      {/* Motivational Quote */}
      <div style={styles.quoteCard} className="glass-card">
        <div style={styles.quoteIcon}><FaComments /></div>
        <p style={styles.quoteText}>
          "{quotes[Math.floor(Math.random() * quotes.length)]}"
        </p>
      </div>

      {/* Carousel */}
      <div style={styles.carouselContainer}>
        <div style={styles.carousel} className="glass-card">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={styles.slide}
            >
              <div style={styles.slideContent}>
                <span style={styles.slideIcon}>{slide.icon}</span>
                <h2 style={styles.slideTitle}>{slide.title}</h2>
                <p style={styles.slideSubtitle}>{slide.subtitle}</p>
              </div>
            </div>
          ))}
          
          {/* Carousel Dots */}
          <div style={styles.carouselDots}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  ...styles.dot,
                  background: index === currentSlide 
                    ? (theme?.highlight || "#4a5fff") 
                    : "rgba(100, 120, 255, 0.2)",
                  transform: index === currentSlide ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard} className="glass-card">
          <span style={styles.statIcon}><FaBook /></span>
          <div>
            <h3 style={styles.statNumber}>150+</h3>
            <p style={styles.statLabel}>Resources</p>
          </div>
        </div>
        <div style={styles.statCard} className="glass-card">
          <span style={styles.statIcon}><FaFileAlt /></span>
          <div>
            <h3 style={styles.statNumber}>50+</h3>
            <p style={styles.statLabel}>Question Papers</p>
          </div>
        </div>
        <div style={styles.statCard} className="glass-card">
          <span style={styles.statIcon}><FaStar /></span>
          <div>
            <h3 style={styles.statNumber}>4.7</h3>
            <p style={styles.statLabel}>Avg Rating</p>
          </div>
        </div>
      </div>

      {/* Top Rated Resources Preview */}
      <div style={styles.topRatedSection}>
        <h3 style={styles.sectionTitle}><FaFire /> Top Rated Resources</h3>
        <div style={styles.topRatedGrid}>
          {topResources.map((resource) => (
            <div 
              key={resource.id} 
              style={styles.topRatedCard}
              className="glass-card"
            >
              <h4 style={styles.resourceTitle}>{resource.title}</h4>
              <div style={styles.resourceMeta}>
                <span><FaStar /> {resource.rating}</span>
                <span><FaDownload /> {resource.downloads}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <Navbar />

      <div style={styles.body}>
        {/* Sidebar */}
        <Sidebar active={activeSection} setActive={setActiveSection} />

        {/* Main Content */}
        <div style={styles.main}>
          {activeSection === "dashboard" && renderDashboard()}

          {activeSection === "questionbank" && (
            <QuestionBank theme={theme} />
          )}

          {activeSection === "notes" && (
            <StudentNotes theme={theme} />
          )}

          {activeSection === "toprated" && (
            <div style={styles.placeholder}>
              <h2>⭐ Top Rated Resources</h2>
              <p>Coming soon...</p>
            </div>
          )}

          {activeSection === "search" && (
            <div style={styles.placeholder}>
              <h2>🔍 Search Module</h2>
              <p>Coming soon...</p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <ExamPanel />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  body: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },
  main: {
    flex: 1,
    padding: "25px",
    overflowY: "auto",
    background: "rgba(255, 255, 255, 0.3)",
  },
  dashboardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  quoteCard: {
    padding: "25px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  quoteIcon: {
    fontSize: "40px",
  },
  quoteText: {
    fontSize: "16px",
    fontStyle: "italic",
    color: "#1a1a4a",
    margin: 0,
    fontWeight: "500",
    lineHeight: "1.6",
  },
  carouselContainer: {
    width: "100%",
  },
  carousel: {
    position: "relative",
    height: "220px",
    overflow: "hidden",
    borderRadius: "16px",
  },
  slide: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, rgba(100, 120, 255, 0.1) 0%, rgba(147, 112, 219, 0.1) 100%)",
  },
  slideContent: {
    textAlign: "center",
    padding: "20px",
  },
  slideIcon: {
    fontSize: "50px",
    display: "block",
    marginBottom: "15px",
    color: "#4a5fff",
  },
  slideTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a4a",
    margin: "0 0 10px 0",
  },
  slideSubtitle: {
    fontSize: "16px",
    color: "#666",
    margin: 0,
  },
  carouselDots: {
    position: "absolute",
    bottom: "15px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "8px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  statCard: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  statIcon: {
    fontSize: "36px",
  },
  statNumber: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a4a",
    margin: 0,
  },
  statLabel: {
    fontSize: "13px",
    color: "#666",
    margin: 0,
  },
  topRatedSection: {
    marginTop: "10px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a1a4a",
    marginBottom: "15px",
  },
  topRatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
  },
  topRatedCard: {
    padding: "18px",
  },
  resourceTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1a1a4a",
    margin: "0 0 10px 0",
  },
  resourceMeta: {
    display: "flex",
    gap: "15px",
    fontSize: "13px",
    color: "#666",
  },
  placeholder: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#666",
  },
};

export default Dashboard;

