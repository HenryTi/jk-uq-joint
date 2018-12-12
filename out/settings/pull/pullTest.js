"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function pullTest(joint, queue) {
    switch (queue) {
        default: return;
        case 0:
            await joint.pushToUsq('product', { no: 'no-1', discription: 'aaa' });
            return 1;
        case 1:
            await joint.pushToUsq('product', { no: 'no-2', discription: 'aaa-bbb' });
            await joint.pushToUsq('price', { product: 'no-2', arr1: [{ pack: '23', retail: 5.3 }] });
            //await joint.pushToUsq('price-2', {product: 'no-2', pack: '23', retail: 5.3})
            return 2;
    }
}
exports.pullTest = pullTest;
//# sourceMappingURL=pullTest.js.map