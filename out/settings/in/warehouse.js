"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesRegionWarehouse = exports.Warehouse = void 0;
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
//# sourceMappingURL=warehouse.js.map