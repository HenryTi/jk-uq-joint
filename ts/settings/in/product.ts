import { UsqInTuid, UsqInMap, UsqInTuidArr, UsqIn } from "../../usq-joint";
import { usqs } from "../usqs";

export const Brand: UsqInTuid = {
    usq: usqs.jkProduct,
    type: 'tuid',
    entity: 'Brand',
    key: 'ID',
    mapper: {
        $id: 'ID@Brand',
        no: "ID",
        name: "BrandName",
    }
};

export const BrandSalesRegion: UsqInMap = {
    usq: usqs.jkProduct,
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

export const BrandDeliveryTime: UsqInMap = {
    usq: usqs.jkProduct,
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

export const Product: UsqInTuid = {
    usq: usqs.jkProduct,
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

export const ProductChemical: UsqInMap = {
    usq: usqs.jkProduct,
    type: 'map',
    entity: 'ProductChemical',
    mapper: {
        product: "ID@Product",
        arr1: {
            chemical: "^ChemicalID@Chemical",
            CAS: "^CAS",
            purity: "^Purity",
            molecularFomula: "^MolecularFomular",
            molecularWeight: "^MolecularWeight",
        }
    }
};

export const ProductSalesRegion: UsqInMap = {
    usq: usqs.jkProduct,
    type: 'map',
    entity: 'ProductSalesRegion',
    mapper: {
        product: 'ProductID@Product',
        arr1: {
            salesRegion: '^SalesRegionID@SalesRegion',
            isValid: '^IsValid',
        }
    }
};

export const ProductLegallyProhibited: UsqInMap = {
    usq: usqs.jkProduct,
    type: 'map',
    entity: 'ProductLegallyProhibited',
    mapper: {
        product: 'ProductID@Product',
        arr1: {
            salesRegion: '^SalesRegionID@SalesRegion',
            reason: '^Reason',
        }
    }
};
/*
export const ProductPackType: UsqInTuid = {
    usq: usqs.jkProduct,
    type: 'tuid',
    entity: 'ProductPackType',
    key: 'ID',
    mapper: {
        article: 'ProductID@Product',
        packType: 'PackType@PackType',
    }
};

export const ProductPack: UsqInTuidArr = {
    usq: usqs.jkProduct,
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

export const Price: UsqInMap = {
    usq: usqs.jkProduct,
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

export const ProductX: UsqInTuid = {
    usq: usqs.jkProduct,
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

export const ProductPackX: UsqInTuidArr = {
    usq: usqs.jkProduct,
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

export const PriceX: UsqInMap = {
    usq: usqs.jkProduct,
    type: 'map',
    entity: 'Price2',
    mapper: {
        productx: "ProductID@ProductX",
        packx: "PackingID@ProductPackX",
        arr1: {
            salesRegion: "^SalesRegionID@SalesRegion",
            // expireDate: "Expire_Date",
            discountinued: "^Discontinued",
            retail: "^Price",
        }
    }
};