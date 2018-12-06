import { scanInput } from "./scanInput";
import { scanUsq } from "./scanUsq";

const interval = 60*1000;

export function startTimer() {
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
        await scanInput();
        await scanUsq();
    }
    catch (err) {
        console.error('timer error');
        console.log(err && err.message);
    }
    finally {
        setTimeout(tick, interval);
    }
}
