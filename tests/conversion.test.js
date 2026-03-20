/**
 * Calculation Module Tests
 * Validates basic math factors and complex formulas.
 * @author Developer
 * @version 1.0
 */

import { applyConversion, evaluateExpression, compareValues } from '../js/conversion.js';

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

describe('UC-JS-08: Evaluate Arithmetic Expression', () => {

    test('should correctly add two numbers and bypass JS float quirks securely', () => {
        expect(evaluateExpression(0.1, 0.2, '+')).toBe(0.3); // 0.1 + 0.2 gives 0.30000000000000004 without truncation!
        expect(evaluateExpression(10.5, 2.5, '+')).toBe(13);
    });

    test('should correctly subtract two numbers and round to 6 decimal places', () => {
        expect(evaluateExpression(0.3, 0.2, '-')).toBe(0.1);
        expect(evaluateExpression(10, 20, '-')).toBe(-10);
    });

    test('should explicitly throw "Invalid number" when given NaN or strings', () => {
        expect(() => evaluateExpression(NaN, 5, '+')).toThrow("Invalid number");
        expect(() => evaluateExpression(5, "5", '-')).toThrow("Invalid number");
    });

    test('should explicitly throw "Invalid operator" when given unsupported operation types', () => {
        expect(() => evaluateExpression(10, 5, '*')).toThrow("Invalid operator");
        expect(() => evaluateExpression(10, 5, '/')).toThrow("Invalid operator");
        expect(() => evaluateExpression(10, 5, 'add')).toThrow("Invalid operator");
    });
});

describe('UC-JS-09: Compare Two Measurement Values', () => {

    test('should return exactly GREATER, LESS, or EQUAL statements correctly', () => {
        expect(compareValues(2, 'kg', 100, 'g', 2000, 100)).toBe("2 kg is GREATER than 100 g");
        expect(compareValues(5, 'cm', 1, 'm', 0.05, 1)).toBe("5 cm is LESS than 1 m");
        expect(compareValues(10, 'mm', 1, 'cm', 0.01, 0.01)).toBe("10 mm is EQUAL to 1 cm");
    });

    test('should return fallback invalid sentence if base values are NaN', () => {
        expect(compareValues(2, 'kg', 100, 'g', NaN, 100)).toBe("Invalid values — cannot compare");
        expect(compareValues(2, 'kg', 100, 'g', 2000, NaN)).toBe("Invalid values — cannot compare");
    });
});
