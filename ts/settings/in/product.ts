import { UqInTuid, UqInMap, UqInTuidArr, UqIn, Joint } from "../../uq-joint";
import { uqs } from "../uqs";
import { productPullWrite } from "../../first/converter/productPullWrite";

export const Brand: UqInTuid = {
    uq: uqs.jkProduct,
    type: 'tuid',
    entity: 'Brand',
    key: 'BrandID',
    mapper: {
        $id: 'BrandID@Brand',
        no: "BrandID",
        name: "BrandName",
    },
    pull: `select top 1 ID, BrandID, BrandName
        from ProdData.dbo.Export_Brand where ID > @iMaxId order by ID`,
};

export const BrandSalesRegion: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'BrandSalesRegion',
    mapper: {
        brand: "BrandID@Brand",
        arr1: {
            salesRegion: "^SalesRegionID@SalesRegion",
            level: "^Level",
        }
    },
    pull: `select top 1 ID, BrandID, SalesRegionID, BrandLevel as Level
        from ProdData.dbo.Export_BrandSalesRegion where ID > @iMaxId order by ID`,
};

export const BrandDeliveryTime: UqInMap = {
    uq: uqs.jkProduct,
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
    },
    pull: `select top 1 ID, BrandCode as BrandID, SaleRegionID as SalesRegionID, MinValue, MaxValue, Unit
        , case [Restrict] when 'NoRestrict' then 0 else 1 end as [Restrict]
        from ProdData.dbo.Export_BrandDeliverTime where id > @iMaxId and isValid = 1 order by id`,
};

export const Product: UqInTuid = {
    uq: uqs.jkProduct,
    type: 'tuid',
    entity: 'Product',
    key: 'ProductID',
    mapper: {
        $id: 'ProductID@Product',
        no: "ProductID",
        brand: "BrandID@Brand",
        origin: "ProductNumber",
        description: 'Description',
        descriptionC: 'DescriptionC',
    }
};

export const ProductChemical: UqInMap = {
    uq: uqs.jkProduct,
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

export const ProductSalesRegion: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductSalesRegion',
    mapper: {
        product: 'ProductID@ProductX',
        arr1: {
            salesRegion: '^SalesRegionID@SalesRegion',
            isValid: '^IsValid',
        }
    },
    pull: `select top 1 ID, ProductID, SalesRegionID, IsValid
        from ProdData.dbo.Export_ProductSalesRegion where ID > @iMaxId order by ID`,
};

export const ProductLegallyProhibited: UqInMap = {
    uq: uqs.jkProduct,
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

export const ProductX: UqInTuid = {
    uq: uqs.jkProduct,
    type: 'tuid',
    entity: 'ProductX',
    key: 'ProductID',
    mapper: {
        $id: 'ProductID@ProductX',
        no: 'ProductID',
        brand: 'BrandID@Brand',
        origin: 'ProductNumber',
        description: 'Description',
        descriptionC: 'DescriptionC',
    },
    pull: `select top 1 ID, ProductID, BrandID, ProductNumber, Description, DescriptionC, CasNumber as CAS, ChemicalID
        , MolecularFormula, MolecularWeight, Purity, Grade, MdlNumber, [Restrict]
        from ProdData.dbo.Export_Product where ID > @iMaxId order by ID`,
    pullWrite: productPullWrite,
};

export const ProductPackX: UqInTuidArr = {
    uq: uqs.jkProduct,
    type: 'tuid-arr',
    entity: 'ProductX.PackX',
    key: "PackingID",
    owner: "ProductID",
    mapper: {
        //owner: "ProductID",
        $id: "PackingID@ProductX.PackX",
        jkcat: 'PackingID',
        radiox: "PackNr",
        radioy: "Quantity",
        unit: "Name",
    },
    pull: `select top 1 ID, PackagingID as PackingID, ProductID, PackagingQuantity as PackNr, PackagingVolumn as Quantity, PackagingUnit as Name
        from ProdData.dbo.Export_Packaging where ID > @iMaxId order by ID`,
};

export const PriceX: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'PriceX',
    mapper: {
        product: "ProductID@ProductX",
        pack: "PackingID@ProductX.PackX",
        arr1: {
            salesRegion: "^SalesRegionID@SalesRegion",
            expireDate: "Expire_Date",
            discountinued: "^Discontinued",
            retail: "^Price",
        }
    },
    pull: `select top 1 jp.ID, jp.PackagingID as PackingID, j.jkid as ProductID, jp.SalesRegionID, j.Price
        , j.Currency, j.ExpireDate as Expire_Date, j.Discontinued
        from ProdData.dbo.Export_PackagingSalesRegion jp inner join zcl_mess.dbo.jkcat j on jp.PackagingID = j.jkcat
        where jp.ID > @iMaxId order by jp.ID`,
};