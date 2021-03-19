"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyExchangeRate = void 0;
const uqOutRead_1 = require("../../../first/converter/uqOutRead");
const uqs_1 = require("../../uqs");
exports.CurrencyExchangeRate = {
    uq: uqs_1.uqs.jkAchievement,
    type: 'map',
    entity: 'CurrencyExchangeRate',
    mapper: {
        currency: 'Currency@Currency',
        year: 'DateYear',
        arr1: {
            month: '^DateMonth',
            RMBTo: '^Rate',
            USDTo: '^RateUSD',
            EURTo: '^RateEUR',
            GBPTo: '^RateGBP',
        }
    },
    pull: async (joint, uqIn, queue) => {
        let step_seconds = 7 * 24 * 60 * 60;
        if ((queue - 8 * 60 * 60 + step_seconds) * 1000 > Date.now())
            return undefined;
        let nextQueue = queue + step_seconds;
        let sql = `
            select DATEDIFF(s, '1970-01-01', p.update__time) + 1 as ID, p.Currency, p.DateYear, p.DateMonth
                    , p.Rate, p.RateUSD, p.RateEUR, p.RateGBP
            from zcl_mess.dbo.Currency p
            where p.update__time >= DATEADD(s, @iMaxId, '1970-01-01') and p.update__time <= DATEADD(s, ${nextQueue}, '1970-01-01')
            order by p.update__time
           `;
        try {
            let ret = await uqOutRead_1.uqOutRead(sql, queue);
            if (ret === undefined) {
                ret = { lastPointer: nextQueue, data: [] };
            }
            return ret;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
};
//# sourceMappingURL=currency.js.map