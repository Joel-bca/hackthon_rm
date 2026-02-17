import { useState, useEffect } from "react";
import { getDepartmentTheme } from "../../config/departmentMap";

function ExamPanel() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const dept = localStorage.getItem("department");
    if (dept) {
      setTheme(getDepartmentTheme(dept));
    }
  }, []);

  // Sample upcoming exams data
  const exams = [
    { id: 1, subject: "Data Structures", date: "2026-03-15", daysLeft: 15 },
    { id: 2, subject: "Database Management", date: "2026-03-20", daysLeft: 20 },
    { id: 3, subject: "Computer Networks", date: "2026-03-25", daysLeft: 25 },
    { id: 4, subject: "Operating Systems", date: "2026-04-01", daysLeft: 32 },
  ];

  const panelStyle = {
    width: "260px",
    padding: "20px",
    background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(10px)",
    borderLeft: `1px solid ${theme?.accentBright || "rgba(100, 120, 255, 0.1)"}`,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    overflowY: "auto",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  };

  const headerIconStyle = {
    fontSize: "24px",
  };

  const headerTextStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: theme?.text || "#1a1a4a",
    margin: 0,
  };

  const getCountdownColor = (daysLeft) => {
    if (daysLeft <= 7) return "#e74c3c";
    if (daysLeft <= 14) return "#f39c12";
    return theme?.highlight || "#4a5fff";
  };

  const examCardStyle = {
    padding: "16px",
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const subjectStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: theme?.text || "#1a1a4a",
    marginBottom: "8px",
  };

  const dateStyle = {
    fontSize: "12px",
    color: "#666",
    marginBottom: "10px",
  };

  const countdownBadgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    background: `${getCountdownColor(exams[0]?.daysLeft || 15)}15`,
    border: `1px solid ${getCountdownColor(exams[0]?.daysLeft || 15)}30`,
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: getCountdownColor(exams[0]?.daysLeft || 15),
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <span style={headerIconStyle}>📅</span>
        <h3 style={headerTextStyle}>Upcoming Exams</h3>
      </div>

      {exams.map((exam) => (
        <div
          key={exam.id}
          style={examCardStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = `0 5px 20px ${theme?.accentBright || "rgba(100, 120, 255, 0.2)"}`;
            e.currentTarget.style.borderColor = `${theme?.highlight || "#4a5fff"}40`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
          }}
        >
          <div style={subjectStyle}>{exam.subject}</div>
          <div style={dateStyle}>📆 {exam.date}</div>
          <div style={{
            ...countdownBadgeStyle,
            background: `${getCountdownColor(exam.daysLeft)}15`,
            borderColor: `${getCountdownColor(exam.daysLeft)}30`,
            color: getCountdownColor(exam.daysLeft),
          }}>
            ⏰ {exam.daysLeft} days left
          </div>
        </div>
      ))}

      <div style={{
        marginTop: "auto",
        padding: "15px",
        background: theme?.accent || "rgba(100, 120, 255, 0.1)",
        borderRadius: "12px",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: "12px",
          color: theme?.text || "#1a1a4a",
          margin: 0,
          fontWeight: "500",
        }}>
          💪 Stay focused! You've got this!
        </p>
      </div>
    </div>
  );
}

export default ExamPanel;

