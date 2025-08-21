document.addEventListener("DOMContentLoaded", function() {
    const restaurantForm = document.getElementById("restaurant-form");
    const restaurantTableBody = document.getElementById("restaurant-table-body");

    // Handle form submission for creating a new restaurant
    restaurantForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const address = document.getElementById("address").value;
        const contactInfo = document.getElementById("contact_info").value;

        const restaurantData = {
            name: name,
            address: address,
            contact_info: contactInfo
        };

        fetch("http://localhost:8000/api/restaurants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(restaurantData)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                fetchRestaurants(); // Reload the list
                restaurantForm.reset();
            })
            .catch(error => {
                alert("Error adding restaurant");
            });
    });

    // Fetch and display all restaurants
    function fetchRestaurants() {
        fetch("http://localhost:8000/api/restaurants")
            .then(response => response.json())
            .then(data => {
                const restaurants = data.data;
                restaurantTableBody.innerHTML = ""; // Clear existing table content

                restaurants.forEach(restaurant => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${restaurant.name}</td>
                        <td>${restaurant.address}</td>
                        <td>${restaurant.contact_info}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editRestaurant(${restaurant.restaurant_id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteRestaurant(${restaurant.restaurant_id})">Delete</button>
                        </td>
                    `;
                    restaurantTableBody.appendChild(row);
                });
            })
            .catch(error => {
                alert("Error fetching restaurants");
            });
    }

    // Open Edit modal and populate the form with restaurant details
    window.editRestaurant = function(id) {
        fetch(`http://localhost:8000/api/restaurants?id=${id}`)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                const restaurant = data;
                //console.log(restaurant['name']);
                // Populate the form with existing restaurant data
                document.getElementById("editRestaurantId").value = restaurant.data.restaurant_id;
                document.getElementById("editName").value = restaurant.data.name;
                document.getElementById("editAddress").value = restaurant.data.address;
                document.getElementById("editContactInfo").value = restaurant.data.contact_info;

                // Show the edit modal
                const editModal = new bootstrap.Modal(document.getElementById("editRestaurantModal"));
                editModal.show();
            })
            .catch(error => {
                alert("Error fetching restaurant details for editing");
            });
    };

    // Handle the form submission for updating the restaurant
    document.getElementById("editRestaurantForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const restaurantId = document.getElementById("editRestaurantId").value;
        const name = document.getElementById("editName").value;
        const address = document.getElementById("editAddress").value;
        const contactInfo = document.getElementById("editContactInfo").value;

        const restaurantData = {
            name: name,
            address: address,
            contact_info: contactInfo
        };

        fetch(`http://localhost:8000/api/restaurants?id=${restaurantId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(restaurantData)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                fetchRestaurants(); // Reload the list
                document.getElementById("editRestaurantModal").modal("hide"); // Close the modal
            })
            .catch(error => {
                alert("Error updating restaurant");
            });
    });

    // Delete restaurant
    window.deleteRestaurant = function(id) {
        if (confirm("Are you sure you want to delete this restaurant?")) {
            fetch(`http://localhost:8000/api/restaurants?id=${id}`, {
                method: "DELETE"
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    fetchRestaurants(); // Reload the list
                })
                .catch(error => {
                    alert("Error deleting restaurant");
                });
        }
    };

    // Load the restaurants list on page load
    fetchRestaurants();
});
