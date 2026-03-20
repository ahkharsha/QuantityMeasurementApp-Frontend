/**
 * Quantity Measurement App - API Module
 * Handles all HTTP communication with the JSON Server backend.
 * @author Developer
 * @version 1.0
 */

// export const BASE_URL = "http://localhost:3000";
export const BASE_URL = "https://quantitymeasurementapp.onrender.com";

// Fetches measurement units for a given conceptual type.
export async function getUnits(type) {
    const res = await fetch(`${BASE_URL}/units?type=${type}`);
    
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }
    
    return await res.json();
}

// Fetches the conversion factor or formula between two units.
export async function getConversion(from, to) {
    const res = await fetch(`${BASE_URL}/conversions?from=${from}&to=${to}`);
    
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }
    
    const data = await res.json();
    if (!data || data.length === 0) {
        throw new Error("No conversion found");
    }
    
    return data[0];
}

// Saves a calculation record to the history database.
export async function saveHistory(record) {
    try {
        const res = await fetch(`${BASE_URL}/history`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(record)
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Failed to save history:", error);
        return null;
    }
}

/**
 * Fetches all history records from the database.
 * Manually sorts them newest-first to ensure compatibility across all json-server versions.
 */
export async function getHistory() {
    try {
        const res = await fetch(`${BASE_URL}/history`);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        
        // Manually sort descending by timestamp so the newest is at the top
        return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
        console.error("Failed to fetch history data:", error);
        return [];
    }
}