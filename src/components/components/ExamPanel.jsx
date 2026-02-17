function ExamPanel() {
  return (
    <div style={styles.panel}>
      <h4>Upcoming Exams</h4>
      <p>Math - 15 Days Left</p>
      <p>Physics - 10 Days Left</p>
    </div>
  );
}

const styles = {
  panel: {
    width: "220px",
    padding: "20px",
    background: "#f5f7ff"
  }
};

export default ExamPanel;
