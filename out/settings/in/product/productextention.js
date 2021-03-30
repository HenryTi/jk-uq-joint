"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductExtention = void 0;
const uqOutRead_1 = require("../../../first/converter/uqOutRead");
const uqs_1 = require("../../../settings/uqs");
const lodash_1 = __importDefault(require("lodash"));
exports.ProductExtention = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'ProductExtention',
    mapper: {
        product: "ProductID@ProductX",
        content: "Content",
    },
    pull: async (joint, uqIn, queue) => {
        let result = await getNext(queue);
        let round = 0;
        while (result === undefined && round < 300) {
            queue++;
            round++;
            result = await getNext(queue);
        }
        return result;
    }
};
async function getNext(queue) {
    let sql = `SELECT TOP 1 ID, jkid, MF, MW, Synonymity, SynonymityC, MP, BP, FP, Density, n20D, SR as '[a]20D', MDL, 
                Beilstein, Merck, EINECS, SpecialRequirement, 
                Hazard, RiskSign, HValue, PValue, UN, HazardClass, subrisk, PackingG, WGK, RTECS, TSCA
                FROM  ProdData.dbo.Export_PProductExtention
                where   ID > @iMaxId
                order by ID`;
    let result = await uqOutRead_1.uqPullRead(sql, queue);
    if (result) {
        let { queue: newQueue, data } = result;
        let x = lodash_1.default.pickBy(lodash_1.default.omit(data, ["ID", "jkid"]), (value) => { return value !== undefined && value !== null && value !== 'N/A' && value !== ''; });
        if (Object.keys(x).length > 0) {
            return { lastPointer: newQueue, data: [{ ProductID: data.jkid, Content: JSON.stringify(x) }] };
        }
    }
}
//# sourceMappingURL=productextention.js.map