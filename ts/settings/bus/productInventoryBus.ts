import { UqBus, DataPull, Joint } from "../../uq-joint";
import { uqPullRead } from "../../first/converter/uqOutRead";

const productInventoryPull: DataPull<UqBus> = async (joint: Joint, uqBus: UqBus, queue: number): Promise<{ queue: number, data: any }> => {
    let sql = `select top 1 wi.ID, wi.WarehouseID, j.jkid as ProductID, wi.PackagingID as PackingID, wi.Inventory
        from ProdData.dbo.Export_WarehouseInventory wi inner join zcl_mess.dbo.jkcat j on wi.PackagingID = j.jkcat
        where wi.ID > @iMaxId order by wi.ID`;
    return await uqPullRead(sql, queue);
}

export const faceProductInventory: UqBus = {
    face: '百灵威系统工程部/point/productInventory',
    mapper: {
        warehouse: 'WarehouseID@Warehouse',
        product: 'ProductID@ProductX',
        pack: 'PackingID@ProductX.PackX',
        quantity: 'Inventory',
    },
    pull: productInventoryPull,
}