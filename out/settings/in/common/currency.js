"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyExchangeRate = exports.Currency = void 0;
const uqs_1 = require("../../uqs");
const timeAsQueue_1 = require("../../../settings/timeAsQueue");
exports.Currency = {
    uq: uqs_1.uqs.jkCommon,
    type: 'tuid',
    entity: 'Currency',
    key: 'ID',
    mapper: {
        $id: 'ID@Currency',
        name: "ID",
    }
};
exports.CurrencyExchangeRate = {
    uq: uqs_1.uqs.jkCommon,
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
    pull: pullCurrencyExchangeRate
};
pullCurrencyExchangeRate.lastLength = 0;
async function pullCurrencyExchangeRate(joint, uqIn, queue) {
    let sql = ` select top --topn-- DATEDIFF(s, '1970-01-01', p.update__time) as ID, p.Currency, p.DateYear, p.DateMonth
                , p.Rate, p.RateUSD, p.RateEUR, p.RateGBP
                from zcl_mess.dbo.Currency p
                where p.update__time >= DATEADD(s, @iMaxId, '1970-01-01')
                order by p.update__time`;
    try {
        let ret = await timeAsQueue_1.timeAsQueue(sql, queue, pullCurrencyExchangeRate.lastLength);
        if (ret !== undefined) {
            pullCurrencyExchangeRate.lastLength = ret.lastLength;
            return ret.ret;
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
//# sourceMappingURL=currency.js.map