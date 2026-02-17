function Navbar() {
  const department = localStorage.getItem("department");

  return (
    <div style={styles.nav}>
      <h3>Academic Platform</h3>
      <span>{department}</span>
    </div>
  );
}

const styles = {
  nav: {
    height: "60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    background: "#dde2ff"
  }
};

export default Navbar;

