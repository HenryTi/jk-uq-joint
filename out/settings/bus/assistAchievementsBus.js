"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceAssistAchievementHistoryBus = exports.faceAssistAchievementBus = void 0;
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const achievementBusPull = async (joint, uqBus, queue) => {
    let sql = `SELECT TOP 1 ID, sales, salesAmount, amount, receivableAmount, withdrawalAmount
        FROM	ProdData.dbo.Export_tonvaAchievement
        WHERE	ID > @iMaxId order by ID`;
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
const achievementHistoryBusPull = async (joint, uqBus, queue) => {
    let sql = `SELECT TOP 1 ID, sales, webuser, sorderid, SalesAmount, Amount
        FROM	dbs.dbo.tonvaAchievementHistory
        WHERE	ID > @iMaxId order by ID`;
    let result = await uqOutRead_1.uqOutRead(sql, queue);
    return result;
};
exports.faceAssistAchievementHistoryBus = {
    face: '百灵威系统工程部/salestask/assistAchievementHistory',
    from: 'local',
    mapper: {
        sales: "sales",
        webuser: "webuser",
        orderNo: "sorderid",
        salesAmount: 'SalesAmount',
        amount: 'Amount'
    },
    pull: achievementHistoryBusPull
};
//# sourceMappingURL=assistAchievementsBus.js.map