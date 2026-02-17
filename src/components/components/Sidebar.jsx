import { useState, useEffect } from "react";
import { getDepartmentTheme } from "../../config/departmentMap";

function Sidebar({ active, setActive }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const dept = localStorage.getItem("department");
    if (dept) {
      setTheme(getDepartmentTheme(dept));
    }
  }, []);

  const items = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "questionbank", label: "Question Bank", icon: "📝" },
    { id: "notes", label: "Student Notes", icon: "📚" },
    { id: "toprated", label: "Top Rated Resources", icon: "⭐" },
    { id: "search", label: "Search", icon: "🔍" }
  ];

  const sidebarStyle = {
    width: "240px",
    padding: "20px 15px",
    background: theme?.accent || "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(10px)",
    borderRight: `1px solid ${theme?.accentBright || "rgba(100, 120, 255, 0.1)"}`,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    transition: "all 0.3s ease",
  };

  const handleItemClick = (id) => {
    setActive(id);
  };

  return (
    <div style={sidebarStyle} className="sidebar">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => handleItemClick(item.id)}
          style={{
            ...styles.item,
            background: active === item.id 
              ? (theme?.accentBright || "rgba(100, 120, 255, 0.2)") 
              : "transparent",
            borderLeft: active === item.id 
              ? `3px solid ${theme?.highlight || "#4a5fff"}` 
              : "3px solid transparent",
            color: active === item.id 
              ? (theme?.text || "#1a1a4a") 
              : "#666",
            fontWeight: active === item.id ? "600" : "500",
          }}
          onMouseOver={(e) => {
            if (active !== item.id) {
              e.currentTarget.style.background = theme?.accent || "rgba(100, 120, 255, 0.08)";
              e.currentTarget.style.transform = "translateX(4px)";
            }
          }}
          onMouseOut={(e) => {
            if (active !== item.id) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }
          }}
        >
          <span style={styles.icon}>{item.icon}</span>
          <span style={styles.label}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  item: {
    padding: "14px 18px",
    cursor: "pointer",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.3s ease",
    marginBottom: "4px",
  },
  icon: {
    fontSize: "18px",
    width: "24px",
    textAlign: "center",
  },
  label: {
    fontSize: "14px",
    letterSpacing: "0.3px",
  },
};

export default Sidebar;

