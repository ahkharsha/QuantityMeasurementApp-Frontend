# Quantity Measurement App

A clean Vanilla JavaScript app for converting, comparing, and doing math with different measurements, using a local database.

## Features Implemented

### UC1: Create Database
- **Setup Database:** Created a local `db.json` file to store units, conversion math, and history.
- **Add Data:** Filled it with starting data for Length, Weight, Temperature, and Volume to make calculations work.

### UC2: App Initialization
- **Track App State:** Created a `state` object so the app remembers what the user selected.
- **Load On Startup:** Made the app automatically fetch database info when the page loads, and safely handle server errors.

### UC3: Fetch Units 
- **Get Units from Server:** Created `api.js` to securely load specific units (like all "Weight" units) from the database.
- **Handle Network Drops:** Added code to catch offline connection errors safely, proven by automated tests.

### UC4: Fetch Conversions
- **Get Math Rules:** Added a function to securely fetch the exact multiplier or formula needed to convert two units.
- **Catch Missing Pairs:** Made sure the app safely throws a clear error if it tries to convert an unsupported pair.

### UC5: Save to History
- **Record History:** Added a function to send successful calculations back directly to the local database.
- **Prevent Crashes:** If saving fails because the server is offline, the app quietly ignores the error instead of crashing.

### UC6: Load History
- **Load Past Records:** Downloaded all previous calculations, automatically sorting them so the newest ones appear first.
- **Offline Fallback:** If the network drops, the app safely skips loading history to ensure the screen doesn't break.

### UC7: Apply Conversion
- **Calculate Math:** Created `conversion.js` to securely calculate math, like multiplying by factors or evaluating formulas.
- **Keep Numbers Clean:** Blocked bad inputs and made sure answers are cleanly rounded to 6 decimal places to prevent messy displays.

### UC8: Arithmetic Operations
- **Add and Subtract:** Built a safe math tool to explicitly add or subtract two measurements together.
- **Fix Decimals:** Prevented messy native JavaScript floating-point errors (where 0.1 + 0.2 gives `0.3000...4`).

### UC9: Compare Values
- **Compare Measurements:** Added code to securely evaluate whether one measurement is bigger, smaller, or equal to another.
- **Readable Sentences:** Returns clean, human-friendly sentences explaining the final comparison.

### UC10: Populate Dropdown
- **Dynamic Options:** Built `populateDropdown` to rebuild HTML `<select>` option elements using backend unit lists.
- **Fail-Safe DOM:** Securely checks for missing DOM nodes, gracefully degrading to safe console warnings without crashing.

### UC11: Set Active Button
- **Manage Selection:** Built `setActive` to flawlessly guarantee only currently clicked buttons or action tabs are highlighted.
- **Smart Sibling Clearing:** Automatically seeks out natively directly neighboring buttons to safely strip their active statuses.

### UC12: Show Result
- **Display Answers:** Added `showResult` to cleanly project final math calculations and comparison sentences directly onto the screen.
- **Visual Feedback:** Built a smooth highlight animation that flashes on the result box for exactly 1.5 seconds so users know their math finished loading.

## Tech Stack

- HTML5 / CSS3 / Bootstrap 5
- Vanilla JavaScript
- JSON Server
- Jest (Testing)

## How to Run

1. Open your terminal and run `npm install`.
2. Start the database by running `npm start`.
3. Open `index.html` in your web browser (or VS Code Live Server).
4. **To run tests:** Enter `npm test` to verify the automated tests.