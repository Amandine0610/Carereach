function fetchReferrals() {
    fetch('http://localhost:3000/api/specialist/referrals', {
        method: 'GET',
        headers: { 
            'Authorization': 'Bearer YOUR_JWT_TOKEN'  // Replace with actual token
        }
    })
    .then(response => response.json())
    .then(data => {
        let referralsHTML = '';
        if (data && data.referrals) {
            data.referrals.forEach(referral => {
                referralsHTML += `
                    <div class="referral-item">
                        <h4>Patient Name: ${referral.patientName}</h4>
                        <p>Reason: ${referral.reason}</p>
                        <button onclick="viewReferralDetails(${referral.id})">View Details</button>
                    </div>
                `;
            });
        } else {
            referralsHTML = '<p>No referrals available.</p>';
        }
        document.getElementById('referral-list').innerHTML = referralsHTML;
    })
    .catch(error => {
        console.error('Error fetching referrals:', error);
    });
}

function viewReferralDetails(referralId) {
    // Logic to view referral details, such as opening a modal or navigating to a detail page
    console.log('View referral details for ID:', referralId);
}

// Call fetchReferrals when the page loads
window.onload = function() {
    fetchReferrals();
};