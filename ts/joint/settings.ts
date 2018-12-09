import { Settings } from "./defines";
import { product, packType } from "./in";
import { order } from "./out";

export const settings:Settings = {
    unit: 27,
    allowedIP: [
        '218.249.142.140',
        '211.5.7.60'
    ],
    /*
    usqs: {
        'JKDev/jkProduct': {
            'tuid': {
                'product': {write: product},
                'packType': {write: packType},
            }
        }
    },
    */
    in: {
        'product': product,
        'packType': packType,
    },
    out: {
        'order': order,
    }
}
