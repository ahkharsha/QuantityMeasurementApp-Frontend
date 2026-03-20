/**
 * Calculation Module Tests
 * Validates basic math factors and complex formulas.
 * @author Developer
 * @version 1.0
 */

import { applyConversion } from '../js/conversion.js';

describe('UC-JS-07: Apply Conversion Factor or Formula', () => {

    test('should apply strict numerical factor correctly', () => {
        const convObj = { from: "m", to: "cm", factor: 100, formula: null };
        expect(applyConversion(2.5, convObj)).toBe(250);
    });

    test('should apply formula correctly replacing x with value', () => {
        const convObj = { from: "C", to: "F", factor: null, formula: "(x*9/5)+32" };
        expect(applyConversion(0, convObj)).toBe(32);
        expect(applyConversion(100, convObj)).toBe(212);
    });

    test('should strictly return value unchanged if fromUnit === toUnit', () => {
        const convObj = { from: "m", to: "m", factor: 100, formula: null };
        expect(applyConversion(42, convObj)).toBe(42);
    });

    test('should explicitly throw "Invalid number" when given NaN', () => {
        const convObj = { from: "m", to: "cm", factor: 100, formula: null };
        expect(() => applyConversion(NaN, convObj)).toThrow("Invalid number");
        expect(() => applyConversion("string", convObj)).toThrow("Invalid number");
    });

    test('should explicitly throw "Bad formula" when eval crashes', () => {
        const convObj = { from: "X", to: "Y", factor: null, formula: "x / ???" };
        expect(() => applyConversion(10, convObj)).toThrow("Bad formula");
    });
});
