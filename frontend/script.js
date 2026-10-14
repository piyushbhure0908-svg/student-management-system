const API_URL = "http://localhost:5000/api/students";

const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");
const message = document.getElementById("message");
const totalStudents = document.getElementById("totalStudents");
const searchInput = document.getElementById("searchInput");
const studentId = document.getElementById("studentId");
const formTitle = document.getElementById("formTitle");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

let students = [];

function showMessage(text, error = false) {
    message.textContent = text;
    message.style.color = error ? "red" : "green";
}

async function loadStudents() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Could not load students");
        }

        students = result.data;
        totalStudents.textContent = students.length;
        renderStudents();
    } catch (error) {
        table.innerHTML =
            '<tr><td colspan="5">Could not load students. Check backend.</td></tr>';
        showMessage(error.message, true);
    }
}

function renderStudents() {
    const query = searchInput.value.trim().toLowerCase();

    const filtered = students.filter(student =>
        [student.name, student.rollNumber, student.email, student.course]
            .some(value => (value || "").toLowerCase().includes(query))
    );

    table.replaceChildren();

    if (filtered.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.textContent = "No students found.";
        row.appendChild(cell);
        table.appendChild(row);
        return;
    }

    filtered.forEach(student => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const name = document.createElement("div");
        name.className = "student-name";
        name.textContent = student.name;

        const email = document.createElement("div");
        email.className = "student-email";
        email.textContent = student.email;
        nameCell.append(name, email);

        const rollCell = document.createElement("td");
        rollCell.textContent = student.rollNumber;

        const courseCell = document.createElement("td");
        courseCell.textContent = student.course;

        const yearCell = document.createElement("td");
        yearCell.textContent = student.year;

        const actionsCell = document.createElement("td");
        const actions = document.createElement("div");
        actions.className = "actions";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => editStudent(student._id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.onclick = () => deleteStudent(student._id);

        actions.append(editButton, deleteButton);
        actionsCell.appendChild(actions);
        row.append(nameCell, rollCell, courseCell, yearCell, actionsCell);
        table.appendChild(row);
    });
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const payload = {
        name: document.getElementById("name").value.trim(),
        rollNumber: document.getElementById("rollNumber").value.trim(),
        email: document.getElementById("email").value.trim(),
        course: document.getElementById("course").value.trim(),
        year: Number(document.getElementById("year").value),
        phone: document.getElementById("phone").value.trim()
    };

    try {
        const editing = Boolean(studentId.value);

        const response = await fetch(
            editing ? `${API_URL}/${studentId.value}` : API_URL,
            {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Could not save student");
        }

        showMessage(editing ? "Student updated!" : "Student added!");
        resetForm();
        await loadStudents();
    } catch (error) {
        showMessage(error.message, true);
    }
});

function editStudent(id) {
    const student = students.find(item => item._id === id);
    if (!student) return;

    studentId.value = student._id;
    document.getElementById("name").value = student.name;
    document.getElementById("rollNumber").value = student.rollNumber;
    document.getElementById("email").value = student.email;
    document.getElementById("course").value = student.course;
    document.getElementById("year").value = student.year;
    document.getElementById("phone").value = student.phone || "";

    formTitle.textContent = "Edit Student";
    saveBtn.textContent = "Save Changes";
    cancelBtn.hidden = false;
    form.scrollIntoView({ behavior: "smooth" });
}

async function deleteStudent(id) {
    const student = students.find(item => item._id === id);

    if (!student || !confirm(`Delete ${student.name}?`)) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Could not delete student");
        }

        showMessage("Student deleted!");
        await loadStudents();
    } catch (error) {
        showMessage(error.message, true);
    }
}

function resetForm() {
    form.reset();
    studentId.value = "";
    formTitle.textContent = "Add New Student";
    saveBtn.textContent = "Add Student";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderStudents);

loadStudents();
