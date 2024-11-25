// controllers/appointmentController.js

// Sample data structure for appointments (in a real application, use a database)
let appointments = [];

// Create a new appointment
exports.createAppointment = (req, res) => {
    const { patientName, appointmentDate, department } = req.body;
    const newAppointment = {
        id: appointments.length + 1,
        patientName,
        appointmentDate,
        department
    };
    appointments.push(newAppointment);
    res.redirect('/appointments');
};

// Read all appointments
exports.getAppointments = (req, res) => {
    res.render('appointments', { appointments });
};

// Update an appointment by ID
exports.updateAppointment = (req, res) => {
    const { id } = req.params;
    const { patientName, appointmentDate, department } = req.body;
    const appointment = appointments.find(app => app.id === parseInt(id));
    if (appointment) {
        appointment.patientName = patientName;
        appointment.appointmentDate = appointmentDate;
        appointment.department = department;
    }
    res.redirect('/appointments');
};

// Delete an appointment by ID
exports.deleteAppointment = (req, res) => {
    const { id } = req.params;
    appointments = appointments.filter(app => app.id !== parseInt(id));
    res.redirect('/appointments');
};
