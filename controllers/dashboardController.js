// controllers/dashboardController.js

exports.getDashboard = (req, res) => {
    // Example data - In a real application, fetch user data from the database or session
    const user = {
        name: req.user.name, // Assuming `req.user` holds user info after login
        role: req.user.role
    };

    // Pass the user data to the dashboard view
    res.render('dashboard', { user });
};
