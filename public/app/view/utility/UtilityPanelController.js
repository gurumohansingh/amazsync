Ext.define('AmazSync.view.utility.UtilityPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.utility-utilitypanel',

    init: function () {
        var me = this, view = me.getView(), vm = me.getViewModel();
        me.reloadLastSync();
    },

    updateInventory: function (btn) {
        Ext.Msg.show({
            title: 'Updating Local Inventory',
            message: 'Do you want to run process in background?',
            buttons: Ext.Msg.YESNOCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    commonutil.apiCall('mws/sync', "GET", null, null).then(responce => {
                        Ext.getStore('productList').reload();
                        Ext.Msg.alert('Local Inventory', 'Local SKU Updated successfully.');
                    })
                }
            }
        });
    },
    fetchRestock: function (btn) {
        var me = this, vm = me.getViewModel(), view = me.getView();
        commonutil.apiCall('mws/fetchrestock', commonutil.GET, null, view)
            .then((res) => {
                Ext.toast('Submit Successfully');
            })
            .catch((err) => {
                Ext.toast('Enable to submit');
            })
    },
    fetchAmazonFees: function (btn) {
        var me = this, vm = me.getViewModel(), view = me.getView();
        commonutil.apiCall('mws/fetchFeesEstimate', commonutil.GET, null, view)
            .then((res) => {
                Ext.toast('Submit Successfully');
            })
            .catch((err) => {
                Ext.toast('Enable to submit');
            })
    },
    fetchAmazonShipments: function (btn) {
        var me = this, vm = me.getViewModel(), view = me.getView();
        commonutil.apiCall('shipment/sync', commonutil.GET, null, view)
            .then((res) => {
                Ext.toast('Submit Successfully');
            })
            .catch((err) => {
                Ext.toast('Enable to submit');
            })
    },
    reloadLastSync: function (btn) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var store = vm.getStore('lastSynchStore');
        store.reload();
    }


});
