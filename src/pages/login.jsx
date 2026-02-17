import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { departmentMap, getDepartmentTheme } from "../config/departmentMap";

function Login() {
  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if department is already set
    const storedDept = localStorage.getItem("department");
    if (storedDept) {
      setTheme(getDepartmentTheme(storedDept));
    }
  }, []);

  const handleLogin = () => {
    setError("");
    
    if (!registerNumber) {
      setError("Please enter your register number");
      return;
    }

    if (registerNumber.length < 2) {
      setError("Invalid register number");
      return;
    }

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const deptCode = registerNumber.slice(0, 2);
      const department = departmentMap[deptCode];

      if (!department) {
        setError("Invalid Register Number. Use format: 01XXXXXX");
        setLoading(false);
        return;
      }

      localStorage.setItem("department", department);
      localStorage.setItem("registerNumber", registerNumber);
      setTheme(getDepartmentTheme(department));
      
      setLoading(false);
      navigate("/dashboard");
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const backgroundStyle = theme 
    ? { background: theme.gradient }
    : {};

  return (
    <div className="galaxy-bg" style={backgroundStyle}>
      <div style={styles.container}>
        <div style={styles.card} className="glass-card">
          {/* College Logo Watermark */}
          <div style={styles.logoContainer}>
            <div style={styles.logo}>🎓</div>
            <h1 style={styles.title}>Academic Hub</h1>
            <p style={styles.subtitle}>Department-Adaptive Learning Platform</p>
          </div>

          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Register Number</label>
              <input
                type="text"
                placeholder="Enter your register number (e.g., 01CS001)"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
                className="input"
                maxLength={10}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Enter your password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
                className="input"
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button 
              onClick={handleLogin} 
              disabled={loading}
              style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
              className="btn btn-primary"
            >
              {loading ? (
                <span style={styles.loadingText}>Signing in...</span>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <div style={styles.footer}>
            <p style={styles.hint}>
              💡 Hint: Use first two digits to detect department<br/>
              01 → Biology | 02 → Computer Science | 03 → Commerce<br/>
              04 → Business | 05 → Psychology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    padding: "40px",
    maxWidth: "420px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: "10px",
  },
  logo: {
    fontSize: "60px",
    marginBottom: "10px",
    opacity: 0.9,
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a4a",
    margin: "0 0 5px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1a1a4a",
  },
  input: {
    padding: "14px 16px",
    fontSize: "15px",
    border: "1px solid rgba(100, 120, 255, 0.2)",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.8)",
    color: "#1a1a2e",
    transition: "all 0.3s ease",
    outline: "none",
  },
  button: {
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #4a5fff 0%, #3a4fdf 100%)",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "10px",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  loadingText: {
    opacity: 0.8,
  },
  error: {
    color: "#e74c3c",
    fontSize: "13px",
    margin: 0,
    padding: "10px",
    background: "rgba(231, 76, 60, 0.1)",
    borderRadius: "8px",
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    marginTop: "10px",
  },
  hint: {
    fontSize: "12px",
    color: "#888",
    lineHeight: "1.8",
    margin: 0,
  },
};

export default Login;

