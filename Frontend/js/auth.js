document.getElementById("logout").addEventListener("click", function(){
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href("index.html");
});