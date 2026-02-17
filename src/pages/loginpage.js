const deptCode = registerNumber.slice(0,2);
const department = departmentMap[deptCode];
localStorage.setItem("department", department);