Ext.define('AmazSync.view.virtualShipments.VirtualShipmentsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.virtualshipments-virtualshipmentsview',
    data: {
        shipmentName: null,
        marketPlace: null,
        wareHouse: null,
    },

    stores: {
        virtualShipmentStore: {
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: ''
                }
            }
        }
    }

});
