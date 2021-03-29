import { Joint, MapUserToUq, UqIn } from "uq-joint";
//import { Joint, MapUserToUq, UqIn } from "../../uq-joint";
import _ from 'lodash';
import { WarehouseRoom, Shelf, ShelfLayer, ExpressLogistics, OutInBoundReason } from "../../settings/in/warehouse";

export async function WarehouseRoomPullWrite(joint: Joint, uqIn: UqIn, data: any): Promise<boolean> {

    try {

        await joint.uqIn(WarehouseRoom, _.pick(data, ["ID", "WarehouseRoomID", "WarehouseRoomName", "WarehouseID", "isValid"]));
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function ShelfPullWrite(joint: Joint, uqIn: UqIn, data: any): Promise<boolean> {

    try {

        await joint.uqIn(Shelf, _.pick(data, ["ID", "ShelfID", "ShelfName", "WarehouseRoomID", "isValid"]));
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function ShelfLayerPullWrite(joint: Joint, uqIn: UqIn, data: any): Promise<boolean> {

    try {

        await joint.uqIn(ShelfLayer, _.pick(data, ["ID", "ShelfLayerID", "ShelfLayerName", "ShelfID", "isValid"]));
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function ExpressLogisticsPullWrite(joint: Joint, uqIn: UqIn, data: any): Promise<boolean> {

    try {

        await joint.uqIn(ExpressLogistics, _.pick(data, ["ID", "TransWay", "TransMode", "isvalid", "Region"]));
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function OutInBoundReasonPullWrite(joint: Joint, uqIn: UqIn, data: any): Promise<boolean> {

    try {

        await joint.uqIn(OutInBoundReason, _.pick(data, ["ID", "OIReasonID", "RsnDescription", "definition"]));
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}