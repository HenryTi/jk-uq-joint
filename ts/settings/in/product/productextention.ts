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
        let sql = `SELECT TOP 1 ID, jkid, MF, MW, Synonymity, SynonymityC, MP, BP, FP, Density, n20D, SR, MDL, 
                Beilstein,Merck, EINECS, SpecialRequirement, Hazard, RiskSign, HValue, PValue, UN, HazardClass, subrisk, 
                PackingG, WGK, RTECS, TSCA
                FROM  ProdData.dbo.Export_PProductExtention
                where   ID > @iMaxId
                order by ID`;
        let result = await uqPullRead(sql, queue);
        if (result) {
            let { queue: newQueue, data } = result;
            let data2 = {
                ProductID: data.jkid, Content: JSON.stringify(_.pickBy(_.omit(data, ["ID", "jkid"]),
                    (value, key) => { return value !== undefined && value !== null && value !== 'N/A' && value !== '' }))
            };
            return { lastPointer: newQueue, data: [data2] };
        }
    }
}

