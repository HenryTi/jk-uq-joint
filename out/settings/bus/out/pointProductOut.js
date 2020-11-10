"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facePointProductOut = void 0;
const tools_1 = require("../../../mssql/tools");
exports.facePointProductOut = {
    face: '百灵威系统工程部/pointShop/pointProductBusOut',
    from: 'local',
    mapper: {
        source: true,
        sourceId: 'sourceId@ProductX_PackX',
        sourceId2: 'sourceId',
        point: true,
        startDate: true,
        endDate: true,
        imageUrl: true,
    },
    push: async (joint, uqIn, queue, data) => {
        let { source, sourceId, point, startDate, endDate } = data;
        let marketingId = 'A08-20160422A';
        console.log(data);
        if (source === 'self') {
            if (startDate * 1000 < Date.now() && endDate * 1000 > Date.now()) {
                await tools_1.execSql(`if exists(select 1 from dbs.dbo.MGift where marketingId = @marketingId and jkcat = @sourceId)
                begin
                    update dbs.dbo.MGift set Score = @point, price = jp.price
                    from   dbs.dbo.MGift g
                            inner join zcl_mess.dbo.jkcat_price jp on jp.jkcat = g.jkcat and jp.market_code = 'CN'
                    where  g.marketingId = @marketingId and g.jkcat = @sourceId
                end
                else
                begin
                    insert  into dbs.dbo.MGift(ID, jkcat, score, price, marketingId, note, qty)
                    select  newid(), jp.jkcat, @point, jp.price, @marketingId, '', 1
                    from    zcl_mess.dbo.jkcat_price jp
                    where   jp.jkcat = @sourceId and jp.market_code = 'CN'
                end`, [
                    { 'name': 'marketingId', 'value': marketingId },
                    { 'name': 'sourceId', 'value': sourceId },
                    { 'name': 'point', 'value': point },
                ]);
            }
            else {
                await tools_1.execSql(`delete from dbs.dbo.MGift where marketingId = @marketingId and jkcat = @sourceId`, [
                    { 'name': 'marketingId', 'value': marketingId },
                    { 'name': 'sourceId', 'value': sourceId },
                ]);
            }
        }
        return true;
    }
};
//# sourceMappingURL=pointProductOut.js.map