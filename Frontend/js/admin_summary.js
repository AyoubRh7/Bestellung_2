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
    return Number(value).toFixed(2);
  }

  /**
   * Load and display the order summary from the server
   * Fetches order data with prices and calculates totals
   */
  async function loadSummary() {
    // Get the authentication token from browser storage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Missing token. Please log in as admin.');
      return;
    }

    // Build the API URL with optional date filter
    const date = dateInput.value ? `?date=${encodeURIComponent(dateInput.value)}` : '';
    const res = await fetch(`http://localhost:8000/api/orders/summary${date}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Check if the request was successful
    if (!res.ok) {
      const msg = await res.text();
      alert(`Failed to load summary: ${msg}`);
      return;
    }
    
    // Parse the JSON response
    const json = await res.json();

    // Clear the existing table rows
    tbody.innerHTML = '';
    
    // Add each order item as a table row
    (json.data || []).forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.order_date}</td>
        <td>${row.order_id}</td>
        <td>${row.restaurant_name}</td>
        <td>${row.user_name}</td>
        <td>${row.item_name}</td>
        <td class="text-end">${row.quantity}</td>
        <td class="text-end">${formatMoney(row.price)}</td>
        <td class="text-end">${formatMoney(row.line_total)}</td>
      `;
      tbody.appendChild(tr);
    });
    
    // Update the grand total at the bottom of the table
    grandTotalEl.textContent = formatMoney(json.grand_total || 0);
  }

  // Set up event listeners
  loadButton.addEventListener('click', loadSummary);
  
  // Auto-load summary when page opens (convenience feature)
  loadSummary();
});


