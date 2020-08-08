"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facePoint = void 0;
const webApiClient_1 = require("../../tools/webApiClient");
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const facePointPush = async (joint, uqBus, queue, data) => {
    console.log(data);
    // 调用7.253的web api
    // let httpClient = new WebApiClient();
    let ret = await webApiClient_1.httpClient.test({});
    return true;
};
/**
 * 客户积分导入tonva系统所需的数据源，export_customerScoreBook来自job: 1H-把订单关联市场活动积分。
 * @param joint
 * @param uqBus
 * @param queue
 */
const facePointPull = async (joint, uqBus, queue) => {
    let sql = `select top 1 ID, CID as CustomerID, Years, AllScore, ScoreEffective, ScoreUsed
        from ProdData.dbo.Export_CustomerScoreBook
        where ID > @iMaxId order by ID`;
    return await uqOutRead_1.uqOutRead(sql, queue);
};
exports.facePoint = {
    face: '百灵威系统工程部/pointShop/customerPoint',
    from: 'local',
    mapper: {
        customer: 'CustomerID@Customer',
        pointYear: 'Years',
        totalPoint: "AllScore",
        point: "ScoreEffective",
        usedPoint: "ScoreUsed",
    },
    pull: facePointPull
};
//# sourceMappingURL=pointBus.js.map