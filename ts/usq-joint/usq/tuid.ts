import { Entity } from "./entity";
import { OpenApi } from "./usq";

const maxCacheSize = 1000;
class Cache {
    private values:{[id:number]:any} = {};
    private queue:number[] = [];

    getValue(id:number):any {
        let ret = this.values[id];
        if (ret === undefined) return;
        this.moveToHead(id);
        return ret;
    }
    setValue(id:number, value:any) {
        if (this.queue.length >= maxCacheSize) {
            let removeId = this.queue.shift();
            delete this.values[removeId];
        }
        if (this.values[id] !== undefined) {
            this.moveToHead(id);
        }
        else {
            this.queue.push(id);
        }
        this.values[id] = value;
    }

    private moveToHead(id:number) {
        let index = this.queue.findIndex(v => v === id);
        this.queue.splice(index, 1);
        this.queue.push(id);
    }
}


export abstract class Tuid extends Entity {
    private cache:Cache = new Cache;
    private cacheAllProps:Cache = new Cache;

    owner: TuidMain;                    // 用这个值来区分是不是TuidArr
    get typeName(): string { return 'tuid';}
    getIdFromObj(obj:any) {return obj.id}
    async loadValue(id:number, allProps:boolean):Promise<any> {
        let ret:any;
        if (allProps === true) {
            ret = this.cacheAllProps.getValue(id);
        }
        else {
            ret = this.cache.getValue(id);
        }
        if (ret !== undefined) return ret;
        let openApi = await this.getApiFrom();
        ret = await this.internalLoadTuidValue(openApi, id, allProps);
        if (allProps === true)
            this.cacheAllProps.setValue(id, ret);
        else
            this.cache.setValue(id, ret);
        return ret;
    }
    protected abstract internalLoadTuidValue(openApi:OpenApi, id:number, allProps:boolean):Promise<any>;
}

export class TuidMain extends Tuid {
    get Main() {return this}
    get usqApi() {return this.usq.openApi};

    divs: {[name:string]: TuidDiv};

    public setSchema(schema:any) {
        super.setSchema(schema);
        let {arrs} = schema;
        if (arrs !== undefined) {
            this.divs = {};
            for (let arr of arrs) {
                let {name} = arr;
                let tuidDiv = new TuidDiv(this.usq, name, this.typeId);
                tuidDiv.owner = this;
                this.divs[name] = tuidDiv;
                tuidDiv.setSchema(arr);
            }
        }
    }
    protected async internalLoadTuidValue(openApi:OpenApi, id:number, allProps:boolean):Promise<any> {
        return openApi.loadTuidValue(this.name, undefined, id, allProps);
    }
}

export class TuidDiv extends Tuid {
    get Main() {return this.owner}

    async getApiFrom() {
        return await this.owner.getApiFrom();
    }

    protected async internalLoadTuidValue(openApi:OpenApi, id:number, allProps:boolean):Promise<any> {
        return openApi.loadTuidValue(this.owner.name, this.name, id, allProps);
    }
}
