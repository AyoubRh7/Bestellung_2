/**
 * Admin Summary JavaScript
 * Handles the admin order summary page functionality
 * Shows all orders with prices, quantities, and totals
 */
document.addEventListener('DOMContentLoaded', () => {
  // Get references to important page elements
  const loadButton = document.getElementById('load-summary');
  const dateInput = document.getElementById('summary-date');
  const tbody = document.getElementById('summary-body');
  const grandTotalEl = document.getElementById('grand-total');

  /**
   * Format a number as currency with 2 decimal places
   * @param {number} value - The number to format
   * @returns {string} Formatted currency string
   */
  function formatMoney(value) {
    return `€${Number(value).toFixed(2)}`;
  }

  /**
   * Check if user is properly authenticated as admin
   * @returns {boolean} True if authenticated as admin
   */
  function checkAdminAuth() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('=== AUTHENTICATION DEBUG ===');
    console.log('Token exists:', !!token);
    console.log('Token length:', token ? token.length : 0);
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('User role:', role);
    console.log('All localStorage keys:', Object.keys(localStorage));
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

  /**
   * Load and display the order summary from the server
   * Fetches order data with prices and calculates totals
   */
  async function loadSummary() {
    // Check authentication first
    if (!checkAdminAuth()) {
      return;
    }

    try {
      // Show loading state
      loadButton.disabled = true;
      loadButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Laden...';
      
      // Get the authentication token from browser storage
      const token = localStorage.getItem('token');
      
      // Build the API URL with optional date filter
      const date = dateInput.value ? `?date=${encodeURIComponent(dateInput.value)}` : '';
      const url = `http://localhost:8000/api/orders/summary${date}`;
      
      console.log('=== API REQUEST DEBUG ===');
      console.log('Fetching from URL:', url);
      console.log('Request headers:', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Check if the request was successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
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
      
      // Parse the JSON response
      const data = await response.json();
      console.log('API Success Response:', data);
      
      // Clear the existing table rows
      tbody.innerHTML = '';
      
      // Check if we have data
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
      
      // Add each order item as a table row
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
      
      // Update the grand total at the bottom of the table
      const grandTotal = data.grand_total || 0;
      grandTotalEl.textContent = formatMoney(grandTotal);
      
      // Show success message
      console.log(`✅ Successfully loaded ${data.data.length} order items with total: ${formatMoney(grandTotal)}`);
      
    } catch (error) {
      console.error('❌ Error loading summary:', error);
      alert(`Fehler beim Laden der Übersicht: ${error.message}`);
    } finally {
      // Reset button state
      loadButton.disabled = false;
      loadButton.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Übersicht laden';
    }
  }

  // Set up event listeners
  loadButton.addEventListener('click', loadSummary);
  
  // Auto-load summary when page opens (convenience feature)
  // Add a small delay to ensure DOM is ready
  setTimeout(() => {
    loadSummary();
  }, 100);
});


