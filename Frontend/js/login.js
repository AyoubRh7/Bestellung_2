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
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("=== FULL LOGIN RESPONSE ===");
        console.log("Complete response:", data);
        console.log("================================");
        
        // Check for success - handle both possible response formats
        const isSuccess = data.status === "success" || data.success === true || data.success === "true";
        
        if(isSuccess && data.token) {
            console.log("Login successful! Setting localStorage...");
            
            // Store the data
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            
            // Store additional data if available
            if(data.user_id) localStorage.setItem("user_id", data.user_id);
            if(data.username) localStorage.setItem("username", data.username);
            
            // IMMEDIATE TEST - Force localStorage sync
            const immediateTest = localStorage.getItem("token");
            console.log("IMMEDIATE TEST after setting:", immediateTest);
            localStorage.getItem("token"); // Force read to ensure write completed
            
            // Test after 1 second to check persistence
            setTimeout(() => {
                console.log("1 SECOND TEST:", localStorage.getItem("token"));
            }, 1000);
            
            // CRITICAL: Verify localStorage was set before redirecting
            const storedToken = localStorage.getItem("token");
            const storedRole = localStorage.getItem("role");
            
            console.log("=== VERIFICATION BEFORE REDIRECT ===");
            console.log("Original token:", data.token);
            console.log("Stored token:", storedToken);
            console.log("Tokens match:", data.token === storedToken);
            console.log("Stored role:", storedRole);
            console.log("localStorage keys:", Object.keys(localStorage));
            console.log("====================================");
            
            // Only redirect if localStorage was successfully set
            if (storedToken && storedToken === data.token) {
                // Also try sessionStorage as backup
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("role", data.role);
                console.log("Backup stored in sessionStorage");
                
                // Use URL parameters as additional backup
                const tokenParam = encodeURIComponent(data.token);
                let redirectUrl;
                
                if(data.role === "admin") {
                    redirectUrl = `dashbord.html?token=${tokenParam}&role=admin`;
                    console.log("Redirecting admin to dashboard with token backup...");
                } else {
                    redirectUrl = `restaurants.html?token=${tokenParam}&role=${data.role}`;
                    console.log("Redirecting employee to restaurants with token backup...");
                }
                
                // Use a longer delay to ensure localStorage persistence
                setTimeout(() => {
                    console.log("=== FINAL CHECK BEFORE REDIRECT ===");
                    console.log("Token still exists:", !!localStorage.getItem("token"));
                    console.log("Role still exists:", !!localStorage.getItem("role"));
                    console.log("SessionStorage token:", !!sessionStorage.getItem("token"));
                    console.log("Redirect URL:", redirectUrl);
                    console.log("===================================");
                    
                    window.location.href = redirectUrl;
                }, 500); // Increased delay even more
            } else {
                console.error("CRITICAL: localStorage failed to store token!");
                console.error("Expected:", data.token);
                console.error("Got:", storedToken);
                alert("Anmeldung fehlgeschlagen: Speicherfehler. Bitte versuchen Sie es erneut.");
            }
            
        } else {
            console.log("Login failed:");
            console.log("- Success check:", isSuccess);
            console.log("- Token exists:", !!data.token);
            
            const errorMessage = data.message || data.error || "Unbekannter Fehler";
            alert("Anmeldung fehlgeschlagen: " + errorMessage);
        }
    })
    .catch((error) => {
        console.error("=== LOGIN ERROR ===");
        console.error("Error:", error);
        console.error("===================");
        alert("Anmeldung fehlgeschlagen: " + error.message);
    });
});