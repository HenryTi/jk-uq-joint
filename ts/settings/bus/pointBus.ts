import { UqBus, DataPush, Joint, DataPull } from "../../uq-joint";
import { WebApiClient } from "../../tools/webApiClient";
import { uqPullRead } from "../../first/converter/uqOutRead";

const facePointPush: DataPush<UqBus> = async (joint: Joint, uqBus: UqBus, queue: number, data: any): Promise<boolean> => {
    console.log(data);
    // 调用7.253的web api
    let httpClient = new WebApiClient();
    // let ret = await httpClient.test({});
    return true;
}

const facePointPull: DataPull<UqBus> = async (joint: Joint, uqBus: UqBus, queue: number): Promise<{ queue: number, data: any }> => {
    let sql = `select ID, CID, Years, AllScore, ScoreUsed from ProdData.dbo.Export_CustomerScoreBook where ID > @iMaxId order by ID`;
    return await uqPullRead(sql, queue);
}

export const facePoint: UqBus = {
    face: '百灵威系统工程部/point/point',
    mapper: {
        member: 'CID@Customer',
        years: 'Years',
        point: "AllScore",
        pointUsed: "ScoreUsed",
    },
    // push: facePointPush,
    pull: facePointPull
};