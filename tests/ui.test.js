/**
 * UI Module Tests
 * Validates DOM rendering and updates.
 * @author Developer
 * @version 1.0
 * @jest-environment jsdom
 */

import { populateDropdown, setActive, showResult, toggleOperators, renderHistory } from '../js/ui.js';
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

describe('UC-JS-11: Set Active Button', () => {
    let parentEl;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="button-container">
                <button class="action-btn active" id="btn1">1</button>
                <button class="action-btn" id="btn2">2</button>
                <button class="action-btn" id="btn3">3</button>
            </div>
        `;
        parentEl = document.querySelector('#button-container');
    });

    test('should add active class to clicked element and remove from siblings', () => {
        const btn2 = document.querySelector('#btn2');
        setActive(parentEl, btn2, '.action-btn');

        expect(document.querySelector('#btn1').classList.contains('active')).toBe(false);
        expect(document.querySelector('#btn2').classList.contains('active')).toBe(true);
        expect(document.querySelector('#btn3').classList.contains('active')).toBe(false);
    });

    test('should safely return early if parent element is null', () => {
        const btn2 = document.querySelector('#btn2');
        setActive(null, btn2, '.action-btn');

        // State remains unchanged because parent was null
        expect(document.querySelector('#btn1').classList.contains('active')).toBe(true);
        expect(document.querySelector('#btn2').classList.contains('active')).toBe(false);
    });
});

describe('UC-JS-12: Show Result', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="result-panel">
                <span id="result-value"></span>
                <span id="result-unit"></span>
            </div>
        `;
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test('should display numeric value and unit correctly', () => {
        showResult(25.5, 'kg');
        expect(document.querySelector('#result-value').textContent).toBe('25.5');
        expect(document.querySelector('#result-unit').textContent).toBe('kg');
    });

    test('should display dash fallback if value is null', () => {
        showResult(null, 'm');
        expect(document.querySelector('#result-value').textContent).toBe('—');
    });

    test('should handle comparison mode string smoothly without units', () => {
        showResult("2 kg is GREATER than 100 g", "");
        expect(document.querySelector('#result-value').textContent).toBe("2 kg is GREATER than 100 g");
        expect(document.querySelector('#result-unit').textContent).toBe("");
    });

    test('should trigger highlight animation class correctly for 1500ms', () => {
        showResult(10, 'm');
        const panel = document.querySelector('.result-panel');
        
        expect(panel.classList.contains('highlight')).toBe(true);
        
        jest.advanceTimersByTime(1000);
        expect(panel.classList.contains('highlight')).toBe(true);

        jest.advanceTimersByTime(500);
        expect(panel.classList.contains('highlight')).toBe(false);
    });
});

describe('UC-JS-13: Toggle Operator Row', () => {
    let opRow;
    let consoleWarnSpy;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="operator-selector" style="display: none;"></div>
        `;
        opRow = document.querySelector('#operator-selector');
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should set display to flex when show is true', () => {
        toggleOperators(true);
        expect(opRow.style.display).toBe('flex');
    });

    test('should set display to none when show is false', () => {
        opRow.style.display = 'flex'; // Initial state
        toggleOperators(false);
        expect(opRow.style.display).toBe('none');
    });

    test('should log warning and safely return if element is missing', () => {
        document.body.innerHTML = ''; // Remove the element
        toggleOperators(true);
        expect(consoleWarnSpy).toHaveBeenCalledWith("Operator selector row not found in DOM");
    });
});

describe('UC-JS-14: Render History List', () => {
    let listEl;
    let consoleWarnSpy;

    beforeEach(() => {
        document.body.innerHTML = `
            <ul id="history-list"></ul>
        `;
        listEl = document.querySelector('#history-list');
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should render "No history yet." if records array is empty', () => {
        renderHistory([]);
        expect(listEl.innerHTML).toContain("<li>No history yet.</li>");
    });

    test('should treat undefined or null records strictly as empty arrays safely', () => {
        renderHistory(undefined);
        expect(listEl.innerHTML).toContain("<li>No history yet.</li>");
    });

    test('should correctly render list items populated with history data', () => {
        const mockRecords = [
            { expression: "1 m to cm", result: 100, timestamp: "2026-03-20T10:00:00Z" },
            { expression: "5 kg to g", result: 5000, timestamp: "2026-03-20T11:00:00Z" }
        ];
        
        renderHistory(mockRecords);
        const listItems = listEl.querySelectorAll('li');
        
        expect(listItems.length).toBe(2);
        
        // Assert substrings explicitly exist avoiding exact timezone date comparisons
        expect(listItems[0].textContent).toContain("1 m to cm  =  100");
        expect(listItems[1].textContent).toContain("5 kg to g  =  5000");
    });

    test('should safely intercept missing history list DOM target via console output', () => {
        document.body.innerHTML = '';
        renderHistory([]);
        expect(consoleWarnSpy).toHaveBeenCalledWith("History list container not found in DOM");
    });
});
