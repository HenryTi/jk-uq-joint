import { Joint } from "../../usq-joint";
import * as _ from 'lodash';

export async function productPullWrite(joint: Joint, data: any) {

    try {
        await joint.pushToUsq("Product", _.pick(data, ["ID", "BrandID", "ProductNumber", "Description", "DescriptionC"]));
        await joint.pushToUsq("ProductChemical", _.pick(data, ["ID", "ChemicalID", "Purity", "CAS", "MolecularFomula", "MolecularWeight"]));
        await joint.pushToUsq("ProductX", _.pick(data, ["ID", "BrandID", "ProductNumber", "Description", "DescriptionC"]));
    } catch (error) {
        console.error(error);
    }
}