document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get("id");

    fetch(`http://localhost:8000/api/menu?restaurant_id=${restaurantId}`, {
        headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}
    })
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data);
            let container = document.getElementById("menuList");
            if (Array.isArray(data.data)) {
                data.data.forEach(item => {
                    let card = document.createElement("div");
                    card.innerHTML = `
                <div class="card p-3 text-center">
                <img src="${item.image ? item.image : '../assets/images/placeholder.png'}" claas = "img-fluid" alt="dish">
                <h5>${item.item_name}</h5>
                <p>${item.price} €</p>
                <button class="btn btn-primary add-to-cart" data-id="${item.menu_id}">Add to Cart</button>
                </div>
`;
                    container.appendChild(card);
                });
            } else {
                alert("No valid data found.");
            }
        })
    .catch(error => {
        console.error("Error: ",error);
        alert("FAILED TO LAOD menu; ", error.message);
    });
});