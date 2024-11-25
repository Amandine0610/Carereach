// Fetch Appointments from API
async function fetchAppointments() {
    try {
        const response = await fetch('/api/patients/appointments');
        appointments = await response.json();
        renderAppointments();
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}

// Function to render appointments
function renderAppointments() {
    const appointmentList = document.getElementById('appointment-list');
    if (appointments.length === 0) {
        appointmentList.innerHTML = `
            <p>No appointments yet. Schedule one below:</p>
            <button onclick="scheduleAppointment()">Schedule Appointment</button>
        `;
    } else {
        appointmentList.innerHTML = `
            <ul>
                ${appointments
                    .map((appt, index) => `
                        <li>
                            <strong>${appt.date}</strong> with Dr. ${appt.doctor}
                            <button onclick="deleteAppointment(${index})">Cancel</button>
                        </li>
                    `)
                    .join('')}
            </ul>
            <button onclick="scheduleAppointment()">Schedule Another Appointment</button>
        `;
    }
}

// Function to schedule a new appointment
function scheduleAppointment() {
    const doctor = prompt("Enter the doctor's name:");
    const date = prompt("Enter the appointment date (e.g., 2024-11-30):");
    if (doctor && date) {
        appointments.push({ doctor, date });
        renderAppointments();
        alert("Appointment scheduled successfully!");
    } else {
        alert("Appointment scheduling canceled.");
    }
}

// Function to delete an appointment
function deleteAppointment(index) {
    const confirmDelete = confirm("Are you sure you want to cancel this appointment?");
    if (confirmDelete) {
        appointments.splice(index, 1);
        renderAppointments();
        alert("Appointment canceled successfully!");
    }
}

// Function to render health records
function renderHealthRecords() {
    const recordsList = document.getElementById('records-list');
    if (healthRecords.length === 0) {
        recordsList.innerHTML = "<p>No health records available.</p>";
    } else {
        recordsList.innerHTML = `
            <ul>
                ${healthRecords
                    .map(
                        (record) => `
                        <li>
                            <strong>${record.date}:</strong> ${record.details}
                        </li>
                    `
                    )
                    .join('')}
            </ul>
        `;
    }
}

// Function to add a health record
function addHealthRecord() {
    const details = prompt("Enter the health record details:");
    const date = new Date().toLocaleDateString();
    if (details) {
        healthRecords.push({ date, details });
        renderHealthRecords();
        alert("Health record added successfully!");
    } else {
        alert("Adding health record canceled.");
    }
}

// Function to update personal information
function updatePersonalInfo() {
    const name = prompt("Enter your full name:");
    const contact = prompt("Enter your contact number:");
    const email = prompt("Enter your email address:");
    if (name && contact && email) {
        alert(`Personal information updated successfully:\n
        Name: ${name}\n
        Contact: ${contact}\n
        Email: ${email}`);
    } else {
        alert("Personal information update canceled.");
    }
}

// Function to render notifications
function renderNotifications() {
    const notificationList = document.getElementById('notification-list');
    if (notifications.length === 0) {
        notificationList.innerHTML = "<p>No new notifications.</p>";
    } else {
        notificationList.innerHTML = `
            <ul>
                ${notifications
                    .map(
                        (note) => `
                        <li>
                            ${note}
                        </li>
                    `
                    )
                    .join('')}
            </ul>
        `;
    }
}

// Initial Render Calls
renderAppointments();
renderHealthRecords();
renderNotifications();
