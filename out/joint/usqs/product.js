"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function product(queue) {
    if (queue > 10)
        return;
    return {
        queue: ++queue,
        data: {
            queue: queue,
            content: 'from usq',
        }
    };
}
exports.product = product;
//# sourceMappingURL=product.js.map