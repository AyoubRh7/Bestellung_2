document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:8000/api/orders", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
        .then(response => {
            // Check if the response is ok (status code 200)
            if (!response.ok) {
                return Promise.reject("Failed to load orders: " + response.statusText);
            }

            // Log the raw response to debug
            return response.text();  // Get the raw response as text
        })
        .then(responseText => {
            console.log("Raw response:", responseText);  // Log the raw response

            // Try to parse it as JSON
            try {
                const data = JSON.parse(responseText);
                console.log("Parsed data:", data);  // Log parsed data

                let table = document.getElementById("ordersList");
                data.forEach(order => {
                    let row = document.createElement("tr");
                    row.innerHTML = `
                    <td>${order.order_id}</td>
                    <td>${order.user}</td>
                    <td>${order.total_items}</td>
                    <td>${order.order_date}</td>
                `;
                    table.appendChild(row);
                });
            } catch (error) {
                console.error("Error parsing JSON:", error);
                alert("Failed to parse the response as JSON: " + error.message);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert("FAILED TO LOAD orders: " + error.message);
        });
});
