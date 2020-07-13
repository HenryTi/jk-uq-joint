"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceBulkInquiryBook = void 0;
const uqOutRead_1 = require("../../first/converter/uqOutRead");
exports.faceBulkInquiryBook = {
    face: '百灵威系统工程部/inquiry/bulkInquiryBook',
    from: 'local',
    mapper: {
        inquiryItemId: "inquiryItemID",
        inquiryId: "inquiryID",
        salesman: 'salesmanID@Employee',
        customer: "customerID@Customer",
        organization: "organizationID@Organization",
        iBrand: "iBrandID@Brand",
        iBrandName: true,
        iProduct: 'iProductID',
        iChemical: "iChemicalID@Chemical",
        iCAS: true,
        iOrigin: "iOriginalID",
        iDescription: true,
        iDescriptionC: true,
        iPurity: true,
        iPack: 'iPackingID',
        iRadiox: true,
        iRadioy: true,
        iUnit: true,
        iQuantity: true,
        targetPrice: true,
        targetPriceCurrency: 'targetPriceCurrency@Currency',
        competePrice: true,
        competePriceCurrency: 'competePriceCurrency@Currency',
        iIsValid: true,
        iCreateDate: true,
        quotationItemID: true,
        qBrand: "qBrandID@Brand",
        qBrandName: true,
        qProduct: 'qProductID',
        qChemical: "qChemicalID@Chemical",
        qCAS: true,
        qOrigin: "qOriginalID",
        qDescription: true,
        qDescriptionC: true,
        qPurity: true,
        qPack: 'qPackingID',
        qRadiox: true,
        qRadioy: true,
        qUnit: true,
        qQuantity: true,
        salesPrice: true,
        salesPriceCurrency: 'salesPriceCurrency@Currency',
        freight: true,
        packingCharge: true,
        minDeliveryTime: true,
        maxDeliveryTime: true,
        deliveryTimeUnit: true,
        deliveryTimeDescription: true,
        validUpTo: true,
        qCreateDate: true,
        orderItemId: true,
        lost: true,
        lostComments: true
    },
    pull: async (joint, uqBus, queue) => {
        let sql = `select top 1 ID, inquiryItemID, inquiryID, salesmanID, customerID, organizationID
                , iBrandID, iBrandName, iProductID, iChemicalID, iCAS, iOriginalID, iDescription, iDescriptionC, iPurity
                , iPackingID, iRadiox, iRadioy, iUnit, iQuantity, targetPrice, targetPriceCurrency, competePrice, competePriceCurrency
                , iIsValid, iCreateDate

                , quotationItemID
                , qBrandID, qBrandName, qProductID, qChemicalID, qCAS, qOriginalID, qDescription, qDescriptionC, qPurity
                , qPackingID, qRadiox, qRadioy, qUnit, qQuantity
                , salesPrice, salesPriceCurrency, freight, packingCharge
                , minDeliveryTime, maxDeliveryTime, deliveryTimeUnit, deliveryTimeDescription
                , validUpTo, qCreateDate

                , orderItemId, lost, lostComments

                from ProdData.dbo.Export_BI_BulkInquiry
                where ID > @iMaxId
                order by ID`;
        return await uqOutRead_1.uqOutRead(sql, queue);
    }
};
//# sourceMappingURL=bulkInquiryBook.js.map