document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:8000/api/deadline", {
        headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
    })
        .then(response => response.json())
        .then(data => {
            if(data.deadline) {
                // Set the deadline to the returned value or default to 11:00 AM
                let deadline = data.deadline ? data.deadline : '11:00';
                document.getElementById("deadlinePicker").value = deadline;
            }
        });

    document.getElementById("saveDeadline").addEventListener("click", function() {
        let deadlineTime = document.getElementById("deadlinePicker").value;
        let formattedDeadline = formatDeadlineForDB(deadlineTime);
        // Ensure the deadline is valid (you can add more validation if necessary)
        if (formattedDeadline) {
            console.log("Formatted Deadline: ", formattedDeadline);

            fetch("http://localhost:8000/api/deadline", {
                method: "POST", // Set method to POST
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ deadline: formattedDeadline })
            })
                .then(response => {
                    // Log the response to the console
                    console.log("Response:", response);
                    return response.text();})
                .then(() => {
                    alert("Deadline set successfully.");
                })
                .catch(error => {
                    console.error("Error setting the deadline:", error);
                    alert("Failed to set deadline.");
                });
        } else {
            alert("Please select a valid deadline.");
        }
    });
});

function formatDeadlineForDB(deadline) {
    let date = new Date(deadline);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-based, so we add 1
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}