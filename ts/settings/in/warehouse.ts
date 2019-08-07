import { UqInTuid, UqInMap } from "../../uq-joint";
import { uqs } from "../uqs";

export const Warehouse: UqInTuid = {
    uq: uqs.jkWarehouse,
    type: 'tuid',
    entity: 'Warehouse',
    key: 'ID',
    mapper: {
        $id: 'ID@Warehouse',
        no: "WarehouseID",
        name: "WarehouseName",
    }
};

export const SalesRegionWarehouse: UqInMap = {
    uq: uqs.jkWarehouse,
    type: 'map',
    entity: 'SalesRegionWarehouse',
    mapper: {
        salesRegion: "SalesRegionID@SalesRegion",
        arr1: {
            warehouse: "^WarehouseID@Warehouse",
            minDeliveryDays: "^minDeliverTime",
            maxDeliveryDays: "^maxDeliverTime",
        }
    }
};
