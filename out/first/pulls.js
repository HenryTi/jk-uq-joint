"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commonConverter_1 = require("./converter/commonConverter");
const Address_1 = require("../settings/in/Address");
/** */
exports.pulls = [
    /*
    { read: readLanguage, usqIn: Language },
    { read: readCountry, usqIn: Country },
    { read: readProvince, usqIn: Province },
    { read: readCity, usqIn: City },
    */
    { read: commonConverter_1.readCounty, usqIn: Address_1.County },
];
//# sourceMappingURL=pulls.js.map