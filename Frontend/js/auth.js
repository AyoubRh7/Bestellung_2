/**
 * Authentication JavaScript
 * Handles logout functionality and token management
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get logout button if it exists
    const logoutBtn = document.getElementById("logout");
    
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            console.log("=== LOGOUT DEBUG ===");
            console.log("Before logout - localStorage keys:", Object.keys(localStorage));
            
            // Clear all authentication data
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user_id");
            localStorage.removeItem("username");
            
            console.log("After logout - localStorage keys:", Object.keys(localStorage));
            console.log("====================");
            
            // Redirect to login page
            window.location.href = "index.html";
        });
    }
    
    // Check if user is authenticated on protected pages
    function checkAuth() {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
        console.log("=== AUTH CHECK DEBUG ===");
        console.log("Current page:", window.location.pathname);
        console.log("Current URL:", window.location.href);
        console.log("Token exists:", !!token);
        console.log("Token value (first 20 chars):", token ? token.substring(0, 20) + "..." : "null");
        console.log("User role:", role);
        console.log("All localStorage keys:", Object.keys(localStorage));
        
        // Check if we're on the login page - skip auth check
        const isLoginPage = window.location.pathname.includes('index.html') || 
                           window.location.pathname === '/' ||
                           window.location.pathname.includes('login');
        
        console.log("Is login page:", isLoginPage);
        
        if (isLoginPage) {
            console.log("On login page - skipping auth check");
            console.log("=========================");
            return true;
        }
        
        if (!token || token === 'null' || token === 'undefined') {
            console.log("No valid token found - redirecting to login");
            console.log("Token details:", {
                exists: !!token,
                value: token,
                type: typeof token,
                length: token ? token.length : 0
            });
            console.log("=========================");
            alert("Bitte anmelden, um diese Seite zu nutzen.");
            window.location.href = "index.html";
            return false;
        }
        
        // For admin pages, check if user is admin
        const isAdminPage = window.location.pathname.includes('admin') ||
                           window.location.pathname.includes('dashbord') ||
                           window.location.pathname.includes('manage_');
        
        console.log("Is admin page:", isAdminPage);
        
        if (isAdminPage) {
            if (role !== 'admin') {
                console.log("User is not admin - redirecting to login");
                console.log("Expected: 'admin', Got:", role, "Type:", typeof role);
                console.log("=========================");
                alert("Zugriff verweigert. Admin-Rechte erforderlich.");
                window.location.href = "index.html";
                return false;
            } else {
                console.log("Admin access granted");
            }
        }
        
        console.log("Authentication check passed");
        console.log("=========================");
        return true;
    }
    
    // Run auth check on page load with a small delay to ensure localStorage is ready
    setTimeout(() => {
        console.log("=== RUNNING AUTH CHECK ===");
        checkAuth();
    }, 100);
});

/**
 * Get the current authentication token
 * @returns {string|null} The JWT token or null if not found
 */
function getAuthToken() {
    const token = localStorage.getItem("token");
    console.log("getAuthToken called - token exists:", !!token);
    return token;
}

/**
 * Get the current user role
 * @returns {string|null} The user role or null if not found
 */
function getUserRole() {
    const role = localStorage.getItem("role");
    console.log("getUserRole called - role:", role);
    return role;
}

/**
 * Check if user is admin
 * @returns {boolean} True if user is admin, false otherwise
 */
function isAdmin() {
    const role = getUserRole();
    const result = role === 'admin';
    console.log("isAdmin called - role:", role, "isAdmin:", result);
    return result;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
function isAuthenticated() {
    const token = localStorage.getItem("token");
    const result = !!token && token !== 'null' && token !== 'undefined';
    console.log("isAuthenticated called - token exists:", !!token, "isAuthenticated:", result);
    return result;
}