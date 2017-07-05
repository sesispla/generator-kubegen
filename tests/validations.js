var expect = require('expect');
var val = require('../generators/validations.js');

describe('String validation tests', function () {
    it('Is string', function () {
        expect(val.isString('string')).toBe(true);
    });
    it('A number is not string', function () {
        expect(val.isString(0)).toBe(false);
    });
    it('Null is not string', function () {
        expect(val.isString(null)).toBe(false);
    });        
});

describe('Integer validation tests', function () {
    it('Is integer', function () {
        expect(val.isNumber(124)).toBe(true);
    });
    it('String is not integer', function () {
        expect(val.isNumber('string')).toBe(false);
    });
    it('Null is not integer', function () {
        expect(val.isNumber(null)).toBe(false);
    });
    it('Decimal is not integer', function () {
        expect(val.isNumber(3.1416)).toBe(false);
    });
    it('Can parse a string to integer', function () {
        expect(val.parseInteger('40')).toBe(40);
    });    
});