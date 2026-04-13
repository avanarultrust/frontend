import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // If no token, redirect immediately to home
    window.location.href = '/index.html';
    return;
  }

  try {
    // Verify token with backend
    const response = await fetch(`${API_URL}/api/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok && data.valid) {
      // Show user data
      document.getElementById('loading-indicator').style.display = 'none';
      document.getElementById('profile-content').style.display = 'block';
      
      document.getElementById('display-name').textContent = data.user.name || 'Member';
      document.getElementById('display-email').textContent = data.user.email || 'N/A';
      document.getElementById('display-mobile').textContent = data.user.mobile || 'Not Provided';
      
      // Robust ID Display
      const userId = data.user.id || data.user._id || 'unknown';
      const shortId = (userId !== 'admin' && userId.length > 6) 
                      ? userId.substring(userId.length - 6) 
                      : userId;
      document.getElementById('display-id').textContent = `#${shortId}`;

      // Fetch Donation History
      fetchDonations(token);
      
    } else {
      // Invalid token, force logout
      forceLogout();
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    forceLogout();
  }
});

async function fetchDonations(token) {
  const listContainer = document.getElementById('donation-list');
  const statImpact = document.getElementById('stat-total-impact');
  const statCount = document.getElementById('stat-count');

  try {
    const response = await fetch(`${API_URL}/api/user/donations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const donations = await response.json();

    if (donations.length === 0) {
      listContainer.innerHTML = '<p style="font-size: 0.9rem; color: var(--text-muted); text-align: center; padding: 40px;">Your mission history is empty. Start your journey today.</p>';
      return;
    }

    // Calculate metrics
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    if (statImpact) statImpact.textContent = '₹' + totalAmount.toLocaleString('en-IN');
    if (statCount) statCount.textContent = donations.length;

    // Render list
    listContainer.innerHTML = donations.map(d => `
      <div class="history-item" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: rgba(184,134,11,0.03); border-radius: 16px; border: 1px solid var(--admin-glass-border, rgba(184,134,11,0.1));">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 44px; height: 44px; background: var(--grad-gold); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white;">
            <i class="fas fa-heart"></i>
          </div>
          <div>
            <div style="font-weight: 800; font-size: 1.1rem; color: var(--primary-dark);">₹${d.amount.toLocaleString('en-IN')}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Contribution on ${new Date(d.timestamp).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}</div>
          </div>
        </div>
        <div style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #2e7d32; background: rgba(46,125,50,0.1); padding: 6px 14px; border-radius: 50px;">
          ${d.status}
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error('Error fetching donations:', err);
    listContainer.innerHTML = '<p style="color: #c0392b; text-align: center; padding: 40px;">Satellite connection interrupted. Please refresh.</p>';
  }
}

// Logout Handler
const btnLogout = document.getElementById('btn-profile-logout');
if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    forceLogout();
  });
}

function forceLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
}
