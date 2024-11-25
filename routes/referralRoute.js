const express = require('express');
const { createReferralHandler, getReferralsHandler } = require('../controllers/referralController');

const router = express.Router();

// Routes
router.post('/referrals', createReferralHandler);
router.get('/referrals', getReferralsHandler);

module.exports = router;
