import { Request, Response } from "express";

// [
//    {face: 'owner/bus/face', queue: 0}
// ]
interface Ticket {
    face: string;
    queue: number;
    data: string;
};
export async function writeBus(req: Request, res: Response) {
    let tickets:Ticket[] = req.body;
    if (Array.isArray(tickets) === false) tickets = [tickets as any];
    /*
    if (!tickets) {
        res.json({});
        return;
    }

    tickets = [
        {face: '$$$/test/complex1', queue: 0, data: undefined},
        {face: '$$$/test/complex1', queue: undefined, data: '1\t2\ta38\n3\t2\t1543678133000\t\n\n\n'}
    ];
    */
    /*
    let faces = [
        {id: 1, face: '$$$/test/complex1'}
    ];
    let unitMsgs = [
        {face: 1, unit: unit, msgId: 0}
    ];*/
    //let {name, facesIn, facesOut} = joint;
    /*
    let faces:{id:number; face:string}[] = []
    let unitMsgs:{face:number; unit:number; msgId:number}[] = [];

    let seed = 1;
    let dict:{[face:string]:number} = {};
    let dictn:{[n:number]:string} = {};
    for (let ticket of tickets) {
        let {face, queue, data} = ticket;
        if (face === undefined) continue;        
        if (data !== undefined) {
            // 写bus
            if (facesIn === null) continue;
            if ((facesIn as string).indexOf(face) < 0) continue;
            //await writeDataToBus(runner, face, unit, name, data);
        }
        else {
            if (facesOut === null) continue;
            if ((facesOut as string).indexOf(face) < 0) continue;
            let faceId = dict[face];
            if (faceId === undefined) {
                dict[face] = faceId = seed++;
                dictn[faceId] = face;
                faces.push({id: faceId, face: face});
            }
            unitMsgs.push({face: faceId, unit: unit, msgId: queue});
        }
    }

    if (seed > 1) {
        let facesText = faces.map(v => v.id + '\t' + v.face).join('\n');
        let faceUnitMessages = unitMsgs.map(v => v.face + '\t' + v.unit + '\t' + v.msgId);
        let ret = []; //await runner.call('GetBusMessages', [undefined, undefined, facesText, faceUnitMessages]);
        for (let row of ret) {
            row.face = dictn[row.face];
        }
        res.json(ret);
    }
    else {
        res.json([]);
    }
    */
}
