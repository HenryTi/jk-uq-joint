"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { Joint, UqInTuid } from "./uq-joint";
const uq_joint_1 = require("uq-joint");
//import { } from "uq-joint/tool/centerApi";
//import { MapFromUq, MapUserToUq } from "uq-joint/tool/mapData";
//import { map } from "uq-joint/tool/map";
//import { decrypt } from "uq-joint/tool/hashPassword";
const webUserBus_1 = require("./settings/bus/webUserBus");
class JKUqJoint extends uq_joint_1.Joint {
    async userOut(face, queue) {
        let ret = await uq_joint_1.centerApi.queueOut(queue, 1);
        if (ret !== undefined && ret.length === 1) {
            let user = ret[0];
            if (user === null)
                return user;
            return this.decryptUser(user);
        }
    }
    async userOutOne(id) {
        let user = await uq_joint_1.centerApi.queueOutOne(id);
        if (user) {
            user = this.decryptUser(user);
            let mapFromUq = new uq_joint_1.MapFromUq(this);
            let outBody = await mapFromUq.map(user, webUserBus_1.faceUser.mapper);
            return outBody;
        }
    }
    decryptUser(user) {
        let pwd = user.pwd;
        if (!pwd)
            user.pwd = '123456';
        else
            user.pwd = uq_joint_1.decrypt(pwd);
        if (!user.pwd)
            user.pwd = '123456';
        return user;
    }
    async userIn(uqIn, data) {
        let { key, mapper, uq: uqFullName, entity: tuid } = uqIn;
        if (key === undefined)
            throw 'key is not defined';
        if (uqFullName === undefined)
            throw 'tuid ' + tuid + ' not defined';
        let keyVal = data[key];
        let mapToUq = new uq_joint_1.MapUserToUq(this);
        try {
            let body = await mapToUq.map(data, mapper);
            if (body.id <= 0) {
                delete body.id;
            }
            let ret = await uq_joint_1.centerApi.queueIn(body);
            if (!body.id && (ret === undefined || typeof ret !== 'number')) {
                console.error(body);
                let { id: code, message } = ret;
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
                await uq_joint_1.map(tuid, ret, keyVal);
            }
            return body.id || ret;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.JKUqJoint = JKUqJoint;
//# sourceMappingURL=jk-uq-joint.js.map