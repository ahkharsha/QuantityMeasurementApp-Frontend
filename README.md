# Quantity Measurement App

A vanilla JavaScript web application for converting, comparing, and performing arithmetic on different units of measurement, designed with modular ES6 patterns and a RESTful mock backend.

## Features Implemented

### UC1: Create JSON Server Database
- **Database Initialization:** Established a robust `db.json` schema utilizing `json-server` to mock a REST API, providing dedicated endpoints for `units`, `conversions`, and `history`.
- **Data Seeding:** Populated the database with comprehensive records for Length, Weight, Temperature, and Volume, including both multiplier factors and specific evaluation formulas (e.g., Celsius to Fahrenheit) to support future dynamic runtime calculations.

### UC2: App Initialisation
* **Global State Management:** Implemented a centralized `state` object in `app.js` to synchronously track selected measurement types, actions, input values, and mathematical operators across the application lifecycle.
* **Asynchronous Lifecycle Bootstrapping:** Configured a `DOMContentLoaded` event listener to autonomously trigger initial data fetching (`loadUnits`) on page load, incorporating try/catch exception handling to safely update the UI if the mock REST API is offline.

### UC3: Fetch Units by Type
- **REST Integration:** Created the `api.js` module to dynamically fetch context-specific measurement units from the local JSON Server endpoint (`/units?type=...`) via the native JavaScript Fetch API.
- **Error Handling & Testing:** Implemented HTTP status validation for bulletproof network requests, and verified all outcomes by fully mocking the fetch module within the new `api.test.js` suite.

## Tech Stack

- HTML5 / CSS3 / Bootstrap 5
- Vanilla JavaScript (ES6+ Modules)
- JSON Server (Mock API)
- Jest (Testing)

## How to Run

1. Open a terminal in the project root and run `npm install` to load dependencies.
2. Start the mock backend by running `npm start`.
3. Open `index.html` in your web browser (or use VS Code Live Server) to view the application.
4. **To run tests:** Execute `npm test` in the terminal to run the Jest test suite.
