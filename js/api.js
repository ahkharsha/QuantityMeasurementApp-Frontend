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
