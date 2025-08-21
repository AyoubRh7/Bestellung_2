document.addEventListener("DOMContentLoaded", function() {
    const orderDateForm = document.getElementById("order-date-form");
    const ordersListContainer = document.getElementById("orders-list");
    const ordersTableBody = document.getElementById("orders-table-body");
    const selectedDateElement = document.getElementById("selected-date");
    const exportBtn = document.getElementById("export-btn");

    // Handle date selection and fetch orders
    orderDateForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const selectedDate = document.getElementById("order-date").value;
        if (!selectedDate) {
            alert("Please select a date.");
            return;
        }

        // Update the date display in the header
        selectedDateElement.textContent = selectedDate;

        // Fetch orders for the selected date
        fetchOrders(selectedDate);
    });

    // Fetch and display orders for a specific date
    function fetchOrders(date) {
        fetch(`http://localhost:8000/api/orders/${date}`)
            .then(response => response.json())
            .then(data => {
                const orders = data;
                ordersTableBody.innerHTML = ""; // Clear existing orders

                if (orders && orders.length > 0) {
                    orders.forEach(order => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${order.restaurant_name}</td>
                            <td>${order.user_name}</td>
                            <td>${order.ordered_item_name}</td>
                        `;
                        ordersTableBody.appendChild(row);
                    });

                    ordersListContainer.style.display = "block"; // Show orders table
                } else {
                    alert("No orders found for the selected date.");
                }
            })
            .catch(error => {
                alert("Error fetching orders.");
            });
    }

    exportBtn.addEventListener("click", function() {
        // Initiate a fetch request to export all orders as CSV
        window.location.href = "http://localhost:8000/api/orders/export";
    });
});
