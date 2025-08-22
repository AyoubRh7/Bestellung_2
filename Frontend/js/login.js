document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("=== LOGIN DEBUG ===");
    console.log("Attempting login with username:", email);

    fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username: email, password: password})

    })
        .then(response => response.json())
        .then(data => {
            console.log("Login response:", data);
            
            if(data.status === "success") {
                console.log("Login successful!");
                console.log("Token:", data.token ? "Present" : "Missing");
                console.log("Role:", data.role);
                
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                
                console.log("Stored in localStorage:");
                console.log("- token:", localStorage.getItem("token") ? "Present" : "Missing");
                console.log("- role:", localStorage.getItem("role"));

                if(data.role === "admin") {
                    console.log("Redirecting admin to dashboard...");
                    window.location.href = "dashbord.html";
                } else {
                    console.log("Redirecting employee to restaurants...");
                    window.location.href = "restaurants.html";
                }
            } else {
                console.log("Login failed:", data.message);
                alert("Anmeldung fehlgeschlagen: " + data.message);
            }
        })
        .catch((error) => {
            console.error("Login error:", error);
            alert("Anmeldung fehlgeschlagen: " + error.message);
        });
})