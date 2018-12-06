import { map } from "./map";

export const consts = {
    unit: 24,
    allowedIP: [
        '218.249.142.140'
    ],
}

export async function saveTuid(tuid:string, no:string, data:any):Promise<void> {
    let id = 33;
    await map(tuid, id, no);
}
