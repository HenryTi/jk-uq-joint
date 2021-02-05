import config from 'config';
import fetch from "node-fetch";

const smsServer: any = config.get<string>("smsServer");

export class SmsSender {

    /*
    constructor() {
        super(smsServer.baseUrl);
    }
    */

    async sendMessage(message: string) {
        let { baseUrl, un, pw, dc, tf, mobile, messageHeader } = smsServer;
        message = encodeURI(messageHeader + message);
        let response = await fetch(`${baseUrl}mt?un=${un}&pw=${pw}&da=${mobile}&dc=${dc}&tf=${tf}&sm=${message}`, undefined);
        if (response.status === 200) {
            let result = await response.text();
        }
    }
}