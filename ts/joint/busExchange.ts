import { Request, Response } from "express";
import { define } from "./define";
import { execProc, tableFromProc } from "../db/mysql/tool";

// [
//    {face: 'owner/bus/face', queue: 0}
// ]
interface Ticket {
    moniker: string;
    queue: number;
    data: string;
};
export async function busExchange(req: Request, res: Response) {
    let tickets:Ticket[] = req.body;
    if (Array.isArray(tickets) === false) tickets = [tickets as any];
    
    let ret:{moniker:string, queue:number, data:any}[] = [];
    for (let ticket of tickets) {
        let {moniker, queue, data} = ticket;
        if (moniker === undefined) continue;        
        if (data !== undefined) {
            await execProc('write_queue', [1, moniker, JSON.stringify(data)]);
        }
        else {
            let q = Number(queue);
            if (Number.isNaN(q) === false) {
                let readQueue = await tableFromProc('read_queue', [0, moniker, q]);
                if (readQueue.length > 0) {
                    ret.push(readQueue[0]);
                }
            }
        }
    }
    res.json(ret);
}
