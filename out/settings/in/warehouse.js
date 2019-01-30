"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usqs_1 = require("../usqs");
exports.Warehouse = {
    usq: usqs_1.usqs.jkWarehouse,
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
    usq: usqs_1.usqs.jkWarehouse,
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