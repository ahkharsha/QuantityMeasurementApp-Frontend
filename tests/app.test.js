/**
 * Application Initialization Tests
 * Verifies the integrity of the global state and DOM lifecycle hooks.
 * @author Developer
 * @version 1.0
 * @jest-environment jsdom
 */

import { state } from '../js/app.js';
import { jest } from '@jest/globals';

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

    // Tests if the main initialization flow runs successfully on DOMContentLoaded without crashing
    test('DOMContentLoaded listener should safely execute without unhandled exceptions', () => {
        const event = new Event('DOMContentLoaded');
        expect(() => document.dispatchEvent(event)).not.toThrow();
    });
});

describe('UC-JS-15: Handle Type Card Click', () => {
    beforeEach(() => {
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
        // Manually trigger the event listener attachment hook by triggering DOMContentLoaded
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
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

describe('UC-JS-16: Handle Action Tab Click', () => {
    beforeEach(() => {
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
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
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
        expect(document.querySelector('#operator-selector').style.display).toBe('flex');
        expect(document.querySelector('.operator-btn[data-op="+"]').classList.contains('active')).toBe(true);
    });
});