import { UsqBus } from "../../usq-joint";

const facePointPush = async (face:string, queue:number, data:any) => {
    debugger;
}

const facePoint:UsqBus = {
    face: '百灵威系统工程部/point/point',
    mapper: {
        member: true,
        point: true,
    },
    push: facePointPush
};

export const bus: UsqBus[] = [
    facePoint,
];
