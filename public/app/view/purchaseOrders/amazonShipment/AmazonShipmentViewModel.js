Ext.define('AmazSync.view.purchaseOrders.amazonShipment.AmazonShipmentViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.purchaseorders-amazonshipment-amazonshipmentview',
    data: {
        updateInventory: [],
        warehouse: null,
        confirmShipments: true,
        parentShipmentName:''
    },
    stores: {
        shipmentidGridStore: {
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: ''
                }
            },
            // data: [{ shipmentid: 'FBA16VRV6TXZ' },
            // { shipmentid: 'FBA16VRV6TXZ' },
            // { shipmentid: 'FBA165F72M17' },
            // { shipmentid: 'FBA165DTLMSC' },
            // { shipmentid: 'FBA165F3J5FM' },
            // { shipmentid: 'FBA165DY5NFB' },
            // { shipmentid: 'FBA165DY366R' },
            // { shipmentid: 'FBA165F5KRX3' }
            // ]
        },
        shipmentidCompareGridStore: {
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: ''
                }
            }
        },
    }
});
