document.addEventListener("DOMContentLoaded", async function() {
    fetch("http://localhost:8000/api/restaurants",{
        headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
    })
        .then(response => response.json())
        .then(data => {
            let container = document.getElementById("restaurantsList");
            if (Array.isArray(data.data)) {
                data.data.forEach(restaurant => {
                    let card = document.createElement("div");
                    card.classList.add("col-md-4", "mb-3");
                    card.innerHTML = `
                <div class="card p-3 text-center">
                <h5>${restaurant.name}</h5>
                <p>${restaurant.address}</p>
                <a href="menu.html?id=${restaurant.restaurant_id}" class="btn btn-primary">View Menu</a>
                
                </div>
`;
                    container.appendChild(card);
                });
            } else {
                alert("Failed to load restaurants: No valid data found.");
            }
        })
    .catch(error => {
        console.error("Error: ",error);
        alert("FAILED TO LAOD RESTARANTS: ",error.message);
    });

});