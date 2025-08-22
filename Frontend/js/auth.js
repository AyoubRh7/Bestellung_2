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
            // Clear all authentication data
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user_id");
            localStorage.removeItem("username");
            
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
        console.log("Token exists:", !!token);
        console.log("User role:", role);
        console.log("All localStorage:", Object.keys(localStorage));
        console.log("=========================");
        
        if (!token) {
            console.log("No token found - redirecting to login");
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
                alert("Zugriff verweigert. Admin-Rechte erforderlich.");
                window.location.href = "index.html";
                return false;
            } else {
                console.log("Admin access granted");
            }
        }
        
        console.log("Authentication check passed");
        return true;
    }
    
    // Run auth check on page load with a small delay to ensure localStorage is ready
    setTimeout(() => {
        checkAuth();
    }, 100);
});

/**
 * Get the current authentication token
 * @returns {string|null} The JWT token or null if not found
 */
function getAuthToken() {
    return localStorage.getItem("token");
}

/**
 * Get the current user role
 * @returns {string|null} The user role or null if not found
 */
function getUserRole() {
    return localStorage.getItem("role");
}

/**
 * Check if user is admin
 * @returns {boolean} True if user is admin, false otherwise
 */
function isAdmin() {
    return getUserRole() === 'admin';
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
function isAuthenticated() {
    return !!localStorage.getItem("token");
}