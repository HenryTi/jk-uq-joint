import { UqBus, DataPush, Joint, DataPull } from "../../uq-joint";
import { faceOrder } from "./orderUsqBus";
import { WebApiClient } from "../../tools/webApiClient";
import { uqPullRead } from "../../first/converter/uqOutRead";
import { faceProductInventory } from "./productInventoryBus";

// export type DataPull = (face:string, queue:number)=>Promise<{queue:number, data:any}>;
// export type DataPush = (face:string, queue:number, data:any)=>Promise<boolean>;

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
    // return { queue: 10, data: { member: 5, point: 10 } };
}

const facePoint: UqBus = {
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

export const bus: UqBus[] = [
    facePoint,
    faceOrder,
    faceProductInventory,
];
