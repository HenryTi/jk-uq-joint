import { UqInTuid } from "uq-joint";
import { uqs } from "../uqs";
import config from 'config';

const promiseSize = config.get<number>("promiseSize");

export const Chemical: UqInTuid = {
    uq: uqs.jkChemical,
    type: 'tuid',
    entity: 'Chemical',
    key: 'ID',
    mapper: {
        $id: 'ID@Chemical',
        no: "ID",
        CAS: "CAS",
        description: "Description",
        descriptionCN: "DescriptionC",
        molecularFomula: "MolFomula",
        molecularWeight: "MolWeight",
        mdlNumber: "MdlNumber",
    },
    pull: ` select top ${promiseSize} chemID as ID, CAS, Description, DescriptionC, MolWeight, MolFomula, MdlNumber
            from opdata.dbo.sc_chemical
            where reliability = 0 and chemID > @iMaxId order by chemID`
};
