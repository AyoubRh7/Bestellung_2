// JavaScript for managing menus
document.addEventListener("DOMContentLoaded", function() {
    const restaurantSelect = document.getElementById('restaurantSelect');
    const loadMenuButton = document.getElementById('loadMenuButton');
    const menuTable = document.getElementById('menuTable').getElementsByTagName('tbody')[0];
    const addMenuForm = document.getElementById('addMenuForm');

    let selectedRestaurantId = null;

    // Fetch the list of restaurants and populate the select dropdown
    fetch('http://localhost:8000/api/restaurants')  // Replace with the actual API endpoint
        .then(response => response.json())
        .then(data => {
            //console.log(data)
            const restaurants = data.data;  // Assuming the response contains 'data' with restaurant list
            restaurants.forEach(restaurant => {
                //console.log(restaurant.restaurant_id);
                const option = document.createElement('option');
                option.value = restaurant.restaurant_id;
                option.textContent = restaurant["name"];
                restaurantSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error loading restaurants:", error);
        });

    // Load the menu for the selected restaurant
    loadMenuButton.addEventListener('click', () => {
        selectedRestaurantId = restaurantSelect.value;
        console.log(restaurantSelect.value);
        if (selectedRestaurantId) {
            fetch(`http://localhost:8000/api/menu?restaurant_id=${selectedRestaurantId}`)
                .then(response => response.json())
                .then(data => {
                    //console.log(data.data);
                    const menuItems = data.data;
                    menuTable.innerHTML = '';  // Clear current table
                    menuItems.forEach(item => {
                        console.log(item);
                        const row = menuTable.insertRow();
                        row.innerHTML = `
                            <td>${item.item_name}</td>
                            <td>${item.price}</td>
                            <td>
                                <button class="btn btn-warning" onclick="updateMenuItem(${item.id})">Update</button>
                                <button class="btn btn-danger" onclick="deleteMenuItem(${item.id})">Delete</button>
                            </td>
                        `;
                    });
                })
                .catch(error => {
                    console.error("Error loading menu:", error);
                });
        } else {
            alert("Please select a restaurant.");
        }
    });

    // Handle form submission to add a new menu item
    addMenuForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const itemName = document.getElementById('item_name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;

        fetch(`http://localhost:8000/api/menu?restaurant_id=${selectedRestaurantId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                item_name: itemName,
                description: description,
                price: price
            })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadMenuButton.click(); // Reload menu list
            })
            .catch(error => {
                console.error("Error adding menu item:", error);
            });
    });

    // Update a menu item
    window.updateMenuItem = function(id) {
        const newName = prompt("Enter new item name:");
        const newDescription = prompt("Enter new description:");
        const newPrice = prompt("Enter new price:");

        fetch(`http://localhost:8000/api/menu/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                item_name: newName,
                description: newDescription,
                price: newPrice
            })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadMenuButton.click(); // Reload menu list
            })
            .catch(error => {
                console.error("Error updating menu item:", error);
            });
    };

    // Delete a menu item
    window.deleteMenuItem = function(id) {
        if (confirm("Are you sure you want to delete this item?")) {
            fetch(`http://localhost:8000/api/menu/${id}`, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    loadMenuButton.click(); // Reload menu list
                })
                .catch(error => {
                    console.error("Error deleting menu item:", error);
                });
        }
    };
});
