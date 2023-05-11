Ext.define('AmazSync.view.products.productDetail.productDetailModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.products-productdetail-productdetail',
    data: {
        EAN: null,
        UPC: null,
        additionalPrepInstructions: null,
        amazonASIN: null,
        amazonFNSKU: null,
        amazonOversized: null,
        amazonPrepInstructions: null,
        amazonSnL: null,
        casePackUPC: null,
        changeLog: null,
        dateAdded: null,
        dimensions: null,
        expirationDateRequired: null,
        hazmat: null,
        history: null,
        imageHeight: null,
        imageUrl: null,
        imageWidth: null,
        isPartSKUOnly: null,
        ismasterSku: null,
        masterSku: null,
        itemName: null,
        itemNote: null,
        kit: null,
        lastUpdateFromAmazon: null,
        location: null,
        packageDimensions: null,
        prepLaborCost: null,
        prepMaterialCost: null,
        productId: null,
        productIdType: null,
        reshippingCost: null,
        sellerId: null,
        sellerSKU: null,
        status: null,
        suppliers: null,
        tag: null,
        targetDaysInWarehouse: null,
        targetDaysInAmazon: null,
        timeStamp: null,
        dimensionsLLocal: null,
        dimensionsL: null,
        dimensionsWLocal: null,
        dimensionsW: null,
        dimensionsHLocal: null,
        dimensionsH: null,
        warehouse: null,
        warehousename: null,
        binlocationname: null,
        itemNameLocal: null,
        countryofOriginLocal: null,
        htcCodeLocal: null,
        casePackQuantity: null,

    },
    formulas: {
        getKit: function (get) {
            return get('kit') == 1 ? "Yes" : "No";
        },
        getTimeStamp: function (get) {
            return get('timeStamp') ? Ext.util.Format.date(get('timeStamp'), 'M d,Y h:i') : "";
        },
        getLastUpdateFromAmazon: function (get) {
            try {
                return get('lastUpdateFromAmazon') ? Ext.util.Format.date(get('lastUpdateFromAmazon'), 'M d,Y h:i') : "";
            }
            catch (err) { console.log(err) }
        }
    },
    stores: {
        tagStore: {
            autoLoad: true,
            data: [{
                tag: 'New Arrival'
            }, {
                tag: 'Used'
            }],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: ''
                }
            }
        },
        warehouseStore: {
            autoLoad: false,
            method: 'GET',
            type: 'ajaxStore',
            proxy: {
                type: 'ajax',
                url: commonutil.getUrl('location/getbinlocations'),
                reader: {
                    type: 'json',
                    rootProperty: ''
                }
            }
        }
    }

});
