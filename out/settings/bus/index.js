"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export type DataPull = (face:string, queue:number)=>Promise<{queue:number, data:any}>;
// export type DataPush = (face:string, queue:number, data:any)=>Promise<boolean>;
const facePointPush = async (face, queue, data) => {
    debugger;
    return false;
};
const facePoint = {
    face: '百灵威系统工程部/point/point',
    mapper: {
        member: true,
        point: true,
    },
    push: facePointPush
};
exports.bus = [
    facePoint,
];
//# sourceMappingURL=index.js.map