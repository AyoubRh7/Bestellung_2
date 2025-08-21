document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let container = document.getElementById("cartList");
    let totalPrice = 0;

    cart.forEach((item) => {
        let card = document.createElement("div");
        card.classList.add("col-md-4", "mb-3");
        card.innerHTML = `
        <div class="card p-3 text-center">
        <img src="${item.image ? item.image : 'images/placeholder.png'}' }" class="img-fluid" alt="Dish image">
        <h5>${item.name}</h5>
        <p>${item.price} €</p>
        <p>Quantit: ${item.quantity}</p>
        </div>
        `;
        totalPrice += item.price * item.quantity
        container.appendChild(card);
    });

    document.getElementById("totalPrice").innerText(totalPrice.toFixed(2));

    document.getElementById("container").addEventListener("click", () => {
        fetch("http://localhost:8000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({items: cart})
        })
            .then(response => response.json())
            .then(data => {
                alert("Order added successfully");
                localStorage.removeItem("cart");
                window.location.href = "orders.html";
            });
    });
});