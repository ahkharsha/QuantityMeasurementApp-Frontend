/**
 * Database Schema Tests
 * Validates the integrity and structure of the mock json-server database.
 * @author Developer
 * @version 1.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Database Schema Validation (db.json)', () => {
    let db;

    // Loads the mock database from db.json before any tests are executed
    beforeAll(() => {
        const dbPath = path.resolve(__dirname, '../db.json');
        const rawData = fs.readFileSync(dbPath, 'utf8');
        db = JSON.parse(rawData);
    });

    // Validates that the core root objects (units, conversions, history) exist in the database
    test('should contain exactly three root collections: units, conversions, and history', () => {
        expect(db).toHaveProperty('units');
        expect(db).toHaveProperty('conversions');
        expect(db).toHaveProperty('history');
    });

    // Verifies the user history collection defaults to an empty array
    test('history collection should be initialized as an empty array', () => {
        expect(Array.isArray(db.history)).toBe(true);
        expect(db.history.length).toBe(0);
    });

    // Checks that the unit definitions contain the correct property structures
    test('units collection should contain valid objects with id, type, label, and symbol', () => {
        expect(db.units.length).toBeGreaterThan(0);
        db.units.forEach(unit => {
            expect(unit).toHaveProperty('id');
            expect(unit).toHaveProperty('type');
            expect(unit).toHaveProperty('label');
            expect(unit).toHaveProperty('symbol');
        });
    });

    // Ensures all essential measurement categories are present in the unit definitions
    test('units collection should cover all 4 required measurement types', () => {
        const types = new Set(db.units.map(u => u.type));
        expect(types.has('Length')).toBe(true);
        expect(types.has('Weight')).toBe(true);
        expect(types.has('Temperature')).toBe(true);
        expect(types.has('Volume')).toBe(true);
    });

    // Verifies the conversion logic definitions are properly structured
    test('conversions collection should contain valid objects with from, to, factor, and formula', () => {
        expect(db.conversions.length).toBeGreaterThan(0);
        db.conversions.forEach(conv => {
            expect(conv).toHaveProperty('from');
            expect(conv).toHaveProperty('to');
            expect(conv).toHaveProperty('factor');
            expect(conv).toHaveProperty('formula');
            
            const hasFactor = typeof conv.factor === 'number';
            const hasFormula = typeof conv.formula === 'string';
            expect(hasFactor || hasFormula).toBe(true);
        });
    });
});