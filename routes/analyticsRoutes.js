// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalAppointments = await Appointment.count();
        const approvedAppointments = await Appointment.count({ where: { status: 'approved' } });
        
        res.json({
            totalUsers,
            totalAppointments,
            approvedAppointments,
            successRate: ((approvedAppointments / totalAppointments) * 100).toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});