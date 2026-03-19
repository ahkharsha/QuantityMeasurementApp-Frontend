/**
 * API Module Tests
 * Validates network communication functions and error handling.
 * @author Developer
 * @version 1.0
 */

import { getUnits, BASE_URL } from '../js/api.js';
import { jest } from '@jest/globals';

describe('UC-JS-03: Fetch Units by Type', () => {
    
    beforeEach(() => {
        // Clear all mock history between tests
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Validates successful fetch resolutions and correctly parameterized fetch calls
    test('should fetch units from the correct URL and return parsed JSON data', async () => {
        const mockUnits = [
            { id: "1", type: "Length", label: "Meter", symbol: "m" },
            { id: "2", type: "Length", label: "Kilometer", symbol: "km" }
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUnits
        });

        const data = await getUnits('Length');
        
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/units?type=Length`);
        expect(data).toEqual(mockUnits);
    });

    // Ensures proper error throwing when the HTTP response is not ok
    test('should throw an ordered error when network request fails (e.g. 404)', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        });

        await expect(getUnits('Length')).rejects.toThrow('HTTP 404');
    });

    // Validates that unexpected network failures (e.g., server offline) reject safely
    test('should bubble up generic fetch errors if server is totally offline', async () => {
        global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

        await expect(getUnits('Weight')).rejects.toThrow('Failed to fetch');
    });
});
