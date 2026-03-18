import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('UC-JS-01: Database Schema Validation (db.json)', () => {
    let db;

    beforeAll(() => {
        const dbPath = path.resolve(__dirname, '../db.json');
        const rawData = fs.readFileSync(dbPath, 'utf8');
        db = JSON.parse(rawData);
    });

    test('should contain exactly three root collections: units, conversions, and history', () => {
        expect(db).toHaveProperty('units');
        expect(db).toHaveProperty('conversions');
        expect(db).toHaveProperty('history');
    });

    test('history collection should be initialized as an empty array', () => {
        expect(Array.isArray(db.history)).toBe(true);
        expect(db.history.length).toBe(0);
    });

    test('units collection should contain valid objects with id, type, label, and symbol', () => {
        expect(db.units.length).toBeGreaterThan(0);
        db.units.forEach(unit => {
            expect(unit).toHaveProperty('id');
            expect(unit).toHaveProperty('type');
            expect(unit).toHaveProperty('label');
            expect(unit).toHaveProperty('symbol');
        });
    });

    test('units collection should cover all 4 required measurement types', () => {
        const types = new Set(db.units.map(u => u.type));
        expect(types.has('Length')).toBe(true);
        expect(types.has('Weight')).toBe(true);
        expect(types.has('Temperature')).toBe(true);
        expect(types.has('Volume')).toBe(true);
    });

    test('conversions collection should contain valid objects with from, to, factor, and formula', () => {
        expect(db.conversions.length).toBeGreaterThan(0);
        db.conversions.forEach(conv => {
            expect(conv).toHaveProperty('from');
            expect(conv).toHaveProperty('to');
            expect(conv).toHaveProperty('factor');
            expect(conv).toHaveProperty('formula');
            
            // It must have either a numeric factor or a formula string, but not both null
            const hasFactor = typeof conv.factor === 'number';
            const hasFormula = typeof conv.formula === 'string';
            expect(hasFactor || hasFormula).toBe(true);
        });
    });
});