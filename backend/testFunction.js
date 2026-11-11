const employees = [
    {
        id: 1,
        name: "Rahul Sharma",
        department: "IT",
        designation: "Software Developer",
        status: "Present"
    },
    {
        id: 2,
        name: "Priya Reddy",
        department: "HR",
        designation: "HR Executive",
        status: "Absent"
    },
    {
        id: 3,
        name: "Amit Kumar",
        department: "Finance",
        designation: "Accountant",
        status: "Present"
    },
    {
        id: 4,
        name: "Sneha Patel",
        department: "IT",
        designation: "Frontend Developer",
        status: "On Leave"
    }
];

function getEmployeesByDepartment(department) {
    return employees.filter(
        employee =>
            employee.department.toLowerCase() === department.toLowerCase()
    );
}

function getEmployeesByStatus(status) {
    return employees.filter(
        employee =>
            employee.status.toLowerCase() === status.toLowerCase()
    );
}

const result = getEmployeesByDepartment("IT");

console.log("IT Department Employees:", result);

const absentEmployees = getEmployeesByStatus("Absent");

console.log("Absent Employees:", absentEmployees);