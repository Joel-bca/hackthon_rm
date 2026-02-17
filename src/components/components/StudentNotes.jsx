import { useState, useEffect } from "react";
import { getDepartmentTheme } from "../../config/departmentMap";
import { supabase } from "../../../lib/supabase";

function StudentNotes({ theme: propTheme }) {
  const [theme, setTheme] = useState(null);
  const department = localStorage.getItem("department");
  const registerNumber = localStorage.getItem("registerNumber");
  const [year, setYear] = useState(null);
  const [subject, setSubject] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedPdfs, setUploadedPdfs] = useState([]);

  useEffect(() => {
    if (!propTheme && department) {
      setTheme(getDepartmentTheme(department));
    }
    if (propTheme) {
      setTheme(propTheme);
    }
  }, [department, propTheme]);

  // Fetch uploaded PDFs from Supabase
  useEffect(() => {
    const fetchUploadedPdfs = async () => {
      const { data, error } = await supabase
        .from("student_uploads")
        .select("*")
        .eq("register_number", registerNumber)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setUploadedPdfs(data);
      }
    };

    if (registerNumber) {
      fetchUploadedPdfs();
    }
  }, [registerNumber]);

  // Handle PDF upload
  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert("File size must be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileName = `${registerNumber}_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("student-pdfs")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Failed to upload file. Storage bucket may not be configured.");
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("student-pdfs")
        .getPublicUrl(fileName);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from("student_uploads")
        .insert({
          register_number: registerNumber,
          file_name: file.name,
          file_url: publicUrl,
          department: department,
          year: year,
          subject: subject,
          lesson: lesson,
        });

      if (dbError) {
        console.error("Database error:", dbError);
        alert("Failed to save file info to database");
      } else {
        alert("PDF uploaded successfully!");
        // Refresh the list
        const { data } = await supabase
          .from("student_uploads")
          .select("*")
          .eq("register_number", registerNumber)
          .order("created_at", { ascending: false });
        setUploadedPdfs(data || []);
        setShowUploadModal(false);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload");
    }

    setUploading(false);
  };

  const handleDeletePdf = async (id, fileUrl) => {
    if (!confirm("Are you sure you want to delete this PDF?")) return;

    try {
      // Extract file name from URL
      const fileName = fileUrl.split("/").pop();

      // Delete from storage
      await supabase.storage
        .from("student-pdfs")
        .remove([fileName]);

      // Delete from database
      await supabase
        .from("student_uploads")
        .delete()
        .eq("id", id);

      // Refresh list
      setUploadedPdfs(uploadedPdfs.filter(pdf => pdf.id !== id));
      alert("PDF deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete PDF");
    }
  };

  // Department-specific subjects and lessons
  const departmentSubjects = {
    "Computer Science": {
      "1st Year": ["Mathematics I", "Physics", "Computer Fundamentals", "Digital Logic"],
      "2nd Year": ["Data Structures", "Database Management", "Operating Systems", "Computer Networks"],
      "3rd Year": ["Machine Learning", "Cloud Computing", "Cyber Security", "Web Development"]
    },
    "Biology": {
      "1st Year": ["Biology I", "Chemistry", "Physics", "Mathematics"],
      "2nd Year": ["Biochemistry", "Microbiology", "Cell Biology", "Genetics"],
      "3rd Year": ["Molecular Biology", "Biotechnology", "Ecology", "Bioinformatics"]
    },
    "Commerce": {
      "1st Year": ["Business Mathematics", "Financial Accounting", "Economics", "Business Communication"],
      "2nd Year": ["Corporate Accounting", "Business Law", "Cost Accounting", "Taxation"],
      "3rd Year": ["Advanced Accounting", "Auditing", "Financial Management", "Business Regulations"]
    },
    "Business": {
      "1st Year": ["Business Mathematics", "Principles of Management", "Economics", "Business Communication"],
      "2nd Year": ["Marketing Management", "Human Resource Management", "Organizational Behavior", "Business Statistics"],
      "3rd Year": ["Strategic Management", "International Business", "Entrepreneurship", "Business Ethics"]
    },
    "Psychology": {
      "1st Year": ["Introduction to Psychology", "Developmental Psychology", "Social Psychology", "Research Methods"],
      "2nd Year": ["Cognitive Psychology", "Abnormal Psychology", "Personality Theory", "Statistics for Psychology"],
      "3rd Year": ["Clinical Psychology", "Counseling Psychology", "Industrial Psychology", "Neuropsychology"]
    }
  };

  const years = ["1st Year", "2nd Year", "3rd Year"];
  const subjects = department ? (departmentSubjects[department] || departmentSubjects["Computer Science"]) : departmentSubjects["Computer Science"];
  const lessons = ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"];

  // Mock notes data
  const mockNotes = [
    { id: 1, title: "Complete Notes - Unit 1", rating: 4.8, downloads: 234, pages: 45 },
    { id: 2, title: "Summary Notes - Unit 2", rating: 4.6, downloads: 189, pages: 32 },
    { id: 3, title: "Quick Revision Guide", rating: 4.7, downloads: 156, pages: 28 },
    { id: 4, title: "Detailed Explanations - Unit 3", rating: 4.5, downloads: 198, pages: 52 },
  ];

  // Fetch notes when lesson is selected
  useEffect(() => {
    if (year && subject && lesson) {
      // Use mock data for demo
      setNotes(mockNotes);
    }
  }, [year, subject, lesson]);

  const handleDownload = (note) => {
    alert("Downloading: " + note.title);
  };

  const handleAIAssistant = (note) => {
    alert("Opening AI Assistant for: " + note.title);
  };

  const resetSelection = (level) => {
    if (level === "year") {
      setYear(null);
      setSubject(null);
      setLesson(null);
      setNotes([]);
    } else if (level === "subject") {
      setSubject(null);
      setLesson(null);
      setNotes([]);
    } else if (level === "lesson") {
      setLesson(null);
      setNotes([]);
    }
  };

  const renderYearSelection = () => (
    <div style={styles.selectionSection}>
      <h3 style={styles.stepTitle}>📅 Select Year</h3>
      <div style={styles.buttonGrid}>
        {years.map((y) => (
          <button 
            key={y} 
            onClick={() => setYear(y)}
            className="selection-card"
            style={theme ? { 
              ...styles.yearButton, 
              borderColor: theme.accentBright 
            } : styles.yearButton}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSubjectSelection = () => {
    if (year && !subject) {
      const yearSubjects = subjects[year] || [];
      return (
        <div style={styles.selectionSection}>
          <button 
            onClick={() => resetSelection("year")} 
            style={styles.backButton}
          >
            ← Back to Year
          </button>
          <h3 style={styles.stepTitle}>📚 Select Subject</h3>
          <div style={styles.buttonGrid}>
            {yearSubjects.map((s) => (
              <button 
                key={s} 
                onClick={() => setSubject(s)}
                className="selection-card"
                style={theme ? { 
                  ...styles.subjectButton, 
                  borderColor: theme.accentBright 
                } : styles.subjectButton}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLessonSelection = () => {
    if (subject && !lesson) {
      return (
        <div style={styles.selectionSection}>
          <button 
            onClick={() => resetSelection("subject")} 
            style={styles.backButton}
          >
            ← Back to Subjects
          </button>
          <h3 style={styles.stepTitle}>📖 Select Lesson/Unit</h3>
          <div style={styles.buttonGrid}>
            {lessons.map((l) => (
              <button 
                key={l} 
                onClick={() => setLesson(l)}
                className="selection-card"
                style={theme ? { 
                  ...styles.lessonButton, 
                  borderColor: theme.accentBright 
                } : styles.lessonButton}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderNotesList = () => {
    if (lesson) {
      return (
        <div style={styles.selectionSection}>
          <button 
            onClick={() => resetSelection("lesson")} 
            style={styles.backButton}
          >
            ← Back to Lessons
          </button>
          <h3 style={styles.stepTitle}>📋 Available Notes for {subject}</h3>
          <div style={styles.notesGrid}>
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="glass-card"
                style={styles.noteCard}
              >
                <h4 style={styles.noteTitle}>{note.title}</h4>
                <div style={styles.noteMeta}>
                  <span style={styles.rating}>⭐ {note.rating}</span>
                  <span>📄 {note.pages} pages</span>
                  <span>⬇ {note.downloads}</span>
                </div>
                <div style={styles.noteActions}>
                  <button 
                    onClick={() => handleDownload(note)}
                    style={styles.downloadBtn}
                  >
                    📥 Download
                  </button>
                  <button 
                    onClick={() => handleAIAssistant(note)}
                    style={styles.aiBtn}
                  >
                    🤖 AI Assistant
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ ...styles.container, background: theme?.accent || "transparent" }}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={{ ...styles.title, color: theme?.text || "#1a1a4a" }}>
            📚 Student Notes
          </h2>
          <p style={{ ...styles.subtitle, color: theme?.text || "#666" }}>
            Department: {department || "Computer Science"}
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          style={styles.uploadButton}
        >
          📤 Upload PDF
        </button>
      </div>

      {/* Uploaded PDFs Section */}
      {uploadedPdfs.length > 0 && (
        <div style={styles.uploadedSection}>
          <h3 style={styles.uploadedTitle}>📄 Your Uploaded PDFs</h3>
          <div style={styles.uploadedGrid}>
            {uploadedPdfs.map((pdf) => (
              <div key={pdf.id} style={styles.uploadedCard} className="glass-card">
                <div style={styles.pdfIcon}>📄</div>
                <div style={styles.pdfInfo}>
                  <h4 style={styles.pdfTitle}>{pdf.file_name}</h4>
                  <p style={styles.pdfMeta}>
                    {pdf.subject} - {pdf.lesson}
                  </p>
                  <p style={styles.pdfDate}>
                    {new Date(pdf.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={styles.pdfActions}>
                  <a 
                    href={pdf.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.viewBtn}
                  >
                    👁 View
                  </a>
                  <button 
                    onClick={() => handleDeletePdf(pdf.id, pdf.file_url)}
                    style={styles.deleteBtn}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={styles.modalOverlay} onClick={() => setShowUploadModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>📤 Upload PDF</h3>
            
            <div style={styles.uploadForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Select Year</label>
                <select 
                  style={styles.select}
                  value={year || ""}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Select Subject</label>
                <select 
                  style={styles.select}
                  value={subject || ""}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={!year}
                >
                  <option value="">Select Subject</option>
                  {year && (subjects[year] || []).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Select Lesson/Unit</label>
                <select 
                  style={styles.select}
                  value={lesson || ""}
                  onChange={(e) => setLesson(e.target.value)}
                  disabled={!subject}
                >
                  <option value="">Select Lesson</option>
                  {lessons.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Choose PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  style={styles.fileInput}
                  disabled={uploading}
                />
              </div>

              <p style={styles.uploadHint}>
                📌 Max file size: 10MB | Only PDF files allowed
              </p>

              <div style={styles.modalButtons}>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  style={styles.cancelButton}
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderYearSelection()}
      {renderSubjectSelection()}
      {renderLessonSelection()}
      {renderNotesList()}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    borderRadius: "16px",
    minHeight: "100%",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "5px",
  },
  subtitle: {
    fontSize: "14px",
    marginBottom: "25px",
  },
  selectionSection: {
    marginBottom: "25px",
  },
  stepTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a4a",
    marginBottom: "20px",
  },
  backButton: {
    padding: "8px 16px",
    background: "transparent",
    border: "1px solid rgba(100, 120, 255, 0.3)",
    borderRadius: "8px",
    color: "#1a1a4a",
    cursor: "pointer",
    marginBottom: "20px",
    fontSize: "14px",
  },
  buttonGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  yearButton: {
    padding: "15px 25px",
    background: "rgba(255, 255, 255, 0.6)",
    border: "1px solid rgba(100, 120, 255, 0.15)",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
  },
  subjectButton: {
    padding: "15px 25px",
    background: "rgba(255, 255, 255, 0.6)",
    border: "1px solid rgba(100, 120, 255, 0.15)",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
  },
  lessonButton: {
    padding: "15px 25px",
    background: "rgba(255, 255, 255, 0.6)",
    border: "1px solid rgba(100, 120, 255, 0.15)",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
  },
  notesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  noteCard: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  noteTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a4a",
    margin: 0,
  },
  noteMeta: {
    display: "flex",
    gap: "15px",
    fontSize: "14px",
    color: "#666",
  },
  rating: {
    color: "#f39c12",
  },
  noteActions: {
    display: "flex",
    gap: "10px",
    marginTop: "5px",
  },
  downloadBtn: {
    flex: 1,
    padding: "10px",
    background: "rgba(100, 120, 255, 0.1)",
    border: "none",
    borderRadius: "8px",
    color: "#1a1a4a",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  aiBtn: {
    flex: 1,
    padding: "10px",
    background: "linear-gradient(135deg, #4a5fff 0%, #3a4fdf 100%)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  // Upload button styles
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
  },
  uploadButton: {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #4a5fff 0%, #3a4fdf 100%)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
  },
  uploadedSection: {
    marginBottom: "30px",
    padding: "20px",
    background: "rgba(255, 255, 255, 0.4)",
    borderRadius: "16px",
  },
  uploadedTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a4a",
    marginBottom: "15px",
  },
  uploadedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "15px",
  },
  uploadedCard: {
    padding: "15px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  pdfIcon: {
    fontSize: "32px",
  },
  pdfInfo: {
    flex: 1,
  },
  pdfTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a4a",
    margin: "0 0 5px 0",
    wordBreak: "break-word",
  },
  pdfMeta: {
    fontSize: "12px",
    color: "#666",
    margin: "0 0 3px 0",
  },
  pdfDate: {
    fontSize: "11px",
    color: "#888",
    margin: 0,
  },
  pdfActions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  viewBtn: {
    padding: "8px 12px",
    background: "rgba(100, 120, 255, 0.1)",
    border: "none",
    borderRadius: "6px",
    color: "#1a1a4a",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "center",
    display: "block",
  },
  deleteBtn: {
    padding: "8px 12px",
    background: "rgba(231, 76, 60, 0.1)",
    border: "none",
    borderRadius: "6px",
    color: "#e74c3c",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
  },
  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "30px",
    maxWidth: "450px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a1a4a",
    marginBottom: "25px",
    textAlign: "center",
  },
  uploadForm: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  formLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1a1a4a",
  },
  select: {
    padding: "12px 16px",
    fontSize: "14px",
    border: "1px solid rgba(100, 120, 255, 0.2)",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.8)",
    color: "#1a1a2e",
    outline: "none",
    cursor: "pointer",
  },
  fileInput: {
    padding: "12px",
    fontSize: "14px",
    border: "1px dashed rgba(100, 120, 255, 0.3)",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.5)",
    cursor: "pointer",
  },
  uploadHint: {
    fontSize: "12px",
    color: "#888",
    margin: 0,
    textAlign: "center",
  },
  modalButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginTop: "10px",
  },
  cancelButton: {
    padding: "12px 24px",
    background: "rgba(100, 120, 255, 0.1)",
    border: "none",
    borderRadius: "10px",
    color: "#1a1a4a",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
};

export default StudentNotes;
