import { UqBus, DataPull, Joint, DataPullResult } from "uq-joint";
import { uqOutRead } from "../../first/converter/uqOutRead";

const achievementsBusPull: DataPull<UqBus> = async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {

    let sql = `SELECT TOP 1 ID, sales, year, month, amount
        FROM	ProdData.dbo.Export_AssistAchievements
        WHERE	ID > @iMaxId order by ID`;
    return await uqOutRead(sql, queue);
}

export const faceAssistAchievementsBus: UqBus = {
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
