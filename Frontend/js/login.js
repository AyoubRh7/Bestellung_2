document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("=== LOGIN DEBUG ===");
    console.log("Attempting login with username:", email);
    console.log("Form data being sent:", { username: email, password: "***" });

    fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username: email, password: password})
    })
    .then(response => {
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);
        return response.json();
    })
    .then(data => {
        console.log("=== FULL LOGIN RESPONSE ===");
        console.log("Complete response object:", data);
        console.log("Response keys:", Object.keys(data));
        console.log("Status value:", data.status);
        console.log("Status type:", typeof data.status);
        console.log("Success value:", data.success);
        console.log("Success type:", typeof data.success);
        console.log("Token exists:", !!data.token);
        console.log("Role:", data.role);
        console.log("================================");
        
        // Check for both possible success indicators
        const isSuccess = data.status === "success" || data.success === true || data.success === "true";
        
        if(isSuccess && data.token) {
            console.log("Login successful!");
            console.log("Token:", data.token ? "Present" : "Missing");
            console.log("Role:", data.role);
            
            // Store token and role
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            
            // Store additional user info if available
            if(data.user_id) {
                localStorage.setItem("user_id", data.user_id);
            }
            if(data.username) {
                localStorage.setItem("username", data.username);
            }
            
            console.log("=== LOCALSTORAGE VERIFICATION ===");
            console.log("Stored token:", localStorage.getItem("token") ? "Present" : "Missing");
            console.log("Stored role:", localStorage.getItem("role"));
            console.log("All localStorage keys:", Object.keys(localStorage));
            console.log("===================================");

            // Add a small delay before redirect to ensure localStorage is set
            setTimeout(() => {
                if(data.role === "admin") {
                    console.log("Redirecting admin to dashboard...");
                    window.location.href = "dashbord.html";
                } else {
                    console.log("Redirecting employee to restaurants...");
                    window.location.href = "restaurants.html";
                }
            }, 100);
            
        } else {
            console.log("Login failed - analyzing response:");
            console.log("- Expected status='success', got:", data.status);
            console.log("- Expected success=true, got:", data.success);
            console.log("- Token present:", !!data.token);
            
            const errorMessage = data.message || data.error || "Unbekannter Fehler";
            alert("Anmeldung fehlgeschlagen: " + errorMessage);
        }
    })
    .catch((error) => {
        console.error("=== LOGIN ERROR ===");
        console.error("Error details:", error);
        console.error("Error message:", error.message);
        console.error("===================");
        alert("Anmeldung fehlgeschlagen: " + error.message);
    });
});