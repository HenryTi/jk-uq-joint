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
        jnkRestrict: "JNKRestrictID@JNKRestrict",
    },
    pull: async (joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> => {
        let sql = `select DATEDIFF(s, '1970-01-01', Update__Time) + 1 as ID, Chemid as ChemicalID, restrict_code as JNKRestrictID
            from zcl_mess.dbo.sc_restrict
            where Update__Time >= DATEADD(s, @iMaxId, '1970-01-01') and Update__Time <= DATEADD(s, @endPoint, '1970-01-01')
            order by Update__time`
        try {
            return await timeAsQueue(sql, queue, 3600);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
}