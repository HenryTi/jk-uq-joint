"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChemicalJNKRestrict = void 0;
const uqs_1 = require("../../../settings/uqs");
const logger_1 = require("../../../tools/logger");
const timeAsQueue_1 = require("../../../settings/timeAsQueue");
exports.ChemicalJNKRestrict = {
    uq: uqs_1.uqs.jkChemical,
    type: 'map',
    entity: 'ChemicalJNKRestrict',
    mapper: {
        chemical: "ChemicalID@Chemical",
        arr1: {
            jnkRestrict: "^JNKRestrictID@JNKRestrict",
        }
    },
    pull: pullChemicalJNKRestrict
};
pullChemicalJNKRestrict.lastLength = 0;
async function pullChemicalJNKRestrict(joint, uqIn, queue) {
    let { lastLength } = pullChemicalJNKRestrict;
    let sql = `select top --topn-- DATEDIFF(s, '1970-01-01', Update__Time) as ID, Chemid as ChemicalID, restrict_code as JNKRestrictID
            from zcl_mess.dbo.sc_restrict
            where Update__Time >= DATEADD(s, @iMaxId, '1970-01-01')
            order by Update__time`;
    try {
        let ret = await timeAsQueue_1.timeAsQueue(sql, queue, lastLength);
        if (ret !== undefined) {
            pullChemicalJNKRestrict.lastLength = ret.lastLength;
            return ret.ret;
        }
    }
    catch (error) {
        logger_1.logger.error(error);
        throw error;
    }
}
//# sourceMappingURL=chemicalJNKRestirct.js.map