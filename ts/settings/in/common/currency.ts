import { uqs } from "../../uqs";
import { DataPullResult, UqInTuid } from "uq-joint";
import { Joint, UqInMap } from "uq-joint";
import { timeAsQueue } from "../../../settings/timeAsQueue";

export const Currency: UqInTuid = {
    uq: uqs.jkCommon,
    type: 'tuid',
    entity: 'Currency',
    key: 'ID',
    mapper: {
        $id: 'ID@Currency',
        name: "ID",
    }
};

export const CurrencyExchangeRate: UqInMap = {
    uq: uqs.jkCommon,
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
async function pullCurrencyExchangeRate(joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> {
    let sql = ` select top --topn-- DATEDIFF(s, '1970-01-01', p.update__time) as ID, p.Currency, p.DateYear, p.DateMonth
                , p.Rate, p.RateUSD, p.RateEUR, p.RateGBP
                from zcl_mess.dbo.Currency p
                where p.update__time >= DATEADD(s, @iMaxId, '1970-01-01')
                order by p.update__time`;
    try {
        let ret = await timeAsQueue(sql, queue, pullCurrencyExchangeRate.lastLength);
        if (ret !== undefined) {
            pullCurrencyExchangeRate.lastLength = ret.lastLength
            return ret.ret;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}