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
        jnkRestrict: "JNKRestrictID@JNKRestrict",
    },
    pull: async (joint, uqIn, queue) => {
        let sql = `select DATEDIFF(s, '1970-01-01', Update__Time) + 1 as ID, Chemid as ChemicalID, restrict_code as JNKRestrictID
            from zcl_mess.dbo.sc_restrict
            where Update__Time >= DATEADD(s, @iMaxId, '1970-01-01') and Update__Time <= DATEADD(s, @endPoint, '1970-01-01')
            order by Update__time`;
        try {
            return await timeAsQueue_1.timeAsQueue(sql, queue, 3600);
        }
        catch (error) {
            logger_1.logger.error(error);
            throw error;
        }
    }
};
//# sourceMappingURL=chemicalJNKRestirct.js.map