import { useState } from "react";
import Navbar from "../components/components/navbar";
import Sidebar from "../components/components/Sidebar";
import ExamPanel from "../components/components/ExamPanel";
import QuestionBank from "../components/components/QuestionBank";
import StudentNotes from "../components/components/StudentNotes";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div style={styles.wrapper}>
      <Navbar />

      <div style={styles.body}>
        
        {/* Sidebar */}
        <Sidebar active={activeSection} setActive={setActiveSection} />

        {/* Main Content */}
        <div style={styles.main}>

          {activeSection === "dashboard" && (
            <h2>Welcome to Dashboard</h2>
          )}

          {activeSection === "questionbank" && (
            <QuestionBank />
          )}

          {activeSection === "notes" && (
            <StudentNotes />
          )}

          {activeSection === "toprated" && (
            <h2>Top Rated Resources (Next Step)</h2>
          )}

          {activeSection === "search" && (
            <h2>Search Module (Next Step)</h2>
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
  },
  body: {
    flex: 1,
    display: "flex",
  },
  main: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },
};

export default Dashboard;

