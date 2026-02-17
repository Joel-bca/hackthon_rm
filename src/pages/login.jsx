import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { departmentMap } from "../config/departmentMap";

function Login() {
  const [registerNumber, setRegisterNumber] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const deptCode = registerNumber.slice(0, 2);
    const department = departmentMap[deptCode];

    if (!department) {
      alert("Invalid Register Number");
      return;
    }

    localStorage.setItem("department", department);
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Register Number"
          value={registerNumber}
          onChange={(e) => setRegisterNumber(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
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
    background: "#eef1ff"
  },
  card: {
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  }
};

export default Login;
