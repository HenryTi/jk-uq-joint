"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("../uqs");
exports.Warehouse = {
    uq: uqs_1.us.jkWarehouse,
    type: 'tuid',
    entity: 'Warehouse',
    key: 'ID',
    mapper: {
        $id: 'ID@Warehouse',
        no: "ID",
        name: "WarehouseName",
    }
};
exports.SalesRegionWarehouse = {
    uq: uqs_1.us.jkWarehouse,
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
//# sourceMappingURL=warehouse.js.map