"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceOutProductChanged = void 0;
const uqOutRead_1 = require("../../../first/converter/uqOutRead");
exports.faceOutProductChanged = {
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
    pull: async (joint, uqBus, queue) => {
        let sql = `SELECT TOP 1 ID, CustomerUnitOnPlatformId, PackageId, CONVERT(DECIMAL(18, 2), SalePrice) AS SalePrice,
                        SalePriceCurrency, Storage, IsDelete
                    FROM ProdData.dbo.Export_ThirdPartyPlatformEntryResult
                    WHERE DataMode = 2 AND ID > @iMaxId
                    ORDER BY ID;`;
        return await uqOutRead_1.uqOutRead(sql, queue);
    }
};
//# sourceMappingURL=outerProductChanged.js.map