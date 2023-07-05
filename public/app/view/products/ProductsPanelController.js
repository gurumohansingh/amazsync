Ext.define('AmazSync.view.products.ProductsPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.products-productspanel',
    applyFilter: function (field, newValue) {
        var me = this, view = me.getView();
        var statusFilter = view.lookupReference('statusFilter').getValue(),
        searchByTextFilter = view.lookupReference('searchByTextFilter').getValue(),
        inventoryTypeFilter = view.lookupReference('inventoryTypeFilter').getValue()
        var store = Ext.getStore('productList');       
        store.getProxy().setExtraParams({searchParam:searchByTextFilter,status:statusFilter,amazonLiveStatus:inventoryTypeFilter});
        store.load();
    }
});
