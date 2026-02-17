import { useState, useEffect } from "react";

function StudentNotes() {
  const department = localStorage.getItem("department");

  const [year, setYear] = useState(null);
  const [subject, setSubject] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [notes, setNotes] = useState([]);

  const years = ["1", "2", "3"];
  const subjects = ["Math", "Physics", "Computer"];
  const lessons = ["Unit 1", "Unit 2", "Unit 3"];

  // Fetch notes when lesson is selected
  useEffect(() => {
    if (year && subject && lesson) {
      fetchNotes();
    }
  }, [year, subject, lesson]);

  const fetchNotes = async () => {
    try {
      const res = await fetch(
        `https://your-vercel-url/api/resources?department=${department}&year=${year}&subject=${subject}&lesson=${lesson}&type=student_note`
      );

      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Notes</h2>

      {/* Step 1 — Year */}
      {!year && (
        <div>
          <h3>Select Year</h3>
          {years.map((y) => (
            <button key={y} onClick={() => setYear(y)}>
              Year {y}
            </button>
          ))}
        </div>
      )}

      {/* Step 2 — Subject */}
      {year && !subject && (
        <div>
          <h3>Select Subject</h3>
          {subjects.map((s) => (
            <button key={s} onClick={() => setSubject(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Step 3 — Lesson */}
      {subject && !lesson && (
        <div>
          <h3>Select Lesson</h3>
          {lessons.map((l) => (
            <button key={l} onClick={() => setLesson(l)}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* Step 4 — Display PDFs */}
      {lesson && (
        <div>
          <h3>Available PDFs</h3>

          {notes.length === 0 ? (
            <p>No notes found</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} style={styles.card}>
                <h4>{note.title}</h4>
                <p>⭐ {note.rating_avg}</p>
                <p>⬇ {note.download_count} Downloads</p>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button>Open Discussion</button>
                  <button>AI Exam Assistant</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    padding: "15px",
    marginBottom: "12px",
    background: "#f3f5ff",
    borderRadius: "8px"
  }
};

export default StudentNotes;
