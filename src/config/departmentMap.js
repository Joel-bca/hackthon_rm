export const departmentMap = {
  "01": "Biology",
  "02": "Computer Science",
  "03": "Commerce",
  "04": "Business",
  "05": "Psychology"
};

// Department-based theme configuration
export const departmentThemes = {
  "Computer Science": {
    accent: "rgba(100, 120, 255, 0.15)",
    accentBright: "rgba(100, 120, 255, 0.3)",
    text: "#1a1a4a",
    highlight: "#4a5fff",
    gradient: "linear-gradient(135deg, #e8eaff 0%, #e0e5ff 50%, #d8dbff 100%)"
  },
  "Science": {
    accent: "rgba(80, 200, 120, 0.15)",
    accentBright: "rgba(80, 200, 120, 0.3)",
    text: "#0a3a1a",
    highlight: "#2eb860",
    gradient: "linear-gradient(135deg, #e8fff0 0%, #e0fff5 50%, #d8fff0 100%)"
  },
  "Commerce": {
    accent: "rgba(218, 165, 32, 0.15)",
    accentBright: "rgba(218, 165, 32, 0.3)",
    text: "#3a2a0a",
    highlight: "#daa520",
    gradient: "linear-gradient(135deg, #fff8e8 0%, #fff5e0 50%, #fff0d8 100%)"
  },
  "Business": {
    accent: "rgba(70, 80, 120, 0.15)",
    accentBright: "rgba(70, 80, 120, 0.3)",
    text: "#1a2a3a",
    highlight: "#3a4a6a",
    gradient: "linear-gradient(135deg, #e8eaef 0%, #e0e3eb 50%, #d8dce5 100%)"
  },
  "Psychology": {
    accent: "rgba(150, 100, 200, 0.15)",
    accentBright: "rgba(150, 100, 200, 0.3)",
    text: "#2a1a3a",
    highlight: "#7c4dff",
    gradient: "linear-gradient(135deg, #f3e8ff 0%, #f0e0ff 50%, #edd8ff 100%)"
  },
  "Biology": {
    accent: "rgba(80, 180, 120, 0.15)",
    accentBright: "rgba(80, 180, 120, 0.3)",
    text: "#0a3a20",
    highlight: "#2eb878",
    gradient: "linear-gradient(135deg, #e8fff5 0%, #e0fff0 50%, #d8ffe8 100%)"
  }
};

export const getDepartmentTheme = (department) => {
  return departmentThemes[department] || departmentThemes["Computer Science"];
};
