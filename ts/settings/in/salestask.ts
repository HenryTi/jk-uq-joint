import * as _ from 'lodash';
import { UqInTuid, UqInMap, UqInTuidArr, UqIn, Joint } from "../../uq-joint";
import dateFormat from 'dateformat';
import { uqs } from "../uqs";
import config from 'config';
const promiseSize = config.get<number>("promiseSize");


export const JkTaskType: UqInTuid = {
    uq: uqs.jkSalestask,
    type: 'tuid',
    entity: 'JkTaskType',
    key: 'WorkTaskTypeID',
    mapper: {
        $id: 'WorkTaskTypeID@JkTaskType',
        name: "name",
        TimeLimit: 'TimeLimit',
    },
    pull: `select top ${promiseSize} ID, WorkTaskTypeID, WorkTaskTypeName as name, TimeLimit
           from ProdData.dbo.Export_DicWorkTaskType where id > @iMaxId order by id`,
};

export const JkTask: UqInTuid = {
    uq: uqs.jkSalestask,
    type: 'tuid',
    entity: 'JkTask',
    key: 'WorkTaskID',
    mapper: {
        $id: 'WorkTaskID@JkTask',
        description: 'LinkObjectID',
        Customer: 'CustomerID@Customer',
        type: 'WorkTaskTypeID@JkTaskType',
        EmployeeID: "EmployeeID",
        sourceNo: 'LinkObjectID',
        priorty: 'TimeLimit',
        deadline: 'RequireCompletionTime',
        createTime: 'CreateTime',
    },
    pull: `select top ${promiseSize} ID, WorkTaskID, WorkTaskSource, CustomerID, WorkTaskTypeID, EmployeeID, LinkObjectID, TimeLimit, RequireCompletionTime, CreateTime
           from ProdData.dbo.Export_WorkTask where ID > @iMaxId order by ID`,
    pullWrite: async (joint: Joint, data: any) => {

        try {
            data["StartDate"] = data["StartDate"] && dateFormat(data["StartDate"], "yyyy-mm-dd HH:MM:ss");
            data["EndDate"] = data["EndDate"] && dateFormat(data["EndDate"], "yyyy-mm-dd HH:MM:ss");
            data["CreateTime"] = data["CreateTime"] && dateFormat(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
            await joint.uqIn(JkTask, _.pick(data, ["ID", "WorkTaskID", "WorkTaskSource", "CustomerID", "WorkTaskTypeID", "EmployeeID", 'LinkObjectID', 'TimeLimit', 'RequireCompletionTime', 'CreateTime']));
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

};


