"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutInBoundReason = exports.ExpressLogistics = exports.ShelfBlock = exports.ShelfLayer = exports.Shelf = exports.WarehouseRoom = exports.SalesRegionWarehouse = exports.Warehouse = void 0;
const uqs_1 = require("../uqs");
exports.Warehouse = {
    uq: uqs_1.uqs.jkWarehouse,
    type: 'tuid',
    entity: 'Warehouse',
    key: 'ID',
    mapper: {
        $id: 'ID@Warehouse',
        no: "WarehouseID",
        name: "WarehouseName",
    }
};
exports.SalesRegionWarehouse = {
    uq: uqs_1.uqs.jkWarehouse,
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
exports.WarehouseRoom = {
    uq: uqs_1.uqs.jkWarehouse,
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
exports.Shelf = {
    uq: uqs_1.uqs.jkWarehouse,
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
exports.ShelfLayer = {
    uq: uqs_1.uqs.jkWarehouse,
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
exports.ShelfBlock = {
    uq: uqs_1.uqs.jkWarehouse,
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
exports.ExpressLogistics = {
    uq: uqs_1.uqs.jkWarehouse,
    type: 'tuid',
    entity: 'ExpressLogistics',
    key: 'ID',
    mapper: {
        $id: 'ID@ExpressLogistics',
        no: "TransWay",
        name: "TransMode",
        isValid: "isvalid",
        salesRegion: "Region@SalesRegion"
    }
};
exports.OutInBoundReason = {
    uq: uqs_1.uqs.jkWarehouse,
    type: 'tuid',
    entity: 'OutInBoundReason',
    key: 'ID',
    mapper: {
        $id: 'ID@OutInBoundReason',
        no: "OIReasonID",
        name: "RsnDescription",
        note: "definition"
    }
};
//# sourceMappingURL=warehouse.js.map