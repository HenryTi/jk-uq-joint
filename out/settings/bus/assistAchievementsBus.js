"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceAssistAchievementDetailBus = exports.faceAssistAchievementBus = void 0;
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const achievementBusPull = async (joint, uqBus, queue) => {
    let sql = `SELECT TOP 1 (datediff(s, '1970-01-01', UpdateTime) + id) as ID, sales, salesAmount, amount, receivableAmount, withdrawalAmount
        FROM	dbs.dbo.tonvaAchievement
        WHERE	(datediff(s, '1970-01-01', UpdateTime) + id)> @iMaxId order by UpdateTime`;
    let result = await uqOutRead_1.uqOutRead(sql, queue);
    return result;
};
exports.faceAssistAchievementBus = {
    face: '百灵威系统工程部/salestask/assistAchievement',
    from: 'local',
    mapper: {
        sales: "sales",
        salesAmount: 'salesAmount',
        amount: 'amount',
        receivableAmount: 'receivableAmount',
        withdrawalAmount: 'withdrawalAmount'
    },
    pull: achievementBusPull
};
const achievementDetailBusPull = async (joint, uqBus, queue) => {
    let sql = `SELECT TOP 1 ID, sales, webuser, sorderid, SalesAmount, Amount
        FROM	dbs.dbo.tonvaAchievementDetail
        WHERE	ID > @iMaxId order by ID`;
    let result = await uqOutRead_1.uqOutRead(sql, queue);
    return result;
};
exports.faceAssistAchievementDetailBus = {
    face: '百灵威系统工程部/salestask/assistAchievementDetail',
    from: 'local',
    mapper: {
        sales: "sales",
        webuser: "webuser",
        orderNo: "sorderid",
        salesAmount: 'SalesAmount',
        amount: 'Amount'
    },
    pull: achievementDetailBusPull
};
//# sourceMappingURL=assistAchievementsBus.js.map