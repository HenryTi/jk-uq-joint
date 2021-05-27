import { DataPullResult, Joint, UqBus } from "uq-joint";
import { uqOutRead } from "../../../first/converter/uqOutRead";


export const faceOutProductChanged: UqBus = {
    face: '百灵威系统工程部/Adapter/outProductChanged',
    from: 'local',
    mapper: {
        customerUnitOnPlatformId: 'CustomerUnitOnPlatformId',
        packageId: 'PackageId@ProductX_PackX',
        salesPrice: 'SalePrice',
        salesPriceCurrency: 'SalePriceCurrency',
        stock: 'Storage',
        isDelete: 'IsDelete',
    },
    pull: async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {

        let sql = `SELECT TOP 1 ID, CustomerUnitOnPlatformId, PackageId, CONVERT(DECIMAL(18, 2), SalePrice) AS SalePrice,
                        SalePriceCurrency, Storage, IsDelete
                    FROM ProdData.dbo.Export_ThirdPartyPlatformEntryResult
                    WHERE DataMode = 2 AND ID > @iMaxId
                    ORDER BY ID;`;
        return await uqOutRead(sql, queue);
    }
};