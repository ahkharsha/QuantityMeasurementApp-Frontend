# Quantity Measurement App

A vanilla JavaScript web application for converting, comparing, and performing arithmetic on different units of measurement, designed with modular ES6 patterns and a RESTful mock backend.

## Features Implemented

### UC1: Create JSON Server Database

- **Database Initialization:** Established a robust `db.json` schema utilizing `json-server` to mock a REST API, providing dedicated endpoints for `units`, `conversions`, and `history`.
- **Data Seeding:** Populated the database with comprehensive records for Length, Weight, Temperature, and Volume, including both multiplier factors and specific evaluation formulas (e.g., Celsius to Fahrenheit) to support future dynamic runtime calculations.

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
