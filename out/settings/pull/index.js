"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pullTest_1 = require("./pullTest");
const common_1 = require("./common");
const Chemical_1 = require("./Chemical");
const tool_1 = require("../../usq-joint/db/mysql/tool");
const pull = {
    Country: common_1.pullCountry,
    Province: common_1.pullProvince,
    City: common_1.pullCity,
    County: common_1.pullCounty,
    PackTypeStandard: common_1.pullPackTypeStandard,
    PackType: common_1.pullPackType,
    Currency: common_1.pullCurrency,
    SalesRegion: common_1.pullSalesRegion,
    Chemical: Chemical_1.pullChemical,
    a: pullTest_1.pullTest,
};
async function pullEntity(joint, entityName, sqlstring, queue) {
    let data = await tool_1.execSql(sqlstring);
    await joint.pushToUsq(entityName, data);
    return queue + 1;
}
exports.pullEntity = pullEntity;
exports.default = pull;
//# sourceMappingURL=index.js.map