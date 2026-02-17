import { useState, useEffect } from "react";

function QuestionBank() {
  const department = localStorage.getItem("department");

  const [year, setYear] = useState(null);
  const [subject, setSubject] = useState(null);
  const [papers, setPapers] = useState([]);

  const years = ["1", "2", "3"];
  const subjects = ["Math", "Physics", "Computer"];

  // 🔹 Fetch papers when subject is selected
  useEffect(() => {
    if (year && subject) {
      fetchPapers();
    }
  }, [year, subject]);

  const fetchPapers = async () => {
    try {
      const res = await fetch(
        `https://your-vercel-url/api/resources?department=${department}&year=${year}&subject=${subject}&type=question_paper`
      );

      const data = await res.json();
      setPapers(data);
    } catch (err) {
      console.error("Error fetching papers");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Question Bank</h2>

      {/* STEP 1 — Select Year */}
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

      {/* STEP 2 — Select Subject */}
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

      {/* STEP 3 — Show Papers */}
      {subject && (
        <div>
          <h3>Papers</h3>
          {papers.length === 0 ? (
            <p>No papers found</p>
          ) : (
            papers.map((paper) => (
              <div key={paper.id} style={styles.card}>
                <h4>{paper.title}</h4>
                <p>⭐ {paper.rating_avg}</p>
                <button>Download</button>
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
    marginBottom: "10px",
    background: "#f3f5ff",
    borderRadius: "8px"
  }
};

export default QuestionBank;
