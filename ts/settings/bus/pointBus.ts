import { UqBus, DataPush, Joint, DataPull, DataPullResult } from "uq-joint";
import { WebApiClient, httpClient } from "../../tools/webApiClient";
import { uqPullRead, uqOutRead } from "../../first/converter/uqOutRead";

const facePointPush: DataPush<UqBus> = async (joint: Joint, uqBus: UqBus, queue: number, data: any): Promise<boolean> => {
    console.log(data);
    // 调用7.253的web api
    // let httpClient = new WebApiClient();
    let ret = await httpClient.test({});
    return true;
}

const facePointPull: DataPull<UqBus> = async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {
    let sql = `select top 1 ID, CID as CustomerID, Years, AllScore, ScoreEffective, ScoreUsed
        from ProdData.dbo.Export_CustomerScoreBook
        where ID > @iMaxId order by ID`;
    return await uqOutRead(sql, queue);
}

export const facePoint: UqBus = {
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