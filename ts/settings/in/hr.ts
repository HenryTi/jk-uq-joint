import { UqInTuid, Joint } from "../../uq-joint";
import { uqs } from "../uqs";
import dateFormat from 'dateformat';

export const Employee: UqInTuid = {
    uq: uqs.jkHr,
    type: 'tuid',
    entity: 'Employee',
    key: 'ID',
    mapper: {
        $id: 'ID@Employee',
        no: "ID",
        name: "ChineseName",
        firstName: "EpName1",
        lastName: "EpName2",
        title: "Title",
        status: "Status",
        CreateTime: "CreateTime",
    },
    pullWrite: async (joint: Joint, data: any) => {
        try {
            data["CreateTime"] = data["CreateTime"].getTime(); // dateFormat(data["CreateTime"], 'yyyy-mm-dd HH:MM:ss');
            await joint.uqIn(Employee, data);
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};
