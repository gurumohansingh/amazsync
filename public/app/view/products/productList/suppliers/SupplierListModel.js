Ext.define('AmazSync.view.products.productList.suppliers.SupplierListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.products-productlist-suppliers-supplierlist',
    data: {
        name: 'AmazSync',
        costPerCasePack: 0,
        casePackQty: 0
    },
    stores: {
        productSuppliers: {
            autoLoad: false,
            method: 'GET',
            type: 'ajaxStore',
            proxy: {
                type: 'ajax',
                url: commonutil.getUrl('supplier/productsuppliers'),
                reader: {
                    type: 'json',
                    rootProperty: ''
                }
            }
        }
    }

});
