import { UqInTuid, UqInMap } from "uq-joint";
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

export const WarehouseRoom: UqInTuid = {
    uq: uqs.jkWarehouse,
    type: 'tuid',
    entity: 'WarehouseRoom',
    key: 'ID',
    mapper: {
        $id: 'ID@WarehouseRoom',
        no: "WarehouseRoomID",
        name: "WarehouseRoomName",
        warehouse: "WarehouseID@Warehouse",
        isValid: "isValid"
    }
};

export const Shelf: UqInTuid = {
    uq: uqs.jkWarehouse,
    type: 'tuid',
    entity: 'Shelf',
    key: 'ID',
    mapper: {
        $id: 'ID@Shelf',
        no: "ShelfID",
        name: "ShelfName",
        warehouseRoom: "WarehouseRoomID@WarehouseRoom",
        isValid: "isValid"
    }
};

export const ShelfLayer: UqInTuid = {
    uq: uqs.jkWarehouse,
    type: 'tuid',
    entity: 'ShelfLayer',
    key: 'ID',
    mapper: {
        $id: 'ID@ShelfLayer',
        no: "ShelfLayerID",
        name: "ShelfLayerName",
        shelf: "ShelfID@Shelf",
        isValid: "isValid"
    }

};

export const ShelfBlock: UqInTuid = {
    uq: uqs.jkWarehouse,
    type: 'tuid',
    entity: 'ShelfBlock',
    key: 'ID',
    mapper: {
        $id: 'ID@ShelfBlock',
        no: "ShelfBlockID",
        name: "ShelfBlockID",
        shelfLayer: "ShelfLayerID@ShelfLayer"
    }
};

