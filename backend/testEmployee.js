async function getEmployees() {
    const response = await fetch("http://localhost:5000/api/employees");

    const data = await response.json();

    console.log("Employee Data:", data);
}

getEmployees();