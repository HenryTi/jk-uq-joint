import { UsqBus, DataPush, Joint } from "../../usq-joint";
import { faceOrder } from "./orderUsqBus";
import { WebApiClient } from "../../tools/webApiClient";

// export type DataPull = (face:string, queue:number)=>Promise<{queue:number, data:any}>;
// export type DataPush = (face:string, queue:number, data:any)=>Promise<boolean>;

const facePointPush: DataPush = async (joint: Joint, face: string, queue: number, data: any): Promise<boolean> => {
    console.log(data);
    // 调用7.253的web api
    let httpClient = new WebApiClient();
    let ret = await httpClient.test({});
    return false;
}

const facePoint: UsqBus = {
    face: '百灵威系统工程部/point/point',
    mapper: {
        member: true,
        point: true,
    },
    push: facePointPush
};

export const bus: UsqBus[] = [
    facePoint,
    faceOrder,
];
