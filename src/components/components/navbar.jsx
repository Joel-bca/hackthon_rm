import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDepartmentTheme } from "../../config/departmentMap";
import { FaUniversity, FaBookOpen, FaUser, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const [department, setDepartment] = useState("");
  const [theme, setTheme] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dept = localStorage.getItem("department");
    if (dept) {
      setDepartment(dept);
      setTheme(getDepartmentTheme(dept));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("department");
    localStorage.removeItem("registerNumber");
    navigate("/");
  };

  const navbarStyle = {
    height: "65px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 25px",
    background: theme ? `${theme.accent}` : "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    borderBottom: `1px solid ${theme ? theme.accentBright : "rgba(100, 120, 255, 0.1)"}`,
    transition: "all 0.3s ease",
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const logoIconStyle = {
    fontSize: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const logoTextStyle = {
    fontSize: "22px",
    fontWeight: "700",
    color: theme?.text || "#1a1a4a",
    margin: 0,
  };

  const deptBadgeStyle = {
    padding: "6px 16px",
    background: theme?.highlight || "#4a5fff",
    color: "white",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
    boxShadow: `0 2px 10px ${theme?.highlight || "#4a5fff"}40`,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const rightSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  };

  const profileIconStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: theme?.accent || "rgba(100, 120, 255, 0.1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: `2px solid ${theme?.highlight || "#4a5fff"}30`,
  };

  const logoutBtnStyle = {
    padding: "8px 18px",
    background: "transparent",
    border: `1px solid ${theme?.highlight || "#4a5fff"}`,
    borderRadius: "8px",
    color: theme?.text || "#1a1a4a",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  return (
    <nav style={navbarStyle}>
      <div style={logoStyle}>
        <span style={logoIconStyle}><FaUniversity /></span>
        <h2 style={logoTextStyle}>Academic Hub</h2>
      </div>

      <div style={deptBadgeStyle}>
        <FaBookOpen /> {department}
      </div>

      <div style={rightSectionStyle}>
        <div 
          style={profileIconStyle}
          title="Profile"
        >
          <FaUser />
        </div>
        
        <button 
          onClick={handleLogout}
          style={logoutBtnStyle}
          onMouseOver={(e) => {
            e.target.style.background = theme?.highlight || "#4a5fff";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = theme?.text || "#1a1a4a";
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

