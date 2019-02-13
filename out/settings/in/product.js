"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("../uqs");
exports.Brand = {
    uq: uqs_1.uqs.jkProduct,
    type: 'tuid',
    entity: 'Brand',
    key: 'ID',
    mapper: {
        $id: 'ID@Brand',
        no: "ID",
        name: "BrandName",
    }
};
exports.BrandSalesRegion = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'BrandSalesRegion',
    mapper: {
        brand: "BrandID@Brand",
        arr1: {
            salesRegion: "^SalesRegionID@SalesRegion",
            level: "^Level",
        }
    }
};
exports.BrandDeliveryTime = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'BrandDeliveryTime',
    mapper: {
        brand: "BrandID@Brand",
        arr1: {
            salesRegion: "^SalesRegionID@SalesRegion",
            minValue: "^MinValue",
            maxValue: "^MaxValue",
            unit: '^Unit',
            // deliveryTimeDescription: "^DeliveryTimeDescription",
            isRestrict: '^Restrict',
        }
    }
};
exports.Product = {
    uq: uqs_1.uqs.jkProduct,
    type: 'tuid',
    entity: 'Product',
    key: 'ID',
    mapper: {
        $id: 'ID@Product',
        no: "ID",
        brand: "BrandID@Brand",
        origin: "ProductNumber",
        description: 'Description',
        descriptionC: 'DescriptionC',
    }
};
exports.ProductChemical = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'ProductChemical',
    mapper: {
        product: "ID@ProductX",
        arr1: {
            chemical: "^ChemicalID@Chemical",
            CAS: "^CAS",
            purity: "^Purity",
            molecularFomula: "^MolecularFomular",
            molecularWeight: "^MolecularWeight",
        }
    }
};
exports.ProductSalesRegion = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'ProductSalesRegion',
    mapper: {
        product: 'ProductID@ProductX',
        arr1: {
            salesRegion: '^SalesRegionID@SalesRegion',
            isValid: '^IsValid',
        }
    }
};
exports.ProductLegallyProhibited = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'ProductLegallyProhibited',
    mapper: {
        product: 'ProductID@ProductX',
        arr1: {
            salesRegion: '^SalesRegionID@SalesRegion',
            reason: '^Reason',
        }
    }
};
/*
export const ProductPackType: UqInTuid = {
    uq: uqs.jkProduct,
    type: 'tuid',
    entity: 'ProductPackType',
    key: 'ID',
    mapper: {
        article: 'ProductID@Product',
        packType: 'PackType@PackType',
    }
};

export const ProductPack: UqInTuidArr = {
    uq: uqs.jkProduct,
    type: 'tuid-arr',
    entity: 'ProductPackType.Pack',
    key: "ID",
    owner: "ProductID",
    mapper: {
        owner: "ProductID",
        radiox: "PackNr",
        radioy: "Quantity",
        name: "Name",
    }
};

export const Price: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'Price',
    mapper: {
        productPackType: "ProductID@ProductPackType",
        pack: "PackingID@ProductPack",
        arr1: {
            salesRegion: "^SalesRegionID@SalesRegion",
            // expireDate: "Expire_Date",
            discountinued: "^Discontinued",
            retail: "^Price",
        }
    }
};
*/
exports.ProductX = {
    uq: uqs_1.uqs.jkProduct,
    type: 'tuid',
    entity: 'ProductX',
    key: 'ID',
    mapper: {
        $id: 'ID@ProductX',
        no: 'ID',
        brand: 'BrandID@Brand',
        origin: 'ProductNumber',
        description: 'Description',
        descriptionC: 'DescriptionC',
    }
};
exports.ProductPackX = {
    uq: uqs_1.uqs.jkProduct,
    type: 'tuid-arr',
    entity: 'ProductX.PackX',
    key: "ID",
    owner: "ProductID",
    mapper: {
        //owner: "ProductID",
        $id: "ID@ProductPackX",
        jkcat: 'ID',
        radiox: "PackNr",
        radioy: "Quantity",
        unit: "Name",
    }
};
exports.PriceX = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'PriceX',
    mapper: {
        product: "ProductID@ProductX",
        pack: "PackingID@ProductPackX",
        arr1: {
            salesRegion: "^SalesRegionID@SalesRegion",
            expireDate: "Expire_Date",
            discountinued: "^Discontinued",
            retail: "^Price",
        }
    }
};
//# sourceMappingURL=product.js.map