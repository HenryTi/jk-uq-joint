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
    async uqUrl(unit, uq) {
        return await this.get('open/uq-url', { unit: unit, uq: uq });
    }
    async urlFromUq(unit, uqFullName) {
        return await this.post('open/url-from-uq', { unit: unit, uq: uqFullName });
    }
    async uqDb(name) {
        return await this.get('open/uqdb', { name: name });
    }
    async pushTo(msg) {
        return await this.post('push', msg);
    }
    async unitxBuses(unit, busOwner, bus, face) {
        return await this.get('open/unitx-buses', { unit: unit, busOwner: busOwner, bus: bus, face: face });
    }
    /**
     * 顺序取到所有最近的user信息，包括密码
     * @param start：这个是userid的起始数；
     * @param page: 这个是每次返回的数组的长度；
     * 返回值是一个数组，数组中对象的schema如下面的注释所示
     */
    async queueOut(start, page) {
        return await this.get('open/queue-out', { start: start, page: page });
    }
    /*
    param:
    {
        $type: '$user',
        id: 2,
        name: '1',
        pwd: 'pwd',
        nick: 'nick1-1',
        icon: 'icon1-1',
        country: 3,
        mobile: 13901060561,
        email: 'liaohengyi123@outlook.com',
        wechat: 'wechat212',
    }
    */
    /**
     * 用来将user数据写入Tonva系统（的中心服务器?)
     * @param param: 要写入的user数据，格式如上
     * @returns 正数值表示新建user的id；
     * 出现错误时{id, message} id的含义：-1:id和name不匹配；-2：email已经被使用过了；-3: mobile已经被使用过了；-4: wechat已经被使用了；
     */
    async queueIn(param) {
        return await this.post('open/queue-in', param);
    }
}
exports.centerApi = new CenterApi();
//# sourceMappingURL=centerApi.js.map