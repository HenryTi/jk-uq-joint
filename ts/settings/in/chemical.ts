import { UsqInTuid } from "../../usq-joint";
import { usqs } from "../usqs";

export const Chemical: UsqInTuid = {
    usq: usqs.jkChemical,
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
