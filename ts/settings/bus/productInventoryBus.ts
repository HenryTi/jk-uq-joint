import { UqBus, DataPull, Joint, DataPullResult } from "../../uq-joint";
import { uqPullRead, uqOutRead } from "../../first/converter/uqOutRead";

const productInventoryPull: DataPull<UqBus> = async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {
    let sql = `select top 1 wi.ID, wi.WarehouseID, j.jkid as ProductID, wi.PackagingID as PackingID, wi.Inventory
        from ProdData.dbo.Export_WarehouseInventory wi inner join zcl_mess.dbo.jkcat j on wi.PackagingID = j.jkcat
        where wi.ID > @iMaxId order by wi.ID`;
    return await uqOutRead(sql, queue);
}

export const faceProductInventory: UqBus = {
    face: '百灵威系统工程部/point/productInventory',
    mapper: {
        warehouse: 'WarehouseID@Warehouse',
        product: 'ProductID@ProductX',
        pack: 'PackingID@ProductX_PackX',
        quantity: 'Inventory',
    },
    pull: productInventoryPull,
}