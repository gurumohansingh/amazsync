Ext.define('AmazSync.view.profit.ProfitViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.profit-profitview',

    loadRestock: function (combo, newValue, OldValue) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var store = vm.getStore('profitStore');
        if (newValue) {
            store.getProxy().setExtraParam('marketPlace', newValue);
            store.load();
        }
    },
    setDefaultMarketPlace: function (combo) {
        combo.setValue("US")
    },

    searchBySku: function (text, newValue) {

        var me = this, view = me.getView(), vm = me.getViewModel();
        var store = vm.getStore('profitStore');
        store.clearFilter();
        if (newValue) {
            store.filterBy((record) => {
                return record.get('sellerSKU') && record.get('sellerSKU').toLowerCase() == newValue.toLowerCase();
            })
        }
    }
});