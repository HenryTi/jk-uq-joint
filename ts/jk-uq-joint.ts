//import { Joint, UqInTuid } from "./uq-joint";
import { Joint, UqInTuid, centerApi, MapFromUq, MapUserToUq, map, decrypt} from "uq-joint";
//import { } from "uq-joint/tool/centerApi";
//import { MapFromUq, MapUserToUq } from "uq-joint/tool/mapData";
//import { map } from "uq-joint/tool/map";
//import { decrypt } from "uq-joint/tool/hashPassword";
import { faceUser } from "./settings/bus/webUserBus";

export class JKUqJoint extends Joint {
    protected async userOut(face: string, queue: number) {
        let ret = await centerApi.queueOut(queue, 1);
        if (ret !== undefined && ret.length === 1) {
            let user = ret[0];
            if (user === null) return user;
            return this.decryptUser(user);
        }
    }

    public async userOutOne(id: number) {
        let user = await centerApi.queueOutOne(id);
        if (user) {
            user = this.decryptUser(user);
            let mapFromUq = new MapFromUq(this);
            let outBody = await mapFromUq.map(user, faceUser.mapper);
            return outBody;
        }
    }

    protected decryptUser(user: { pwd: string }) {
        let pwd = user.pwd;
        if (!pwd)
            user.pwd = '123456';
        else
            user.pwd = decrypt(pwd);
        if (!user.pwd) user.pwd = '123456';
        return user;
    }

    public async userIn(uqIn: UqInTuid, data: any): Promise<number> {
        let { key, mapper, uq: uqFullName, entity: tuid } = uqIn;
        if (key === undefined) throw 'key is not defined';
        if (uqFullName === undefined) throw 'tuid ' + tuid + ' not defined';
        let keyVal = data[key];
        let mapToUq = new MapUserToUq(this);
        try {
            let body = await mapToUq.map(data, mapper);
            if (body.id <= 0) {
                delete body.id;
            }
            let ret = await centerApi.queueIn(body);
            if (!body.id && (ret === undefined || typeof ret !== 'number')) {
                console.error(body);
                let { id: code, message } = ret as any;
                switch (code) {
                    case -2:
                        data.Email += '\t';
                        ret = await this.userIn(uqIn, data);
                        break;
                    case -3:
                        data.Mobile += '\t';
                        ret = await this.userIn(uqIn, data);
                        break;
                    default:
                        console.error(ret);
                        ret = -5;
                        break;
                }
            }
            if (ret > 0) {
                await map(tuid, ret, keyVal);
            }
            return body.id || ret;
        } catch (error) {
            throw error;
        }
    }
}
