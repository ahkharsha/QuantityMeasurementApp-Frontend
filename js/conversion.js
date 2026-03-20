/**
 * Quantity Measurement App - Calculation Module
 * Provides pure mathematical functions for measurement resolution.
 * @author Developer
 * @version 1.0
 */

/**
 * Applies a conversion factor or formula to a given numerical value.
 * @param {number} value - The input value to convert
 * @param {Object} convObj - The conversion rules containing factor or formula
 * @returns {number} The converted value scaled to 6 decimal places
 * @throws {Error} If the value is invalid or formula evaluates poorly
 */
export function applyConversion(value, convObj) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        throw new Error("Invalid number");
    }

    if (convObj.from === convObj.to) {
        return value;
    }

    if (convObj.factor !== null && convObj.factor !== undefined) {
        return parseFloat((value * convObj.factor).toFixed(6));
    }

    if (convObj.formula) {
        try {
            const expr = convObj.formula.replace(/x/g, value);
            // We use eval carefully here on explicitly database-provided strings
            const result = eval(expr);
            if (Number.isNaN(result) || result === Infinity || result === -Infinity) {
                throw new Error("Bad formula");
            }
            return parseFloat(result.toFixed(6));
        } catch (e) {
            throw new Error("Bad formula");
        }
    }

    throw new Error("Bad formula");
}

/**
 * Evaluates an arithmetic expression between two numerical values.
 * @param {number} val1 - The first value
 * @param {number} val2 - The second value
 * @param {string} operator - The mathematical operator ("+" or "-")
 * @returns {number} The computed result scaled to 6 decimal places
 * @throws {Error} If values or operator are invalid
 */
export function evaluateExpression(val1, val2, operator) {
    if (typeof val1 !== 'number' || Number.isNaN(val1) || typeof val2 !== 'number' || Number.isNaN(val2)) {
        throw new Error("Invalid number");
    }

    if (operator === '+') {
        return parseFloat((val1 + val2).toFixed(6));
    }

    if (operator === '-') {
        return parseFloat((val1 - val2).toFixed(6));
    }

    throw new Error("Invalid operator");
}

/**
 * Compares two converted measurements against their normalized base units.
 * @param {number} v1 - Original value 1
 * @param {string} u1 - Original unit 1
 * @param {number} v2 - Original value 2
 * @param {string} u2 - Original unit 2
 * @param {number} base1 - Value 1 converted to base unit
 * @param {number} base2 - Value 2 converted to base unit
 * @returns {string} A human-readable comparison sentence
 */
export function compareValues(v1, u1, v2, u2, base1, base2) {
    if (Number.isNaN(base1) || Number.isNaN(base2)) {
        return "Invalid values — cannot compare";
    }

    if (base1 > base2) {
        return `${v1} ${u1} is GREATER than ${v2} ${u2}`;
    }
    
    if (base1 < base2) {
        return `${v1} ${u1} is LESS than ${v2} ${u2}`;
    }

    return `${v1} ${u1} is EQUAL to ${v2} ${u2}`;
}
