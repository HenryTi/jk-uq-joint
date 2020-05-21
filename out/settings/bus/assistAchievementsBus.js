"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const achievementsBusPull = async (joint, uqBus, queue) => {
    let sql = `SELECT TOP 1 ID, sales, year, month, amount
        FROM	ProdData.dbo.Export_AssistAchievements
        WHERE	ID > @iMaxId order by ID`;
    return await uqOutRead_1.uqOutRead(sql, queue);
};
exports.faceAssistAchievementsBus = {
    face: '百灵威系统工程部/salestask/assistAchievements',
    from: 'local',
    mapper: {
        sales: 'sales',
        year: 'year',
        month: 'month',
        amount: 'amount'
    },
    pull: achievementsBusPull
};
//# sourceMappingURL=assistAchievementsBus.js.map