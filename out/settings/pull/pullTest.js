/*
import { Joint } from "../../uq-joint";

export async function pullTest(joint:Joint, queue:number): Promise<number> {
    switch (queue) {
        default: return;
        case 0:
            await joint.pushToUsq('product', {no:'no-1', discription: 'aaa'})
            return 1;
        case 1:
            await joint.pushToUsq('product', {no:'no-2', discription: 'aaa-bbb'});
            await joint.pushToUsq('price', {product: 'no-2', arr1:[{pack: '23', retail: 5.3}]});
            //await joint.pushToUsq('price-2', {product: 'no-2', pack: '23', retail: 5.3});
            await joint.pushToUsq('product.pack', {prodNo: '1002', no: '1002-2', ratio:2.2, name:'斤'});
            return 2;
    }
}
*/ 
//# sourceMappingURL=pullTest.js.map