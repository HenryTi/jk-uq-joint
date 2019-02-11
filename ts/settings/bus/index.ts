import { UsqBus, DataPush, Joint, DataPull } from "../../usq-joint";
import { faceOrder } from "./orderUsqBus";
import { WebApiClient } from "../../tools/webApiClient";

// export type DataPull = (face:string, queue:number)=>Promise<{queue:number, data:any}>;
// export type DataPush = (face:string, queue:number, data:any)=>Promise<boolean>;

const facePointPush: DataPush = async (joint: Joint, face: string, queue: number, data: any): Promise<boolean> => {
    console.log(data);
    // 调用7.253的web api
    let httpClient = new WebApiClient();
    // let ret = await httpClient.test({});
    return false;
}

const facePointPull: DataPull = async (joint: Joint, face: string, queue: number): Promise<{ queue: number, data: any }> => {
    return { queue: 10, data: { member: 5, point: 10 } };
}

const facePoint: UsqBus = {
    face: '百灵威系统工程部/point/point',
    mapper: {
        member: true,
        point: true,
    },
    push: facePointPush
};

const facePointIn: UsqBus = {
    face: '百灵威系统工程部/point/point',
    mapper: {
        member: true,
        point: true,
    },
    pull: facePointPull
}

export const bus: UsqBus[] = [
    facePoint,
    faceOrder,
    facePointIn,
];
