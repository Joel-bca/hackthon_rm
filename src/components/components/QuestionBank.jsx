import React, { useState, useEffect } from "react";
import AIExamAssistant from "./AIExamAssistant";
import { getDepartmentTheme } from "../../config/departmentMap";

function QuestionBank(props) {
  const propTheme = props.theme;
  const department = localStorage.getItem("department");
  const [theme, setTheme] = useState(propTheme || null);
  const [year, setYear] = useState(null);
  const [subject, setSubject] = useState(null);
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(function() {
    if (!propTheme && department) {
      setTheme(getDepartmentTheme(department));
    }
    if (propTheme) {
      setTheme(propTheme);
    }
  }, [department, propTheme]);

  const years = ["1st Year", "2nd Year", "3rd Year"];
  const subjects = {
    "1st Year": ["Mathematics I", "Physics", "Computer Fundamentals"],
    "2nd Year": ["Data Structures", "Database Management", "Operating Systems"],
    "3rd Year": ["Machine Learning", "Cloud Computing", "Cyber Security"]
  };

  const mockPapers = [
    { id: 1, title: "Data Structures - May 2024", rating: 4.8, downloads: 234 },
    { id: 2, title: "Database Management - Dec 2023", rating: 4.6, downloads: 189 },
    { id: 3, title: "Operating Systems - May 2023", rating: 4.7, downloads: 156 },
    { id: 4, title: "Data Structures - Dec 2022", rating: 4.5, downloads: 198 },
  ];

  function handleSubjectSelect(yr, subj) {
    setYear(yr);
    setSubject(subj);
    setPapers(mockPapers.slice(0, 3));
  }

  function handleDownload(paper) {
    alert("Downloading: " + paper.title);
  }

  function handleAIAssistant(paper) {
    setSelectedPaper(paper);
    setShowAIModal(true);
  }

  function resetSelection(level) {
    if (level === "year") {
      setYear(null);
      setSubject(null);
      setPapers([]);
    } else if (level === "subject") {
      setSubject(null);
      setPapers([]);
    }
  }

  function renderYearSelection() {
    if (!year) {
      return React.createElement("div", { style: styles.selectionSection },
        React.createElement("h3", { style: styles.stepTitle }, "Select Year"),
        React.createElement("div", { style: styles.buttonGrid },
          years.map(function(y) {
            return React.createElement("button", {
              key: y,
              onClick: function() { setYear(y); },
              className: "selection-card"
            }, y);
          })
        )
      );
    }
    return null;
  }

  function renderSubjectSelection() {
    if (year && !subject) {
      return React.createElement("div", { style: styles.selectionSection },
        React.createElement("button", {
          onClick: function() { resetSelection("year"); },
          style: styles.backButton
        }, "← Back to Year"),
        React.createElement("h3", { style: styles.stepTitle }, "Select Subject"),
        React.createElement("div", { style: styles.buttonGrid },
          (subjects[year] || []).map(function(s) {
            return React.createElement("button", {
              key: s,
              onClick: function() { handleSubjectSelect(year, s); },
              className: "selection-card"
            }, s);
          })
        )
      );
    }
    return null;
  }

  function renderPapers() {
    if (subject) {
      return React.createElement("div", { style: styles.selectionSection },
        React.createElement("button", {
          onClick: function() { resetSelection("subject"); },
          style: styles.backButton
        }, "← Back to Subjects"),
        React.createElement("h3", { style: styles.stepTitle }, "📋 Available Question Papers"),
        React.createElement("div", { style: styles.papersGrid },
          papers.map(function(paper) {
            return React.createElement("div", { key: paper.id, className: "glass-card", style: styles.paperCard },
              React.createElement("h4", { style: styles.paperTitle }, paper.title),
              React.createElement("div", { style: styles.paperMeta },
                React.createElement("span", { style: styles.rating }, "⭐ " + paper.rating),
                React.createElement("span", null, "⬇ " + paper.downloads)
              ),
              React.createElement("div", { style: styles.paperActions },
                React.createElement("button", {
                  onClick: function() { handleDownload(paper); },
                  style: styles.downloadBtn
                }, "📥 Download"),
                React.createElement("button", {
                  onClick: function() { handleAIAssistant(paper); },
                  style: styles.aiBtn
                }, "🤖 AI Assistant")
              )
            );
          })
        )
      );
    }
    return null;
  }

  return React.createElement("div", { style: styles.container },
    React.createElement("h2", { style: styles.title }, "📝 Question Bank"),
    renderYearSelection(),
    renderSubjectSelection(),
    renderPapers(),
    React.createElement(AIExamAssistant, {
      resourceId: selectedPaper ? selectedPaper.id : null,
      resourceTitle: selectedPaper ? selectedPaper.title : "",
      isOpen: showAIModal,
      onClose: function() { setShowAIModal(false); },
      theme: theme
    })
  );
}

const styles = {
  container: { padding: "10px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#1a1a4a", marginBottom: "25px" },
  selectionSection: { marginBottom: "20px" },
  stepTitle: { fontSize: "18px", fontWeight: "600", color: "#1a1a4a", marginBottom: "20px" },
  backButton: { padding: "8px 16px", background: "transparent", border: "1px solid rgba(100, 120, 255, 0.3)", borderRadius: "8px", color: "#1a1a4a", cursor: "pointer", marginBottom: "20px", fontSize: "14px" },
  buttonGrid: { display: "flex", flexWrap: "wrap", gap: "12px" },
  papersGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" },
  paperCard: { padding: "20px", display: "flex", flexDirection: "column", gap: "12px" },
  paperTitle: { fontSize: "16px", fontWeight: "600", color: "#1a1a4a", margin: 0 },
  paperMeta: { display: "flex", gap: "15px", fontSize: "14px", color: "#666" },
  rating: { color: "#f39c12" },
  paperActions: { display: "flex", gap: "10px", marginTop: "5px" },
  downloadBtn: { flex: 1, padding: "10px", background: "rgba(100, 120, 255, 0.1)", border: "none", borderRadius: "8px", color: "#1a1a4a", fontSize: "13px", fontWeight: "500", cursor: "pointer" },
  aiBtn: { flex: 1, padding: "10px", background: "linear-gradient(135deg, #4a5fff 0%, #3a4fdf 100%)", border: "none", borderRadius: "8px", color: "white", fontSize: "13px", fontWeight: "500", cursor: "pointer" },
};

export default QuestionBank;
