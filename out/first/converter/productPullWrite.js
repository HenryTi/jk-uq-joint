"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const product_1 = require("../../settings/in/product");
async function productPullWrite(joint, data) {
    try {
        await joint.uqIn(product_1.Product, _.pick(data, ["ID", "BrandID", "ProductNumber", "Description", "DescriptionC"]));
        await joint.uqIn(product_1.ProductX, _.pick(data, ["ID", "BrandID", "ProductNumber", "Description", "DescriptionC"]));
        await joint.uqIn(product_1.ProductChemical, _.pick(data, ["ID", "ChemicalID", "Purity", "CAS", "MolecularFomula", "MolecularWeight"]));
    }
    catch (error) {
        console.error(error);
    }
}
exports.productPullWrite = productPullWrite;
//# sourceMappingURL=productPullWrite.js.map