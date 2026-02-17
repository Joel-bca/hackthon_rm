function Sidebar({ active, setActive }) {

  const items = [
    { id: "dashboard", label: "Dashboard" },
    { id: "questionbank", label: "Question Bank" },
    { id: "notes", label: "Student Notes" },
    { id: "toprated", label: "Top Rated Resources" },
    { id: "search", label: "Search" }
  ];

  return (
    <div style={styles.sidebar}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => setActive(item.id)}
          style={{
            ...styles.item,
            background: active === item.id ? "#ccd5ff" : "transparent"
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    padding: "20px",
    background: "#f5f7ff"
  },
  item: {
    padding: "10px",
    cursor: "pointer",
    marginBottom: "10px",
    borderRadius: "6px"
  }
};

export default Sidebar;

