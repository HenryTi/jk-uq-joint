import { saveTuid } from "../tool/saveTuid";
import { Mapper } from "../tool/mapper";

export async function product(data:any):Promise<number> {
    let mapper: Mapper = {
        $key: 'no',
        // $import: 'all',
        discription: 'discription',
        packType: 'packType@packType',
        a: false,
        b: true,
        c: true,
    };
    return await saveTuid('product', data, mapper);
}
