import { uqs } from "../../uqs";
import { UqInMap } from "uq-joint";

export const ChemicalSynonmity: UqInMap = {
    uq: uqs.jkChemical,
    type: 'map',
    entity: 'ChemicalSynonmity',
    mapper: {
        chemical: "ChemicalID@Chemical",
        arr1: {
            language: '^LanugageID@Language',
            synonmity: 'Synonmity'
        }
    }
};