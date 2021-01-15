"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceShelfInOutBoundHistory = void 0;
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const shelfHistoryPull = async (joint, uqBus, queue) => {
    /*
    let sql = ` SELECT	TOP 1 ID, shelfBlockNo, jkid, jkcat, lotNr, oiMark, qty, CONVERT(NVARCHAR(30), inputTime, 20) AS inputTime
                FROM	ProdData.dbo.Export_ShelfHistoryFirst_20201220
                WHERE	ID > @iMaxId ORDER BY ID `;
    */
    let sql = ` SELECT	TOP 1 ID, ShelfBlockNo, JKid, Jkcat, LotNr, OIMark, Qty, CONVERT(NVARCHAR(30), inputTime, 25) AS InputTime
                FROM	ProdData.dbo.Export_ShelfInOutBoundHistory
                WHERE	ID > @iMaxId ORDER BY ID `;
    return await uqOutRead_1.uqOutRead(sql, queue);
};
exports.faceShelfInOutBoundHistory = {
    face: '百灵威系统工程部/warehouse/shelfInOutBoundHistory',
    from: 'local',
    mapper: {
        shelfBlock: 'ShelfBlockNo@ShelfBlock',
        product: 'JKid@ProductX',
        pack: 'Jkcat@ProductX_PackX',
        lotNumber: 'LotNr',
        inOutType: 'OIMark',
        quantity: 'Qty',
        inOutBoundTime: 'InputTime'
    },
    pull: shelfHistoryPull
};
//# sourceMappingURL=shelfInOutBoundHistoryBus.js.map