Ext.define('AmazSync.view.inventory.InventoryModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.inventory-inventory',
    data: {
        name: 'AmazSync',
        defaultWarehouse: null,
        stockFilter: { stock: 3 },
        searchFilter: '',
        totalCount: 0,
        locationFilter: { location: 3 }
    },
    stores: {
        binLocationStore: {
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
            },
        }
    }
});
