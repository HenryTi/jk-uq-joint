import { uqPullRead } from "../../../first/converter/uqOutRead";
import { uqs } from "../../../settings/uqs";
import { DataPullResult, Joint, UqInMap } from "uq-joint";
import _ from 'lodash';

export const ProductExtention: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductExtention',
    mapper: {
        product: "ProductID@ProductX",
        content: "Content",
    },
    pull: async (joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> => {
        let result = await getNext(queue);
        let round = 0;
        while (result === undefined && round < 300) {
            queue++;
            round++;
            result = await getNext(queue);
        }
        return result;
    }
}

async function getNext(queue: number) {
    let sql = `SELECT TOP 1 ID, jkid, MF, MW, Synonymity, SynonymityC, MP, BP, FP, Density, n20D, SR as '[a]20D', MDL, 
                Beilstein, Merck, EINECS, SpecialRequirement, 
                Hazard, RiskSign, HValue, PValue, UN, HazardClass, subrisk, PackingG, WGK, RTECS, TSCA
                FROM  ProdData.dbo.Export_PProductExtention
                where   ID > @iMaxId
                order by ID`;
    let result = await uqPullRead(sql, queue);
    if (result) {
        let { queue: newQueue, data } = result;
        let x = _.pickBy(_.omit(data, ["ID", "jkid"]),
            (value) => { return value !== undefined && value !== null && value !== 'N/A' && value !== '' });
        if (Object.keys(x).length > 0) {
            return { lastPointer: newQueue, data: [{ ProductID: data.jkid, Content: JSON.stringify(x) }] };
        }
    }
}