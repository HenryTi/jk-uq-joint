import { saveTuid, Mapper } from "../tool/tuid";

export async function product(data:any):Promise<number> {
    let mapper: Mapper = {
        $key: 'no',
        $import: 'all',
        discription: 'disc',
        packType: 'pk@packType',
    };
    return await saveTuid('product', data, mapper);
}
