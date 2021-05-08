import { timeAsQueue } from "../../settings/timeAsQueue";
import { logger } from "../../tools/logger";
import { UqIn, UqInTuid, Joint, DataPullResult } from "uq-joint";
import { uqs } from "../uqs";

export const Employee: UqInTuid = {
    uq: uqs.jkHr,
    type: 'tuid',
    entity: 'Employee',
    key: 'EPID',
    mapper: {
        $id: 'EPID@Employee',
        no: "EPID",
        name: "ChineseName",
        firstName: "EpName1",
        lastName: "EpName2",
        title: "Title",
        status: "Status",
        CreateTime: "CreateTime",
    },
    pull: pullEmployee,
    pullWrite: async (joint: Joint, uqIn: UqIn, data: any) => {
        try {
            data["CreateTime"] = data["CreateTime"].getTime() / 1000; // dateFormat(data["CreateTime"], 'yyyy-mm-dd HH:MM:ss');
            await joint.uqIn(Employee, data);
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};


pullEmployee.lastLength = 0;

async function pullEmployee(joint: Joint, uqIn: UqInTuid, queue: number): Promise<DataPullResult> {
    let { lastLength } = pullEmployee;
    let sql = `select top --topn-- DATEDIFF(s, '1970-01-01', Update__time) as ID, EPID, ChineseName, EpName1, EpName2, Title, Status, Creadate as CreateTime
            from dbs.dbo.Employee 
            where Update__Time >= DATEADD(s, @iMaxId, '1970-01-01')
            order by Update__time`;
    try {
        let ret = await timeAsQueue(sql, queue, lastLength);
        if (ret !== undefined) {
            pullEmployee.lastLength = ret.lastLength;
            return ret.ret;
        }
    } catch (error) {
        logger.error(error);
        throw error;
    }
}