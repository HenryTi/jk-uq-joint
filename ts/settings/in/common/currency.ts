import { uqOutRead } from "../../../first/converter/uqOutRead";
import { uqs } from "settings/uqs";
import { DataPullResult } from "uq-joint";
import { Joint, UqInMap } from "uq-joint";

export const CurrencyExchangeRate: UqInMap = {
    uq: uqs.jkAchievement,
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
    pull: async (joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> => {
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
            let ret = await uqOutRead(sql, queue);
            if (ret === undefined) {
                ret = { lastPointer: nextQueue, data: [] };
            }
            return ret;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
};