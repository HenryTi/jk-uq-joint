import { UqInTuid, UqInMap } from "../../uq-joint";
import { us } from "../uqs";

export const Warehouse: UqInTuid = {
    uq: us.jkWarehouse,
    type: 'tuid',
    entity: 'Warehouse',
    key: 'ID',
    mapper: {
        $id: 'ID@Warehouse',
        no: "ID",
        name: "WarehouseName",
    }
};

export const SalesRegionWarehouse: UqInMap = {
    uq: us.jkWarehouse,
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
