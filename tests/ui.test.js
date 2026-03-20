/**
 * UI Module Tests
 * Validates DOM rendering and updates.
 * @author Developer
 * @version 1.0
 * @jest-environment jsdom
 */

import { populateDropdown } from '../js/ui.js';
import { jest } from '@jest/globals';

describe('UC-JS-10: Populate Unit Dropdown', () => {
    let selectEl;
    let consoleWarnSpy;

    beforeEach(() => {
        document.body.innerHTML = '<select id="unit-dropdown"></select>';
        selectEl = document.querySelector('#unit-dropdown');
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should populate dropdown with default option and unit data', () => {
        const mockUnits = [
            { id: "1", type: "Length", label: "Meter", symbol: "m" },
            { id: "2", type: "Length", label: "Centimeter", symbol: "cm" }
        ];

        populateDropdown(selectEl, mockUnits);

        const options = selectEl.querySelectorAll('option');
        expect(options.length).toBe(3); // 1 default + 2 units

        expect(options[0].textContent).toBe("-- Select Unit --");
        expect(options[0].disabled).toBe(true);

        expect(options[1].value).toBe("m");
        expect(options[1].textContent).toBe("Meter (m)");

        expect(options[2].value).toBe("cm");
        expect(options[2].textContent).toBe("Centimeter (cm)");
    });

    test('should safely render only the default prompt if units array is empty', () => {
        populateDropdown(selectEl, []);
        
        const options = selectEl.querySelectorAll('option');
        expect(options.length).toBe(1);
        expect(options[0].textContent).toBe("-- Select Unit --");
    });

    test('should warn and safely return early if select element is null', () => {
        populateDropdown(null, []);
        
        expect(consoleWarnSpy).toHaveBeenCalledWith("Dropdown element not found in DOM");
    });
});
