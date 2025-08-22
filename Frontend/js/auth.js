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
        
        if (!token) {
            alert("Please log in to access this page.");
            window.location.href = "index.html";
            return false;
        }
        
        // For admin pages, check if user is admin
        if (window.location.pathname.includes('admin') || 
            window.location.pathname.includes('dashbord') ||
            window.location.pathname.includes('manage_')) {
            if (role !== 'admin') {
                alert("Access denied. Admin privileges required.");
                window.location.href = "index.html";
                return false;
            }
        }
        
        return true;
    }
    
    // Run auth check on page load
    checkAuth();
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