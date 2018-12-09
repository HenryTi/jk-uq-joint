import { scanIn } from "./scanIn";
import { scanOut } from "./scanOut";

const interval = 60*1000;

export async function startTimer() {
    setTimeout(tick, 3*1000);
}

function wait(minutes: number):Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(resolve, minutes*60*1000);
    });
}

async function tick() {
    try {
        console.log('tick ' + new Date().toLocaleString());
        await scanIn();
        await scanOut();
    }
    catch (err) {
        console.error('error in timer tick');
        console.error(err);
    }
    finally {
        setTimeout(tick, interval);
    }
}
