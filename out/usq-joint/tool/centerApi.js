"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import config from 'config';
const fetch_1 = require("./fetch");
/*
const centerHost = config.get<string>('centerhost');
const centerUrl = urlSetCenterHost(config.get<string>('center'));

export function urlSetCenterHost(url:string):string {
    return url.replace('://centerhost/', '://'+centerHost+'/');
}
*/
class CenterApi extends fetch_1.Fetch {
    async busSchema(owner, bus) {
        let ret = await this.get('open/bus', { owner: owner, bus: bus });
        return ret.schema;
    }
    async serviceBus(serviceUID, serviceBuses) {
        await this.post('open/save-service-bus', {
            service: serviceUID,
            bus: serviceBuses,
        });
    }
    async unitx(unit) {
        return await this.get('open/unitx', { unit: unit });
    }
    async usqUrl(unit, usq) {
        return await this.get('open/usq-url', { unit: unit, usq: usq });
    }
    async urlFromUsq(unit, usqFullName) {
        return await this.get('open/url-from-usq', { unit: unit, usq: usqFullName });
    }
    async usqlDb(name) {
        return await this.get('open/usqldb', { name: name });
    }
    async pushTo(msg) {
        return await this.post('push', msg);
    }
    async unitxBuses(unit, busOwner, bus, face) {
        return await this.get('open/unitx-buses', { unit: unit, busOwner: busOwner, bus: bus, face: face });
    }
}
exports.centerApi = new CenterApi();
//# sourceMappingURL=centerApi.js.map