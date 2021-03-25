"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COA = exports.Lot = void 0;
const uqOutRead_1 = require("../../../first/converter/uqOutRead");
const tools_1 = require("../../../mssql/tools");
const uqs_1 = require("../../uqs");
const logger_1 = require("../../../tools/logger");
const dateformat_1 = __importDefault(require("dateformat"));
exports.Lot = {
    uq: uqs_1.uqs.jkProduct,
    type: 'tuid',
    entity: 'Lot',
    key: 'ID',
    mapper: {
        $id: 'LotNo@Lot',
        product: 'ProductID@ProductX',
        lotnumber: "LotNo",
    }
};
exports.COA = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'COA',
    mapper: {
        lot: "LotNo@Lot",
        content: "Content",
        version: "Version",
        issuer: "Issuer",
        issueDate: "IssueDate",
    },
    pull: async (joint, uqIn, queue) => {
        let sql = `select top 1 ID, LotNo
                from ProdData.dbo.Export_COAInfo
                where   ID > @iMaxId
                order by ID`;
        let result = await uqOutRead_1.uqPullRead(sql, queue);
        if (result) {
            let { queue: newQueue, data } = result;
            let { ID, LotNo } = data;
            console.log(LotNo);
            let sqlstring = `select id, JKID as ProductID, LotNo, EnglishName, CASNO, Version
                    , MolecularFormula, MolecularWeight, IssueDate,
                    KeyWord, WordValue, sorting1, SubWord, SubWordValue, sorting2, LastUpdatedTime
                    from ProdData.dbo.Export_COAInfo
                    where LotNo = @LotNo and id >= @iMaxId
                    order by Id                    
                    `;
            let ret = await tools_1.execSql(sqlstring, [{ name: 'LotNo', value: LotNo }, { name: 'iMaxId', value: queue }]);
            let { recordset, rowsAffected } = ret;
            if (rowsAffected > 0) {
                let contentObj = {};
                let preId = [];
                recordset.forEach((e, index) => {
                    let { id, EnglishName, CASNO, MolecularFormula, MolecularWeight, IssueDate, KeyWord, WordValue, SubWord, SubWordValue } = e;
                    contentObj['description'] = EnglishName;
                    contentObj['cas'] = CASNO;
                    contentObj['molecularFormula'] = MolecularFormula;
                    contentObj['molecularWeight'] = MolecularWeight;
                    //修正COA的签发日期
                    let d = new Date(IssueDate && dateformat_1.default(IssueDate, "yyyy-mm-dd HH:MM:ss"));
                    contentObj['issueDate'] = dateformat_1.default(d.setHours(d.getHours() - 8), "yyyy-mm-dd HH:MM:ss");
                    if (e.WordValue) {
                        contentObj[KeyWord] = WordValue;
                    }
                    else {
                        if (contentObj[KeyWord] === undefined)
                            contentObj[KeyWord] = {};
                        contentObj[KeyWord][SubWord] = SubWordValue;
                    }
                    // 根据id是否连续判断是过跨过lot号
                    if (index > 0 && index < recordset.length && recordset[index - 1]['id'] + 1 != id) {
                        preId.push(recordset[index - 1]['id'] + 1);
                    }
                });
                let last = recordset.length - 1;
                //修正COA的签发日期
                let d = new Date(recordset[last]['IssueDate'] && dateformat_1.default(recordset[last]['IssueDate'], "yyyy-mm-dd HH:MM:ss"));
                let data = {
                    id: recordset[last]['id'], ProductID: recordset[last]['ProductID'],
                    LotNo: recordset[last]['LotNo'], Version: recordset[last]['Version'],
                    IssueDate: dateformat_1.default(d.setHours(d.getHours() - 8), "yyyy-mm-dd HH:MM:ss"), Content: JSON.stringify(contentObj)
                };
                let lastId = recordset[last]['id'];
                if (preId.length != 0) {
                    lastId = preId[0];
                }
                return { lastPointer: lastId, data: [data] };
            }
        }
    },
    pullWrite: async (joint, uqin, data) => {
        try {
            await joint.uqIn(exports.Lot, data);
            // data["IssueDate"] = data["IssueDate"] && dateFormat(data["IssueDate"], "yyyy-mm-dd HH:MM:ss");
            await joint.uqIn(exports.COA, data);
            return true;
        }
        catch (error) {
            logger_1.logger.error(error);
            throw error;
        }
    }
};
//# sourceMappingURL=coa.js.map