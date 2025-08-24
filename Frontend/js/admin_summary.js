/**
 * Admin Summary JavaScript
 * Handles the admin order summary page functionality
 * Shows all orders with prices, quantities, and totals
 */
document.addEventListener('DOMContentLoaded', () => {
  const loadButton = document.getElementById('load-summary');
  const dateInput = document.getElementById('summary-date');
  const tbody = document.getElementById('summary-body');
  const grandTotalEl = document.getElementById('grand-total');

  function formatMoney(value) {
    return `€${Number(value).toFixed(2)}`;
  }

  /**
   * Get token + role from localStorage or sessionStorage
   */
  function getAuthData() {
    let token = localStorage.getItem('token') || sessionStorage.getItem('token');
    let role = localStorage.getItem('role') || sessionStorage.getItem('role');
    return { token, role };
  }

  /**
   * Check if user is authenticated as admin
   */
  function checkAdminAuth() {
    const { token, role } = getAuthData();

    console.log('=== AUTHENTICATION DEBUG ===');
    console.log('Token exists:', !!token);
    console.log('Token length:', token ? token.length : 0);
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('User role:', role);
    console.log('===========================');

    if (!token) {
      alert('Token fehlt. Bitte als Admin anmelden.');
      window.location.href = 'index.html';
      return false;
    }

    if (role !== 'admin') {
      alert('Zugriff verweigert. Admin-Rechte nötig.');
      window.location.href = 'index.html';
      return false;
    }

    return true;
  }

  async function loadSummary() {
    if (!checkAdminAuth()) return;

    try {
      loadButton.disabled = true;
      loadButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Laden...';

      const { token } = getAuthData();
      const date = dateInput.value ? `?date=${encodeURIComponent(dateInput.value)}` : '';
      const url = `http://localhost:8000/api/orders/summary${date}`;

      console.log('=== API REQUEST DEBUG ===');
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);

        if (response.status === 401) {
          alert('Anmeldung fehlgeschlagen. Bitte erneut als Admin anmelden.');
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = 'index.html';
          return;
        }

        alert(`Übersicht laden fehlgeschlagen: ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log('API Success Response:', data);

      tbody.innerHTML = '';

      if (!data.data || data.data.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="text-center text-muted py-4">
              <i class="fas fa-inbox fa-2x mb-3"></i>
              <br>Keine Bestellungen für dieses Datum gefunden
            </td>
          </tr>
        `;
        grandTotalEl.textContent = formatMoney(0);
        return;
      }

      data.data.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${index * 0.1}s`;
        tr.className = 'fade-in-up';

        tr.innerHTML = `
          <td>${row.order_date || 'N/V'}</td>
          <td>${row.order_id || 'N/V'}</td>
          <td>${row.restaurant_name || 'N/V'}</td>
          <td>${row.user_name || 'N/V'}</td>
          <td>${row.item_name || 'N/V'}</td>
          <td class="text-end">${row.quantity || 0}</td>
          <td class="text-end">${formatMoney(row.price || 0)}</td>
          <td class="text-end fw-bold">${formatMoney(row.line_total || 0)}</td>
        `;
        tbody.appendChild(tr);
      });

      const grandTotal = data.grand_total || 0;
      grandTotalEl.textContent = formatMoney(grandTotal);

      console.log(`✅ Successfully loaded ${data.data.length} order items with total: ${formatMoney(grandTotal)}`);
    } catch (error) {
      console.error('❌ Error loading summary:', error);
      alert(`Fehler beim Laden der Übersicht: ${error.message}`);
    } finally {
      loadButton.disabled = false;
      loadButton.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Übersicht laden';
    }
  }

  loadButton.addEventListener('click', loadSummary);

  setTimeout(() => {
    loadSummary();
  }, 100);
});
