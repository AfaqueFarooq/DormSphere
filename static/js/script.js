document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from reloading the page

    // Get values from input fields
    const city = document.getElementById('city').value;
    const max_price = document.getElementById('max_price').value;
    const language = document.getElementById('language').value;

    // Construct the URL with query parameters
    const url = `/rooms?city=${city}&max_price=${max_price}&language=${language}`;

    // Fetch data from the server using AJAX (GET request)
    fetch(url)
        .then(response => response.json()) // Assuming Flask is returning JSON
        .then(data => {
            const roomListDiv = document.getElementById('room-list');
            roomListDiv.innerHTML = ''; // Clear current room list

            // Check if rooms were returned
            if (data.rooms && data.rooms.length > 0) {
                // Iterate through rooms and display them
                data.rooms.forEach(room => {
                    const roomDiv = document.createElement('div');
                    roomDiv.classList.add('room');

                    roomDiv.innerHTML = `
                        <h3>${room.name}</h3>
                        <p>City: ${room.location.city}</p>
                        <p>Price: £${room.price_per_month_gbp} per month</p>
                        <p>Languages: ${room.spoken_languages.join(', ')}</p>
                        <div class="weather">
                            <p>Temperature: ${room.weather.temperature}°C</p>
                            <p>Condition: ${room.weather.weather_condition}</p>
                            <p>Wind: ${room.weather.wind_speed} km/h, Direction: ${room.weather.wind_direction}</p>
                        </div>
                        <button class="apply-btn" data-room-id="${room.id}">Apply for Room</button>

                    `;
                    roomListDiv.appendChild(roomDiv);
                });
                addApplyRoomListeners();

            } else {
                roomListDiv.innerHTML = `<p>No rooms found matching your search criteria.</p>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('room-list').innerHTML = `<p>Error fetching rooms. Please try again later.</p>`;
        });
});

// Apply For Room listner
function addApplyRoomListeners() {
    const applyButtons = document.querySelectorAll('.apply-btn');
    const modal = document.getElementById('apply-modal');
    const closeModalButton = document.querySelector('.close-btn');
    const roomIdField = document.getElementById('modal-room-id');
    const applyForm = document.getElementById('apply-form');

    // Open Modal on Apply Button Click
    applyButtons.forEach(button => {
        button.addEventListener('click', function () {

            // console.log('Button clicked, opening modal...'); // Debug log


            const roomId = this.getAttribute('data-room-id'); // Fetch room ID
            // console.log("Room ID:", roomId);  // Check the room ID in the console

          


            roomIdField.value = roomId; // Set the room ID in the hidden input

            modal.style.display = 'flex'; // Show modal
        });
    });

    // Close Modal on Close Button Click
    closeModalButton.addEventListener('click', function () {
        modal.style.display = 'none'; // Hide modal
    });

    // Handle Form Submission
    applyForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Gather form data
        const roomId = document.getElementById('modal-room-id').value;
        const userName = document.getElementById('user-name').value;
        const userEmail = document.getElementById('user-email').value;
        const userMessage = document.getElementById('user-message').value;
        const roomLoc = document.getElementById('room-location').value;



        // Send data to server
        fetch('/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId, userName, userEmail, userMessage ,roomLoc}),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Application Submitted Successfully!') {
                    alert('Application submitted successfully!');
                } else {
                    alert('Failed to submit application. Please try again.');
                }
                modal.style.display = 'none'; // Close the modal
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            });
    });
}

// View Application History
document.getElementById('history-btn').addEventListener('click', function () {
    // Show the application history div
    const applicationHistoryDiv = document.getElementById('application-history');
    applicationHistoryDiv.style.display = 'block'; // Ensure the history section is visible

    // Fetch application history from the server
    fetch('/applications', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            const applicationList = document.getElementById('application-list');
            applicationList.innerHTML = ''; // Clear existing history

            // Check if applications exist
            if (data.applications && data.applications.length > 0) {
                // Iterate through applications and display them
                data.applications.forEach((app, index) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <strong>Room ID:</strong> ${app.room_id} <br>
                        <strong>Name:</strong> ${app.name} <br>
                        <strong>Email:</strong> ${app.email} <br>
                        <strong>Room:</strong> ${app.message} <br>
                        <strong>City:</strong> ${app.location}<br>   
                       
                         <strong>Status:</strong> <span id="status-${index}">${app.status}</span> <br>

                       <button class="cancel-btn" data-id="${index}">Cancel</button>

                        <hr>
                    `;
                    applicationList.appendChild(listItem);
                });
                addCancelButtonListeners(); // Add event listeners for cancel buttons

            } else {
                applicationList.innerHTML = `<li>No applications found.</li>`;
            }
        })
        .catch(error => {
            console.error('Error fetching applications:', error);
            alert('Failed to load application history. Please try again later.');
        });
});

// listeners for cancel buttons
function addCancelButtonListeners() {
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function () {
            const applicationId = this.getAttribute('data-id'); // Get application ID

            // Send request to cancel the application
            fetch(`/applications/${applicationId}/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Application cancelled successfully!') {
                        alert('Application cancelled successfully!');
                        document.getElementById(`status-${applicationId}`).textContent = 'Cancelled';
                    } else {
                        alert('Failed to cancel application. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error cancelling application:', error);
                    alert('An error occurred. Please try again later.');
                });
        });
    });
}
