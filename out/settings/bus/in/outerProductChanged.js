"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceOutProductChanged = void 0;
const uqOutRead_1 = require("../../../first/converter/uqOutRead");
exports.faceOutProductChanged = {
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
    pull: async (joint, uqBus, queue) => {
        let sql = `SELECT TOP 1 ID, entryId, customerUnitOnPlatformId, salesRegionId, thirdPartyPlatformTemplateTypeId,
            packageId, brandId, cas, isHazard, catalogPrice, salePrice, salePriceCurrency, discount, storage,
            priceValidity, packageType, onlyInStock, onlyNotDuplicate, dataMode, isDelete, stateName,
            customerUnitOnPlatformDiscountId
        FROM	ProdData.dbo.Export_ThirdPartyPlatformEntryResult
        WHERE	ID > @iMaxId order by ID `;
        return await uqOutRead_1.uqOutRead(sql, queue);
    }
};
//# sourceMappingURL=outerProductChanged.js.map