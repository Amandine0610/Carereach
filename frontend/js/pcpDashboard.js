
// pcpDashboard.js

// Function to fetch appointments from the API
const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/pcp/appointments'); // Ensure this endpoint is correct and working on the server
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse the response data
      const data = await response.json();
      // Pass the data to renderAppointments function
      renderAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // If the appointments container is available, show an error message
      const appointmentsContainer = document.getElementById('appointmentsContainer');
      if (appointmentsContainer) {
        appointmentsContainer.innerHTML = '<p>Unable to fetch appointments at the moment.</p>';
      }
    }
  };
  
  // Function to render appointments in the HTML
  const renderAppointments = (appointments) => {
    const appointmentsList = document.getElementById('appointments-list');
    
    // Clear the current list before adding new items
    appointmentsList.innerHTML = '';
  
    // Check if appointments are available
    if (appointments.length === 0) {
      appointmentsList.innerHTML = '<li>No appointments available.</li>';
    } else {
      // Loop through each appointment and add it to the list
      appointments.forEach(appointment => {
        const li = document.createElement('li');
        li.classList.add('appointment-item');
        li.innerHTML = `
          <strong>${appointment.title}</strong><br>
          <em>Date: ${appointment.date}</em><br>
          <em>Time: ${appointment.time}</em><br>
          <p>${appointment.description}</p>
        `;
        appointmentsList.appendChild(li);
      });
    }
  };
  
  // Ensure the DOM is fully loaded before fetching appointments
  document.addEventListener('DOMContentLoaded', fetchAppointments);
  