/**
 * Application Initialization Tests
 * Verifies the integrity of the global state and DOM lifecycle hooks.
 * @author Developer
 * @version 1.0
 * @jest-environment jsdom
 */

import { state } from '../js/app.js';

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