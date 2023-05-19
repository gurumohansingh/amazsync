Ext.define('AmazSync.view.products.ProductsPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.products-productspanel',
    applyFilter: function (radio, newValue) {
        var me = this, view = me.getView();
        // var statusFilterValue = view.lookupReference('statusFilter').getValue(),
        //     searchFilterValue = view.lookupReference('searchFilter').getValue().toLowerCase().trim();
        var store = Ext.getStore('productList');
        store.clearFilter(true);
        /*var statusFilter = true, searchFilter = true;
        store.filterBy((record) => {
            if (statusFilterValue['status'] == "All") {
                statusFilter = true;
            }
            else {
                statusFilter = record.get('status') == statusFilterValue['status'];
            }
            if (searchFilterValue.trim() == "") {
                searchFilter = true;
            }
            else {
                searchFilter = record.get('itemName').toLowerCase().includes(searchFilterValue) || record.get('sellerSKU').toLowerCase().includes(searchFilterValue) || record.get('amazonASIN').toLowerCase().includes(searchFilterValue);
            }
            return statusFilter && searchFilter;
        });*/
        if(newValue && typeof newValue !== 'object')
            store.getProxy().setExtraParam('searchParam', newValue.trim());
        else
            store.getProxy().setExtraParam('searchParam', null);
        store.load({
            params: {
                page: 1,
                start: 0,
                limit: 25                
            }
        });
        view.lookupReference('productList').getController().updateCount();
    },
    applyLiveFilter: function (radio, newValue) {
        var me = this, view = me.getView();
        var store = Ext.getStore('productList');
        store.getProxy().setExtraParam('amazonLiveStatus', newValue['liveonamazon']);
        store.load()
    }
});
