Ext.define('AmazSync.view.virtualShipments.VirtualShipmentsViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.virtualshipments-virtualshipmentsview',

    virtualshipments: function (data, marketPlace, wareHouse) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var virtualShipmentStore = vm.getStore('virtualShipmentStore');
        vm.set({ marketPlace: marketPlace, wareHouse: wareHouse })
        virtualShipmentStore.loadData(data);

    },

    addVirtualshipments: function (button) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var sku = [], totalShipments = 0;
        var virtualShipmentStore = vm.getStore('virtualShipmentStore');
        if (Ext.isEmpty(vm.get('shipmentName'))) {
            Ext.toast("Enter virtual shipments");
            return false
        }
        virtualShipmentStore.each((record) => {

            sku.push({ sku: record.get('amz_sku'),masterSKU:record.get('masterSKU'), sent: record.get('qty_to_send_amz'), casePackQuantity: record.get('casePackQuantity') });
            totalShipments += +record.get('qty_to_send_amz');
        })
        
        var params = {
            items: JSON.stringify(sku),
            sent: totalShipments,
            name: vm.get('shipmentName'),
            marketPlace: vm.get('marketPlace'),
            wareHouse: vm.get('wareHouse')
        }
        commonutil.apiCall('shipment/addvirtualshipment', "POST", params, view).then(responce => {
            
            Ext.toast("Virtual shipment created successfully");
            Ext.getStore('restockStore').reload();
            var data = JSON.parse(responce);
            //new shipment            
            if (data.length > 0) {
                var newShipment = data[0];
                var poDetails = Ext.create('AmazSync.view.purchaseOrders.detail.PurchaseOrderDetail', {
                    title: newShipment['remoteId']
                })
                poDetails.getStore().loadData(JSON.parse(newShipment['items']));
                poDetails.getViewModel().set('shipmentName', newShipment['remoteId']);
                poDetails.getViewModel().set('warehouse', vm.get('wareHouse'));
                poDetails.getViewModel().set('shipmentId', newShipment['id']);
                poDetails.getViewModel().set('hiddenButtons', newShipment['is_virtual']==1?false:true);
                navigation.addComponent({
                    poDetails,
                    directComponent: true,
                    tabName: newShipment['remoteId']
                });
                view.close();
            } else {
                Ext.toast("Failed");
            }
        })
            .catch((error) => {
                Ext.toast(error.responseText);
            })
    }

});
