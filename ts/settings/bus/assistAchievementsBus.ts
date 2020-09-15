import { UqBus, DataPull, Joint, DataPullResult } from "uq-joint";
import { uqOutRead } from "../../first/converter/uqOutRead";

const achievementBusPull: DataPull<UqBus> = async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {

    let sql = `SELECT TOP 1 ID, sales, salesAmount, amount, receivableAmount, withdrawalAmount
        FROM	ProdData.dbo.Export_tonvaAchievement
        WHERE	ID > @iMaxId order by ID`;
    let result = await uqOutRead(sql, queue);
    return result;
}

export const faceAssistAchievementBus: UqBus = {
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


const achievementHistoryBusPull: DataPull<UqBus> = async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {

    let sql = `SELECT TOP 1 ID, sales, webuser, sorderid, SalesAmount, Amount
        FROM	dbs.dbo.tonvaAchievementHistory
        WHERE	ID > @iMaxId order by ID`;
    let result = await uqOutRead(sql, queue);
    return result;
}

export const faceAssistAchievementHistoryBus: UqBus = {
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
