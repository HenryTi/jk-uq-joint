import { uqPullRead } from "../../../first/converter/uqOutRead";
import { execSql } from "../../../mssql/tools";
import { uqs } from "../../uqs";
import { logger } from "../../../tools/logger";
import { DataPullResult, UqIn } from "uq-joint";
import { Joint } from "uq-joint";
import { UqInTuid, UqInMap } from "uq-joint";
import dateFormat from 'dateformat';

export const Lot: UqInTuid = {
    uq: uqs.jkProduct,
    type: 'tuid',
    entity: 'Lot',
    key: 'ID',
    mapper: {
        $id: 'LotNo@Lot',
        product: 'ProductID@ProductX',
        lotnumber: "LotNo",
    }
};


export const COA: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'COA',
    mapper: {
        lot: "LotNo@Lot",
        content: "Content",
        version: "Version",
        issuer: "Issuer",
        issueDate: "IssueDate",
    },
    pull: async (joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> => {

        let sql = `select top 1 ID, LotNo
                from ProdData.dbo.Export_COAInfo
                where   ID > @iMaxId
                order by ID`;
        let result = await uqPullRead(sql, queue);
        if (result) {
            let { queue: newQueue, data } = result;
            let { ID, LotNo } = data;
            console.log(LotNo);

            let sqlstring = `select id, JKID as ProductID, LotNo, EnglishName, CASNO, Version
                    , MolecularFormula, MolecularWeight, IssueDate,
                    KeyWord, WordValue, sorting1, SubWord, SubWordValue, sorting2, LastUpdatedTime
                    from ProdData.dbo.Export_COAInfo
                    where LotNo = @LotNo and id >= @iMaxId
                    order by Id`;
            let ret = await execSql(sqlstring, [{ name: 'LotNo', value: LotNo }, { name: 'iMaxId', value: queue }]);
            let { recordset, rowsAffected } = ret;
            if (rowsAffected > 0) {
                let contentObj: any = {};
                let preId: any = [];
                recordset.forEach((e, index) => {
                    let { id, EnglishName, CASNO, MolecularFormula, MolecularWeight, IssueDate, KeyWord, WordValue, SubWord, SubWordValue } = e;
                    contentObj['description'] = EnglishName;
                    contentObj['cas'] = CASNO;
                    contentObj['molecularFormula'] = MolecularFormula;
                    contentObj['molecularWeight'] = MolecularWeight;

                    // 修正COA的签发日期
                    let d = new Date(IssueDate && dateFormat(IssueDate, "yyyy-mm-dd HH:MM:ss"));
                    contentObj['issueDate'] = dateFormat(d.setHours(d.getHours() - 8), "yyyy-mm-dd HH:MM:ss");

                    if (e.WordValue) {
                        contentObj[KeyWord] = WordValue;
                    } else {
                        if (SubWord && SubWordValue) {
                            if (contentObj[KeyWord] === undefined)
                                contentObj[KeyWord] = {};
                            contentObj[KeyWord][SubWord] = SubWordValue;
                        }
                    }

                    // 根据id是否连续判断是过跨过lot号
                    if (index > 0 && index < recordset.length && recordset[index - 1]['id'] + 1 != id) {
                        preId.push(recordset[index - 1]['id'] + 1);
                    }
                });

                let last = recordset.length - 1;

                //修正COA的签发日期
                let d = new Date(recordset[last]['IssueDate'] && dateFormat(recordset[last]['IssueDate'], "yyyy-mm-dd HH:MM:ss"));

                let data = {
                    id: recordset[last]['id'], ProductID: recordset[last]['ProductID'],
                    LotNo: recordset[last]['LotNo'], Version: recordset[last]['Version'],
                    IssueDate: dateFormat(d.setHours(d.getHours() - 8), "yyyy-mm-dd HH:MM:ss"), Content: JSON.stringify(contentObj)
                };

                let lastId = recordset[last]['id'];
                if (preId.length != 0) {
                    lastId = preId[0];
                }

                return { lastPointer: lastId, data: [data] };
            }
        }
    },
    pullWrite: async (joint: Joint, uqin: UqIn, data: any) => {
        try {
            await joint.uqIn(Lot, data);
            // data["IssueDate"] = data["IssueDate"] && dateFormat(data["IssueDate"], "yyyy-mm-dd HH:MM:ss");
            await joint.uqIn(COA, data);
            return true;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
}

