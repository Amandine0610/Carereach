// Fetch users to populate the user table
async function fetchUsers() {
    try {
        const response = await fetch('/users');
        const users = await response.json();
        
        // Dynamically create table rows
        const tableBody = document.querySelector('#user-table tbody');
        tableBody.innerHTML = '';  // Clear previous rows

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>
                    <button class="btn btn-info" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deactivateUser(${user.id})">Deactivate</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error('Error fetching users:', err);
    }
}

// Function to handle editing a user
function editUser(userId) {
    // Fetch user data from backend
    fetch(`/users/${userId}`)
        .then(res => res.json())
        .then(user => {
            // Pre-fill the edit modal with user data
            document.getElementById('edit-username').value = user.username;
            document.getElementById('edit-role').value = user.role;
            document.getElementById('edit-status').value = user.status;

            // Open the modal (using Bootstrap modal example)
            $('#editUserModal').modal('show');
            document.getElementById('edit-username').dataset.userId = user.id; // Store the user ID for submitting changes
        });
}

// Handle form submission to update the user
document.getElementById('editUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('edit-username').dataset.userId;  // Get user ID
    const role = document.getElementById('edit-role').value;
    const status = document.getElementById('edit-status').value;

    const response = await fetch(`/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, status }),
    });

    const updatedUser = await response.json();
    
    // Close the modal and update the table
    $('#editUserModal').modal('hide');
    fetchUsers();  // Re-fetch the users to show updated data
});

// Deactivate user function
async function deactivateUser(userId) {
    const response = await fetch(`/users/${userId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        fetchUsers();  // Refresh the user list
    }
}

// Call fetchUsers on page load
window.onload = fetchUsers;
