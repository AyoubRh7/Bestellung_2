document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username: email, password: password})

    })
        .then(response => response.json())
        .then(data => {if(data.status === "success") {
            console.log(data.token);
            console.log(data.role);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            if(data.role === "admin") {
                window.location.href = "dashbord.html";
            } else {
                window.location.href = "restaurants.html";
            }
        } else {
            alert  ("Anmeldung fehlgeschlagen: " + data.message);
        }
    })
        .catch((error) => {console.error("Error: ",error);
        });
})