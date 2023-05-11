Ext.define('AmazSync.view.purchaseOrders.detail.PurchaseOrderDetailController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.purchaseorders-detail-purchaseorderdetail',   
    updateView: function () {
        var me = this, view = me.getView(), store = view.getStore();
        view.getView().refresh();
    },

    optimizeVirtualshipments: function (btn) {
        var me = this, view = me.getView(), store = view.getStore();
        view.setLoading(true);
        store.each((record) => {
            var casePackQuantity = record.get('casePackQuantity'),
                sent = record.get('sent');
            var newCasePackQuantity;
            if (sent <= 150) {
                newCasePackQuantity = sent;
            }
            else {
                if (sent % casePackQuantity == 0) {
                    newCasePackQuantity = me.calculateEvenCasePack(sent, casePackQuantity);
                }
                else {
                    newCasePackQuantity = me.calculateOddCasePack(sent, casePackQuantity);
                }
            }
            record.set('casePackQuantity', newCasePackQuantity);
        })
        view.setLoading(false);
    },
    calculateEvenCasePack: function (sent, casePack) {
        var number = 150;
        while (number) {
            if (sent % number == 0 && number % casePack == 0) {
                console.log(number)
                break;
            }
            else {
                number--;
            }

        }
        return number;
    },

    calculateOddCasePack: function (sent) {
        var number = 150;
        while (number) {
            if (sent % number == 0) {
                console.log(number)
                break;
            }
            else {
                number--;
            }

        }
        return number;
    },

    generateWorkFlow: function (btn) {
        var me = this, view = me.getView(), store = view.getStore();
        var fileName = `${me.getViewModel('shipmentName').get('shipmentName')}.csv`, data = [];
        store.each(record => {
            data.push({
                SKU: record.get('sku'),
                QTY: record.get('sent'),
                UNITS_PER_CASE: record.get('casePackQuantity')
            })
        })
        commonutil.formCall('file/exportToCsv', commonutil.PO, null, { fileName: fileName, fileData: JSON.stringify(data) }, null, view, true);
    },

    syncShipmentwithAmazon: function (confirmShipments = true) {

        var me = this, view = me.getView(), store = view.getStore(), vm = me.getViewModel();
        var win = Ext.create('Ext.window.Window', {
            width: '80%',
            modal: true,
            items: [{
                xtype: 'amazonShipmentView',
                height: '100%',
                width: '100%',
                virtualShipments: store.getData(),
                warehouse: vm.get('warehouse'),
                shipmentId: vm.get('shipmentId'),
                confirmShipments: confirmShipments,
                parentShipmentName:view.parentShipmentName,
                parentVm:vm
            }]
        });
        win.show();
    },
    finalizeAmazonShipment: function () {
        var me = this, view = me.getView(), store = view.getStore(), vm = me.getViewModel();
        Ext.MessageBox.show({
            title: 'Warning',
            msg: 'Are you sure?  You should ONLY finalize a shipment AFTER it has been shipped, otherwise Sync Shipment instead',
            buttons: Ext.MessageBox.OKCANCEL,
            icon: Ext.MessageBox.WARNING,
            fn: function (btn) {
                if (btn == 'ok') {
                    me.syncShipmentwithAmazon(false);
                } else {
                    return;
                }
            }
        });
    },
    deleteVirtualshipment: function () {
        var me = this, view = me.getView(), store = view.getStore(), vm = me.getViewModel();
        Ext.MessageBox.show({
            title: 'Warning',
            msg: 'Are you sure to DELETE ?',
            buttons: Ext.MessageBox.OKCANCEL,
            icon: Ext.MessageBox.WARNING,
            fn: function (btn) {
                if (btn == 'ok') {
                    commonutil.apiCall('shipment/deleteVirtualshipment', commonutil.DELETE, { shipmentId: vm.get('shipmentId') }, view)
                        .then((res) => {
                            Ext.toast(res);
                            Ext.getStore('purchaseOrderStore').reload();
                            view.up('tabpanel').remove(view.up('tabpanel').getActiveTab())
                        });
                } else {
                    return;
                }
            }
        });
    }

});
