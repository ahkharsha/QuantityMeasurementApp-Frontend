/**
 * API Module Tests
 * Validates network communication functions and error handling.
 * @author Developer
 * @version 1.0
 */

import { getUnits, getConversion, saveHistory, getHistory, BASE_URL } from '../js/api.js';
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

describe('UC-JS-04: Fetch Conversion Record', () => {
    
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Validates that it queries the correct url and unwraps the json-server array
    test('should fetch conversion record and return the first match', async () => {
        const mockConversion = [{ id: "1", from: "m", to: "cm", factor: 100, formula: null }];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockConversion
        });

        const data = await getConversion('m', 'cm');
        
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/conversions?from=m&to=cm`);
        expect(data).toEqual(mockConversion[0]);
    });

    // Validates safe handling of missing elements via json-server empty array responses
    test('should throw "No conversion found" error when the returned array is empty', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

        await expect(getConversion('kg', 'm')).rejects.toThrow('No conversion found');
    });
});

describe('UC-JS-05: Save to History', () => {
    let consoleErrorSpy;

    beforeEach(() => {
        global.fetch = jest.fn();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Validates that it dispatches the correctly serialized POST request
    test('should save history record and return successfully without throwing', async () => {
        const mockRecord = { type: "Length", action: "Conversion", expression: "1 m to cm", result: "100", timestamp: "12345" };
        const mockServerResponse = { id: "10", ...mockRecord };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockServerResponse
        });

        const data = await saveHistory(mockRecord);
        
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mockRecord)
        });
        expect(data).toEqual(mockServerResponse);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    // Validates that history persistence is non-blocking when network fails
    test('should suppress errors and return null when the save request fails', async () => {
        global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

        const data = await saveHistory({ test: "data" });
        
        expect(data).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();
    });
});

describe('UC-JS-06: Load History', () => {
    let consoleErrorSpy;

    beforeEach(() => {
        global.fetch = jest.fn();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Verifies valid sorted API fetching logic
    test('should fetch and return sorted history records', async () => {
        const mockRecords = [
            { id: "2", type: "Weight", result: "20", timestamp: "9999" },
            { id: "1", type: "Length", result: "10", timestamp: "1111" }
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockRecords
        });

        const data = await getHistory();
        
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/history?_sort=timestamp&_order=desc`);
        expect(data).toEqual(mockRecords);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    // Confirms offline state is safely mitigated into rendering an empty array
    test('should suppress connection errors and return empty array', async () => {
        global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

        const data = await getHistory();
        
        expect(data).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalled();
    });
});
