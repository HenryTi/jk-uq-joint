"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const productInventoryPull = async (joint, uqBus, queue) => {
    let sql = `select top 1 wi.ID, wi.WarehouseID, j.jkid as ProductID, wi.PackagingID as PackingID, wi.Inventory
        from ProdData.dbo.Export_WarehouseInventory wi inner join zcl_mess.dbo.jkcat j on wi.PackagingID = j.jkcat
        where wi.ID > @iMaxId order by wi.ID`;
    return await uqOutRead_1.uqPullRead(sql, queue);
};
exports.faceProductInventory = {
    face: '百灵威系统工程部/point/productInventory',
    mapper: {
        warehouse: 'WarehouseID@Warehouse',
        product: 'ProductID@ProductX',
        pack: 'PackingID@ProductX_PackX',
        quantity: 'Inventory',
    },
    pull: productInventoryPull,
};
//# sourceMappingURL=productInventoryBus.js.map