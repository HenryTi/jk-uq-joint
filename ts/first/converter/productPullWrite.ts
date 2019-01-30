import { Joint } from "../../usq-joint";
import * as _ from 'lodash';
import { Product, ProductX, ProductChemical } from "../../settings/in/product";

export async function productPullWrite(joint: Joint, data: any) {

    try {
        await joint.usqIn(Product, _.pick(data, ["ID", "BrandID", "ProductNumber", "Description", "DescriptionC"]));
        await joint.usqIn(ProductX, _.pick(data, ["ID", "BrandID", "ProductNumber", "Description", "DescriptionC"]));
        await joint.usqIn(ProductChemical, _.pick(data, ["ID", "ChemicalID", "Purity", "CAS", "MolecularFomula", "MolecularWeight"]));
    } catch (error) {
        console.error(error);
    }
}