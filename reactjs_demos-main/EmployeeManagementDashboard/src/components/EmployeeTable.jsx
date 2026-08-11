import React from "react";

function EmployeeTable({
  employees,
  selectedEmployeeIds,
  onEmployeeSelectionChange
}) {
  const handleCheckboxChange = (employeeId, event) => {
    onEmployeeSelectionChange(employeeId, event.target.checked);
  };

  if (employees.length === 0) {
    return <p className="no-data">No employees found.</p>;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Employee Id</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Salary</th>
            <th>Department</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedEmployeeIds.includes(employee.id)}
                  onChange={(event) =>
                    handleCheckboxChange(employee.id, event)
                  }
                />
              </td>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.gender}</td>
              <td>{employee.salary}</td>
              <td>{employee.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;
