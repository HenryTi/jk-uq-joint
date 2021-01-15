import { UqBus, DataPull, DataPush, Joint, DataPullResult } from "uq-joint";
import { uqPullRead, uqOutRead } from "../../first/converter/uqOutRead";
import _ from 'lodash';


const shelfHistoryPull: DataPull<UqBus> = async (joint: Joint, uqBus: UqBus, queue: number): Promise<DataPullResult> => {

    /*
    let sql = ` SELECT	TOP 1 ID, shelfBlockNo, jkid, jkcat, lotNr, oiMark, qty, CONVERT(NVARCHAR(30), inputTime, 20) AS inputTime
                FROM	ProdData.dbo.Export_ShelfHistoryFirst_20201220
                WHERE	ID > @iMaxId ORDER BY ID `;
    */

    let sql = ` SELECT	TOP 1 ID, ShelfBlockNo, JKid, Jkcat, LotNr, OIMark, Qty, CONVERT(NVARCHAR(30), inputTime, 25) AS InputTime
                FROM	ProdData.dbo.Export_ShelfInOutBoundHistory
                WHERE	ID > @iMaxId ORDER BY ID `;
    return await uqOutRead(sql, queue);
}

export const faceShelfInOutBoundHistory: UqBus = {
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