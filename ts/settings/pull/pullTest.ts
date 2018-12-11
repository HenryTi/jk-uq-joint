import { Joint } from "../../usq-joint";

export async function pullTest(joint:Joint, queue:number): Promise<number> {
    switch (queue) {
        default: return;
        case 0: 
            await joint.pushToUsq('product', {no:'no-1', discription: 'aaa'})
            return 1;
        case 1: 
            await joint.pushToUsq('product', {no:'no-2', discription: 'aaa-bbb'})
            return 2;
    }
}
