import {Fetch} from './fetch';

class CenterApi extends Fetch {
    async busSchema(owner:string, bus:string):Promise<string> {
        let ret = await this.get('open/bus', {owner: owner, bus: bus});
        return ret.schema;
    }

    async serviceBus(serviceUID:string, serviceBuses:string):Promise<void> {
        await this.post('open/save-service-bus', {
            service: serviceUID,
            bus: serviceBuses,
        });
    }

    async unitx(unit:number):Promise<any> {
        return await this.get('open/unitx', {unit:unit});
    }

    async uqUrl(unit:number, uq:number):Promise<any> {
        return await this.get('open/uq-url', {unit:unit, uq:uq});
    }

    async urlFromUq(unit:number, uqFullName:string):Promise<{db:string, url:string, urlTest:string}> {
        return await this.get('open/url-from-uq', {unit:unit, uq:uqFullName});
    }

    async unitxBuses(unit:number, busOwner:string, bus:string, face:string):Promise<any[]> {
        return await this.get('open/unitx-buses', {unit:unit, busOwner:busOwner, bus:bus, face:face});
    }

    async queueOut(start:number, page:number):Promise<any[]> {
        return await this.get('open/queue-out', {start:start, page:page});
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
    async queueIn(param:any):Promise<number> {
        return await this.post('open/queue-in', param)
    }
}

export const centerApi = new CenterApi();
