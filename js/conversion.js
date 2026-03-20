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
