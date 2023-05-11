Ext.define('AmazSync.view.purchaseOrders.amazonShipment.AmazonShipmentViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.purchaseorders-amazonshipment-amazonshipmentview',
    init: function () {
        var me = this, view = me.getView(), vm = me.getViewModel();
        vm.set('confirmShipments', view.confirmShipments);
        vm.set('parentShipmentName', view.parentShipmentName);
    },

    fetchShipmentId: function () {
        var me = this, view = me.getView(), vm = me.getViewModel(), shipmentidGridStore = vm.getStore('shipmentidGridStore');
        var shipmentName = view.lookupReference('shipmentName').getValue();
        commonutil.apiCall('mws/fetchShipmentByName', commonutil.GET, { shipmentName: shipmentName }, view)
            .then((res) => {
                var shipments = JSON.parse(res);
                shipmentidGridStore.loadData(shipments);
            });
    },
    getShipmentsDetails: function (button) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var shipmentidGrid = view.lookupReference('shipmentidGrid').getSelectionModel().getSelected();
        var shipmentsId = [];
        shipmentidGrid.items.forEach(element => {
            shipmentsId.push(element.get('shipmentId'))
        });
        commonutil.apiCall('mws/inboundshipment', commonutil.POST, { shipments: shipmentsId }, view)
            .then((res) => {
                var shipments = JSON.parse(res)
                me.calculateShipmentDiff(shipments);
            });
    },
    calculateShipmentDiff: function (data) {
        
        var me = this, view = me.getView(), vm = me.getViewModel();
        var shipmentidCompareGridStore = vm.getStore('shipmentidCompareGridStore');
        var virtualShipments = view.virtualShipments.items;
        var diffdata = [], updateInventory = [];
        virtualShipments.forEach(record => {
            var sku = record.get('sku'),
                sent = record.get('sent');
            var search = data.filter((item) => {
                return item['SKU'] == sku;
            });
            if (search.length > 0) {
                diffdata.push({
                    shipmentid: search[0].ShipmentId,
                    sku: sku,
                    sent: sent,
                    total_ordered: record.get('total_ordered'),
                    shippedQty: search[0].QuantityShipped,
                    diff: sent - search[0].QuantityShipped
                })
                updateInventory.push({
                    sku: sku,
                    diff: sent - search[0].QuantityShipped,
                    newSentQty: search[0].QuantityShipped,
                    masterSku:record.get('masterSKU')
                })

            } else {
                diffdata.push({
                    shipmentid: "Not Found",
                    sku: sku,
                    sent: 0,
                    shippedQty: 0,
                    total_ordered: record.get('total_ordered'),
                    diff: sent
                })
                updateInventory.push({
                    sku: sku,
                    diff: sent,
                    newSentQty: 0,
                    masterSku:record.get('masterSKU')
                })
            }
        });
        vm.set('updateInventory', updateInventory);
        shipmentidCompareGridStore.loadData(diffdata);
    },
    confirmShipments: function (btn) {

        var me = this, view = me.getView(), vm = me.getViewModel();
        var action = btn.btnAction;
        var shipmentidCompareGridStore = vm.getStore('shipmentidCompareGridStore').getData();
        var virtualShipments = view.virtualShipments.items;
        var updateInventory = vm.get('updateInventory', updateInventory);
        if (Ext.isEmpty(updateInventory)) {
            Ext.toast("There is no data to update inventory");
            return false
        }
        virtualShipments.forEach(record => {
            var sku = record.get('sku');
            var search = shipmentidCompareGridStore.find('sku', sku);
            if (search) {
                var newSentQty = search.get('shippedQty')
                record.set('sent', newSentQty);
                search.set('sent', newSentQty)
            }
        });
        commonutil.apiCall('location/updateBulkInventory', commonutil.POST, { action: action, inventory: JSON.stringify(updateInventory), warehouse: view.warehouse, shipmentId: view.shipmentId }, view)
            .then((res) => {
                Ext.toast(res);
                Ext.getStore('purchaseOrderStore').reload();
                if(action=="confirmFinalizeShipments"){
                    view.parentVm.set('hiddenButtons',true)
                }
                view.up('window').close();
            });
    },

});
