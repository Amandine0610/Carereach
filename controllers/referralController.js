
// Create a referral
const createReferralHandler = async (req, res) => {
  try {
    const referral = await createReferral(req.body);
    res.status(201).json({ message: 'Referral created successfully', referral });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all referrals
const getReferralsHandler = async (req, res) => {
  try {
    const referrals = await getAllReferrals();
    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createReferralHandler, getReferralsHandler };
