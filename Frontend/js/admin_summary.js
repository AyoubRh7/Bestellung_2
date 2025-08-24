/**
 * Admin Summary JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
  const loadButton = document.getElementById('load-summary');
  const dateInput = document.getElementById('summary-date');
  const tbody = document.getElementById('summary-body');
  const grandTotalEl = document.getElementById('grand-total');

  function formatMoney(value) {
    return `€${Number(value).toFixed(2)}`;
  }

  // Decode JWT payload (helper for role extraction)
  function decodeJwt(token) {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  }

  function checkAdminAuth() {
    const token = localStorage.getItem('token');
    let role = localStorage.getItem('role');

    if (!role && token) {
      const payload = decodeJwt(token);
      role = payload.role || payload.userRole || null;
    }

    console.log('=== AUTHENTICATION DEBUG ===');
    console.log('Token exists:', !!token);
    console.log('Token length:', token ? token.length : 0);
    console.log('Decoded role:', role);
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

      const token = localStorage.getItem('token');
      const date = dateInput.value ? `?date=${encodeURIComponent(dateInput.value)}` : '';
      const url = `http://localhost:8000/api/orders/summary${date}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          alert('Anmeldung fehlgeschlagen. Bitte erneut als Admin anmelden.');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          window.location.href = 'index.html';
          return;
        }
        alert(`Übersicht laden fehlgeschlagen: ${errorText}`);
        return;
      }

      const data = await response.json();
      tbody.innerHTML = '';

      if (!data.data || data.data.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="text-center text-muted py-4">
              <i class="fas fa-inbox fa-2x mb-3"></i><br>
              Keine Bestellungen für dieses Datum gefunden
            </td>
          </tr>`;
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
          <td class="text-end fw-bold">${formatMoney(row.line_total || 0)}</td>`;
        tbody.appendChild(tr);
      });

      grandTotalEl.textContent = formatMoney(data.grand_total || 0);
    } catch (err) {
      alert(`Fehler beim Laden der Übersicht: ${err.message}`);
    } finally {
      loadButton.disabled = false;
      loadButton.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Übersicht laden';
    }
  }

  loadButton.addEventListener('click', loadSummary);
  setTimeout(loadSummary, 100);
});
