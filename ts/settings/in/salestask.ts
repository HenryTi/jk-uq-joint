import * as _ from 'lodash';
import { UqInTuid, UqInMap, UqInTuidArr, UqIn, Joint } from "uq-joint";
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
        no: "WorkTaskTypeID",
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
        no: "WorkTaskID",
        description: 'LinkObjectID',
        customer: 'CustomerID@Customer',
        employee: "EmployeeID@Employee",
        sourceNo: 'LinkObjectID',
        priorty: 'TimeLimit',
        type:'WorkTaskTypeID', 
        deadline: 'RequireCompletionTime',
        createTime: 'CreateTime',
        completeTime: 'CompleteTime',
    },
    pull: `select   top ${promiseSize} a.ID, a.WorkTaskID, a.WorkTaskSource, a.CustomerID, a.EmployeeID, a.WorkTaskTypeID,
                    a.LinkObjectID, isnull(a.TimeLimit,0) as TimeLimit, a.RequireCompletionTime, a.CreateTime, a.CompleteTime
            from    ProdData.dbo.Export_WorkTask as a
            where a.ID > @iMaxId order by a.ID`,
    pullWrite: async (joint: Joint, data: any) => {

        try {
            data["RequireCompletionTime"] = data["RequireCompletionTime"] && dateFormat(data["RequireCompletionTime"], "yyyy-mm-dd"); //转换日期格式（存在日期才转换）
            data["CreateTime"] = data["CreateTime"] && dateFormat(data["CreateTime"], "yyyy-mm-dd");
            await joint.uqIn(JkTask, _.pick(data, ["ID", "WorkTaskID", "WorkTaskSource", "CustomerID", "EmployeeID", 'LinkObjectID', 'TimeLimit', 'RequireCompletionTime', 'CreateTime']));
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

};
