"use strict";

module.exports = {
    isString(str) {
        return str ? true : false;
    },
    isNumber (str) {
                return str && !Number.isNaN(str) && Number.isInteger(str) ? true : false;
    },
    parseInteger(str) {
        return parseInt(str);
    }
}