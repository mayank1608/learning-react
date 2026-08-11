import React, { useEffect, useState } from "react";
import EmployeeTable from "./EmployeeTable";

const employeesData = [
  { id: 1, name: "Amit", gender: "Male", salary: 50000, department: "IT" },
  { id: 2, name: "Sneha", gender: "Female", salary: 60000, department: "HR" },
  { id: 3, name: "Rahul", gender: "Male", salary: 55000, department: "Finance" },
  { id: 4, name: "Pooja", gender: "Female", salary: 65000, department: "IT" },
  { id: 5, name: "Kiran", gender: "Male", salary: 70000, department: "HR" }
];

function EmployeeDashboard() {
  const [employees] = useState(employeesData);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const [totalSalary, setTotalSalary] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);

//   const departments = ["All", "IT", "HR", "Finance"];
  const departments =['All', ...(new Set(employeesData.map(emp => emp.department)))];

  const filteredEmployees =
    selectedDepartment === "All"
      ? employees
      : employees.filter(
          (employee) => employee.department === selectedDepartment
        );

  useEffect(() => {
    const selectedEmployees = employees.filter((employee) =>
      selectedEmployeeIds.includes(employee.id)
    );

    const salaryTotal = selectedEmployees.reduce(
      (sum, employee) => sum + employee.salary,
      0
    );

    const maleEmployees = selectedEmployees.filter(
      (employee) => employee.gender === "Male"
    ).length;

    const femaleEmployees = selectedEmployees.filter(
      (employee) => employee.gender === "Female"
    ).length;

    setTotalSalary(salaryTotal);
    setMaleCount(maleEmployees);
    setFemaleCount(femaleEmployees);
  }, [selectedEmployeeIds, employees]);

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setSelectedEmployeeIds([]);
  };

  const handleEmployeeSelectionChange = (employeeId, isChecked) => {
    if (isChecked) {
      setSelectedEmployeeIds((prevSelectedIds) => [
        ...prevSelectedIds,
        employeeId
      ]);
    } else {
      setSelectedEmployeeIds((prevSelectedIds) =>
        prevSelectedIds.filter((id) => id !== employeeId)
      );
    }
  };

  return (
    <div className="dashboard-card">
      <h1>Employee Dashboard</h1>

      <div className="controls-section">
        <div className="form-group">
          <label>Department</label>
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
          >
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div className="summary-section">
          <div className="form-group">
            <label>Total Salary</label>
            <input type="text" value={totalSalary} readOnly />
          </div>

          <div className="form-group">
            <label>Male Count</label>
            <input type="text" value={maleCount} readOnly />
          </div>

          <div className="form-group">
            <label>Female Count</label>
            <input type="text" value={femaleCount} readOnly />
          </div>
        </div>
      </div>

      <EmployeeTable
        employees={filteredEmployees}
        selectedEmployeeIds={selectedEmployeeIds}
        onEmployeeSelectionChange={handleEmployeeSelectionChange}
      />
    </div>
  );
}

export default EmployeeDashboard;