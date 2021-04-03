import { uqs } from "../../../settings/uqs";
import { DataPullResult, Joint, UqInMap } from "uq-joint";
import { logger } from "../../../tools/logger";
import { timeAsQueue } from '../../../settings/timeAsQueue';

export const ChemicalJNKRestrict: UqInMap = {
    uq: uqs.jkChemical,
    type: 'map',
    entity: 'ChemicalJNKRestrict',
    mapper: {
        chemical: "ChemicalID@Chemical",
        arr1: {
            jnkRestrict: "^JNKRestrictID@JNKRestrict",
        }
    },
    pull: pullChemicalJNKRestrict
}

pullChemicalJNKRestrict.lastLength = 0;

async function pullChemicalJNKRestrict(joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> {
    let { lastLength } = pullChemicalJNKRestrict;
    let sql = `select top --topn-- DATEDIFF(s, '1970-01-01', Update__Time) as ID, Chemid as ChemicalID, restrict_code as JNKRestrictID
            from zcl_mess.dbo.sc_restrict
            where Update__Time >= DATEADD(s, @iMaxId, '1970-01-01')
            order by Update__time`
    try {
        let ret = await timeAsQueue(sql, queue, lastLength);
        if (ret !== undefined) {
            pullChemicalJNKRestrict.lastLength = ret.lastLength;
            return ret.ret;
        }
    } catch (error) {
        logger.error(error);
        throw error;
    }
}