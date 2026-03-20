/*
 * Application Initialization Tests
 * Verifies the integrity of the global state and DOM lifecycle hooks.
 * @author Developer
 * @version 1.0
 * @jest-environment jsdom
 */

import { state, initApp } from '../js/app.js';
import { jest } from '@jest/globals';

global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => []
});

// Tests the default runtime initialization hooks locking the state correctly.
describe('App Initialisation Validation', () => {
    
    // Ensures the state object has all required initial properties and values
    test('State object should be initialized with correct exact default properties', () => {
        expect(state).toHaveProperty('type', 'Length');
        expect(state).toHaveProperty('action', 'Conversion');
        expect(state).toHaveProperty('fromVal', null);
        expect(state).toHaveProperty('fromUnit', '');
        expect(state).toHaveProperty('toVal', null);
        expect(state).toHaveProperty('toUnit', '');
        expect(state).toHaveProperty('operator', '+');
    });

    // Tests if the main initialization flow runs successfully without crashing
    test('initApp should safely execute without unhandled exceptions', async () => {
        await expect(initApp()).resolves.not.toThrow();
    });
});

// Tests overarching state changes and load triggers when a top type card is clicked.
describe('UC-JS-15: Handle Type Card Click', () => {
    beforeEach(async () => {
        document.body.innerHTML = `
            <div class="type-container">
                <div class="type-card card-active" data-type="Length">Length</div>
                <div class="type-card" data-type="Temperature" id="temp-card">Temp</div>
            </div>
            <input id="from-value" value="10" />
            <input id="to-value" value="20" />
            <select id="from-unit"></select>
            <select id="to-unit"></select>
            <span id="result-value"></span>
            <span id="result-unit"></span>
        `;
        // Manually trigger the event listener attachment hook securely
        await initApp();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should update state and clear inputs when clicking a type card', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => []
        });

        const tempCard = document.querySelector('#temp-card');
        
        // Wait for asynchronous listener handling
        await tempCard.click();

        // 1. State updated
        expect(state.type).toBe("Temperature");

        // 2. Inputs cleared
        expect(document.querySelector("#from-value").value).toBe("");
        expect(document.querySelector("#to-value").value).toBe("");

        // 3. API was called explicitly mapping the Temperature array request
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("type=Temperature"));
    });
});

// Tests state shifts and operator UI permutations when the Action mode changes.
describe('UC-JS-16: Handle Action Tab Click', () => {
    beforeEach(async () => {
        document.body.innerHTML = `
            <div class="action-container">
                <button class="action-btn active" data-action="Conversion">Conv</button>
                <button class="action-btn" data-action="Arithmetic" id="arithmetic-tab">Arith</button>
            </div>
            <div id="operator-selector" style="display: none;">
                <button class="operator-btn" data-op="+">+</button>
                <button class="operator-btn" data-op="-">-</button>
            </div>
            <input id="from-value" value="10" />
            <input id="to-value" value="20" />
            <span id="result-value"></span>
            <span id="result-unit"></span>
        `;
        await initApp();
    });

    test('should update states, clear inputs, and toggle operators when clicking Arithmetic', () => {
        const arithTab = document.querySelector('#arithmetic-tab');
        
        arithTab.click();

        // 1. State updated
        expect(state.action).toBe("Arithmetic");
        expect(state.operator).toBe("+");
        expect(state.fromVal).toBeNull();
        expect(state.toVal).toBeNull();

        // 2. Inputs cleared
        expect(document.querySelector("#from-value").value).toBe("");
        expect(document.querySelector("#to-value").value).toBe("");

        // 3. UI Operators updated visually
        expect(document.querySelector('#operator-selector').classList.contains('d-flex')).toBe(true);
        expect(document.querySelector('.operator-btn[data-op="+"]').classList.contains('active')).toBe(true);
    });
});

// Tests calculation execution protections bounding empty or invalid global states.
describe('Execute Calculation', () => {
    beforeEach(async () => {
        document.body.innerHTML = `
            <input id="from-value" value="" />
            <input id="to-value" value="" />
            <select id="from-unit"><option value="m">m</option></select>
            <select id="to-unit"><option value="cm">cm</option></select>
            <span id="result-value"></span>
            <span id="result-unit"></span>
        `;
        await initApp();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should properly intercept null state values bounding early exits safely', async () => {
        const fromInput = document.querySelector('#from-value');
        fromInput.value = "";
        
        // Manual input dispatch
        fromInput.dispatchEvent(new Event('input'));
        
        // Assert state correctly evaluated explicit null boundary silently without DOM crashes
        expect(state.fromVal).toBeNull();
    });
});