import { UsqInTuid, UsqInMap } from "../../usq-joint";
import { usqs } from "../usqs";

export const Warehouse: UsqInTuid = {
    usq: usqs.jkWarehouse,
    type: 'tuid',
    entity: 'Warehouse',
    key: 'ID',
    mapper: {
        $id: 'ID@Warehouse',
        no: "ID",
        name: "WarehouseName",
    }
};

export const SalesRegionWarehouse: UsqInMap = {
    usq: usqs.jkWarehouse,
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
