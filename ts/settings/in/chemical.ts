import { UqInTuid } from "../../uq-joint";
import { us } from "../uqs";

export const Chemical: UqInTuid = {
    uq: us.jkChemical,
    type: 'tuid',
    entity: 'Chemical',
    key: 'ID',
    mapper: {
        $id: 'ID@Chemical',
        no: "ID",
        CAS: "CAS",
        description: "Description",
        descriptionCN: "DescriptionC",
        molecularFomula: "molFomula",
        molecularWeight: "molWeight",
        mdlNumber: "mdlNumber",
    }
};
