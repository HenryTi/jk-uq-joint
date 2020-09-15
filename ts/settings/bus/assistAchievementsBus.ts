import { UqBus, DataPull, Joint, DataPullResult } from "uq-joint";
import { uqOutRead } from "../../first/converter/uqOutRead";

const achievementBusPull: DataPull<UqBus> = async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {

    let sql = `SELECT TOP 1 (datediff(s, '1970-01-01', UpdateTime) + id) as ID, sales, salesAmount, amount, receivableAmount, withdrawalAmount
        FROM	dbs.dbo.tonvaAchievement
        WHERE	(datediff(s, '1970-01-01', UpdateTime) + id)> @iMaxId order by UpdateTime`;
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


const achievementDetailBusPull: DataPull<UqBus> = async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {

    let sql = `SELECT TOP 1 ID, sales, webuser, sorderid, SalesAmount, Amount
        FROM	dbs.dbo.tonvaAchievementDetail
        WHERE	ID > @iMaxId order by ID`;
    let result = await uqOutRead(sql, queue);
    return result;
}

export const faceAssistAchievementDetailBus: UqBus = {
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
