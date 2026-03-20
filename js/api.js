/**
 * Quantity Measurement App - API Module
 * Handles all HTTP communication with the JSON Server backend.
 * @author Developer
 * @version 1.0
 */

export const BASE_URL = "http://localhost:3000";

/**
 * Fetches measurement units for a given conceptual type.
 * @param {string} type - The measurement category (e.g., "Length", "Weight")
 * @returns {Promise<Array>} Array of unit objects
 * @throws {Error} If the HTTP request fails
 */
export async function getUnits(type) {
    const res = await fetch(`${BASE_URL}/units?type=${type}`);
    
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }
    
    return await res.json();
}

/**
 * Fetches the conversion factor or formula between two units.
 * @param {string} from - The symbol of the source unit (e.g., "m")
 * @param {string} to - The symbol of the target unit (e.g., "cm")
 * @returns {Promise<Object>} The conversion object containing factor or formula
 * @throws {Error} If no conversion exists or the request fails
 */
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

/**
 * Saves a calculation record to the history database.
 * @param {Object} record - The details of the calculation
 * @returns {Promise<Object|null>} The saved record with database ID, or null if failed
 */
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
