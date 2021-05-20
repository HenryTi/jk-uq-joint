import { DataPullResult, Joint, UqBus } from "uq-joint";
import { uqOutRead } from "../../../first/converter/uqOutRead";


export const faceOutProductChanged: UqBus = {
    face: '百灵威系统工程部/Adapter/outProductChanged',
    from: 'local',
    mapper: {
        customerUnitOnPlatformId: true,
        packageId: true,
        brandId: true,
        cas: true,
        salePrice: true,
        catalogPrice: true,
        salePriceCurrency: true,
        discount: true,
        packageType: true,
        priceValidity: true,
        salesRegionId: true,
        isHazard: true,
        storage: true,
        onlyInStock: true,
        onlyNotDuplicate: true,
        dataMode: true,
        isDelete: true,
        stateName: true,
    },
    pull: async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {

        let sql = `SELECT TOP 1 ID, entryId, customerUnitOnPlatformId, salesRegionId, thirdPartyPlatformTemplateTypeId,
            packageId, brandId, cas, isHazard, catalogPrice, salePrice, salePriceCurrency, discount, storage,
            priceValidity, packageType, onlyInStock, onlyNotDuplicate, dataMode, isDelete, stateName,
            customerUnitOnPlatformDiscountId
        FROM	ProdData.dbo.Export_ThirdPartyPlatformEntryResult
        WHERE	ID > @iMaxId order by ID `;
        return await uqOutRead(sql, queue);
    }
};