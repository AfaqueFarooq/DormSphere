# Global Dorm - Student Accommodation Finder

## Overview
Global Dorm is a distributed system designed to help international and exchange students find long-term accommodation (3 months or more) in the UK. The application allows students to browse room listings, apply for rooms, check application statuses, and view past applications. Additionally, it provides key features such as proximity to campus and weather forecasts for the location of each room.

This project demonstrates the use of **Service-Oriented Architecture (SOA)** principles, emphasizing loose coupling, modularity, and interoperability. It integrates external REST services to provide a seamless user experience. The system is built using **Flask** for the backend and **JavaScript, HTML, and CSS** for the frontend. JSON data is parsed and serialized/deserialized using Python, ensuring efficient communication between components.

---

## Features
1. **Room Search**: Browse available rooms with details such as room ID, location, price per month, and spoken languages in shared houses.
2. **Room Application**: Apply for a room, cancel an application, and view the status of applications (accepted, rejected, cancelled, or pending).
3. **Proximity to Campus**: Check how close a room is to a specific campus.
4. **Weather Forecast**: Display the weather forecast for the location of each room using the **OpenWeatherMap API**.
5. **RESTful Communication**: All communication between the client and the Orchestrator service is done using JSON, with Python handling serialization and deserialization.

---

## System Architecture
The system consists of the following components:
1. **Orchestrator Service**: A RESTful service built using Flask that handles all client requests, interacts with external APIs, and manages room data.
2. **Client Application**: A frontend application built with JavaScript, HTML, and CSS that communicates with the Orchestrator service to display room listings, application statuses, and weather forecasts.
3. **External Services**:
   - **OpenWeatherMap API**: Provides weather forecasts for room locations.
   - (Optional) **Distance Calculation Service**: Used to calculate proximity to campus.

---

## Technologies Used
- **Backend**: Flask (Python)
- **Frontend**: JavaScript, HTML, CSS
- **APIs**: OpenWeatherMap API
- **Data Format**: JSON for all communication, parsed and serialized/deserialized using Python
- **Error Handling**: Robust error handling for external service unavailability, timeouts, and invalid responses.

---

## How to Use
### Prerequisites
1. Python 3.x
2. Flask (`pip install flask`)
3. OpenWeatherMap API key (sign up at [OpenWeatherMap](https://openweathermap.org/api))

