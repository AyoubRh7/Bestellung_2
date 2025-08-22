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
            
            // Also clear sessionStorage backup
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("user_id");
            sessionStorage.removeItem("username");
            
            console.log("After logout - localStorage keys:", Object.keys(localStorage));
            console.log("After logout - sessionStorage keys:", Object.keys(sessionStorage));
            console.log("====================");
            
            // Redirect to login page
            window.location.href = "index.html";
        });
    }
    
    // Check if user is authenticated on protected pages
    function checkAuth() {
        // Wait a bit longer for localStorage to be ready after page load
        setTimeout(() => {
            performAuthCheck();
        }, 200);
    }
    
    function performAuthCheck() {
        // First try to get token from URL parameters (backup method)
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        const urlRole = urlParams.get('role');
        
        if (urlToken) {
            console.log("Found token in URL - restoring to localStorage");
            localStorage.setItem("token", urlToken);
            if (urlRole) localStorage.setItem("role", urlRole);
            
            // Clean URL by removing token parameters
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
        
        let token = localStorage.getItem("token");
        let role = localStorage.getItem("role");
        
        // If localStorage is empty, try sessionStorage as backup
        if (!token) {
            console.log("No token in localStorage, checking sessionStorage...");
            token = sessionStorage.getItem("token");
            role = sessionStorage.getItem("role");
            
            if (token) {
                console.log("Found token in sessionStorage - restoring to localStorage");
                localStorage.setItem("token", token);
                if (role) localStorage.setItem("role", role);
            }
        }
        
        console.log("=== AUTH CHECK DEBUG ===");
        console.log("Current page:", window.location.pathname);
        console.log("Current URL:", window.location.href);
        
        // Debug localStorage in detail
        console.log("=== LOCALSTORAGE DETAILED DEBUG ===");
        console.log("All localStorage items:");
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`  ${key}: "${value}" (type: ${typeof value}, length: ${value?.length})`);
        }
        console.log("Token specifically:", {
            value: token,
            type: typeof token,
            length: token?.length,
            isNull: token === null,
            isStringNull: token === "null",
            isUndefined: token === undefined,
            isStringUndefined: token === "undefined",
            isEmpty: token === "",
            truthiness: !!token
        });
        console.log("===================================");
        
        // Check if we're on a login page - skip auth check
        const isLoginPage = window.location.pathname.includes('index.html') || 
                           window.location.pathname === '/' ||
                           window.location.pathname.endsWith('/') ||
                           window.location.pathname.includes('login');
        
        console.log("Is login page:", isLoginPage);
        
        if (isLoginPage) {
            console.log("On login page - skipping auth check");
            console.log("=========================");
            return true;
        }
        
        // Check for valid token
        const hasValidToken = token && 
                             token !== null && 
                             token !== "null" && 
                             token !== undefined && 
                             token !== "undefined" && 
                             token !== "" &&
                             token.length > 0;
        
        console.log("Token validation:", {
            exists: !!token,
            notNull: token !== null,
            notStringNull: token !== "null",
            notUndefined: token !== undefined,
            notStringUndefined: token !== "undefined",
            notEmpty: token !== "",
            hasLength: token?.length > 0,
            finalResult: hasValidToken
        });
        
        if (!hasValidToken) {
            console.log("❌ NO VALID TOKEN FOUND");
            console.log("Redirecting to login page...");
            console.log("=========================");
            
            // Clear any invalid tokens
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user_id");
            localStorage.removeItem("username");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("user_id");
            sessionStorage.removeItem("username");
            
            alert("Bitte anmelden, um diese Seite zu nutzen.");
            window.location.href = "index.html";
            return false;
        }
        
        console.log("✅ VALID TOKEN FOUND");
        
        // For admin pages, check if user is admin
        const isAdminPage = window.location.pathname.includes('admin') ||
                           window.location.pathname.includes('dashbord') ||
                           window.location.pathname.includes('manage_');
        
        console.log("Is admin page:", isAdminPage);
        console.log("User role:", role, "Type:", typeof role);
        
        if (isAdminPage) {
            if (role !== 'admin') {
                console.log("❌ USER IS NOT ADMIN");
                console.log("Expected: 'admin', Got:", role);
                console.log("=========================");
                alert("Zugriff verweigert. Admin-Rechte erforderlich.");
                window.location.href = "index.html";
                return false;
            } else {
                console.log("✅ ADMIN ACCESS GRANTED");
            }
        }
        
        console.log("✅ AUTHENTICATION CHECK PASSED");
        console.log("=========================");
        return true;
    }
    
    // Run auth check immediately
    checkAuth();
});

/**
 * Get the current authentication token
 * @returns {string|null} The JWT token or null if not found
 */
function getAuthToken() {
    let token = localStorage.getItem("token");
    if (!token) {
        token = sessionStorage.getItem("token");
        if (token) {
            localStorage.setItem("token", token); // Restore to localStorage
        }
    }
    console.log("getAuthToken called - token exists:", !!token);
    return token;
}

/**
 * Get the current user role
 * @returns {string|null} The user role or null if not found
 */
function getUserRole() {
    let role = localStorage.getItem("role");
    if (!role) {
        role = sessionStorage.getItem("role");
        if (role) {
            localStorage.setItem("role", role); // Restore to localStorage
        }
    }
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
    const token = getAuthToken();
    const result = !!(token && 
                     token !== "null" && 
                     token !== "undefined" && 
                     token !== "" && 
                     token.length > 0);
    console.log("isAuthenticated called - result:", result);
    return result;
}