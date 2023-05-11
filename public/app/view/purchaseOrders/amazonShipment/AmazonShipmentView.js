
Ext.define('AmazSync.view.purchaseOrders.amazonShipment.AmazonShipmentView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.amazonShipmentView',
    requires: [
        'AmazSync.view.purchaseOrders.amazonShipment.AmazonShipmentViewController',
        'AmazSync.view.purchaseOrders.amazonShipment.AmazonShipmentViewModel'
    ],

    controller: 'purchaseorders-amazonshipment-amazonshipmentview',
    viewModel: {
        type: 'purchaseorders-amazonshipment-amazonshipmentview'
    },
    layout: 'vbox',
    items: [{
        xtype: 'form',
        width: '100%',
        height: '10%',
        layout: {
            type: 'hbox',
            pack: 'center'
        },
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Shipment Name',
            emptyText: 'Search by shipment name',
            width: '50%',
            reference: 'shipmentName',
            allowBlank: false,
            labelAlign: 'left',
            labelWidth: 150,
            bind:{
                value:'{parentShipmentName}'
            }
        }, {
            xtype: 'button',
            text: 'Find Shipment Id(s)',
            handler: 'fetchShipmentId',
            formBind: true,
            margin: '5px 0 0 20px'
        }]
    }, {
        xtype: 'panel',
        layout: 'border',
        height: 600,
        width: '100%',
        items: [{
            xtype: 'grid',
            width: '20%',
            height: '100%',
            region: 'west',
            reference: 'shipmentidGrid',
            forceFit: true,
            viewConfig: {
                enableTextSelection: true,
                emptyText: '<span class="emptytext">No data found</span>',
                textAlight: 'center'
            },
            selModel: {
                selType: 'checkboxmodel'
            },
            bind: {
                store: '{shipmentidGridStore}'
            },
            columns: [{
                text: 'Shipment ID',
                dataIndex: 'shipmentId',
                width: 200
            }, {
                text: 'Status',
                dataIndex: 'status',
                width: 200,
                renderer: function (value, metaData, record) {
                    if (value == "WORKING") {
                        metaData.style = "background-color:#ff0000;";
                    }
                    return value
                }
            }],
            buttonAlign: 'center',
            buttons: [{
                text: 'Get Shipment Detail',
                handler: 'getShipmentsDetails',
            }],
            listeners: {
                beforeselect: function (model, record, index, eOpts) {
                    if (record.get('status') == "WORKING") {
                        return false;
                    }
                }
            }
        }, {
            xtype: 'grid',
            width: '80%',
            height: '100%',
            region: 'center',
            forceFit: true,
            reference: 'shipmentCompareGrid',
            viewConfig: {
                enableTextSelection: true,
                emptyText: '<span class="emptytext">No data found</span>',
                textAlight: 'center'
            },
            bind: {
                store: '{shipmentidCompareGridStore}'
            },
            columns: [{
                text: 'Shipment ID',
                dataIndex: 'shipmentid',
                width: 200
            }, {
                text: 'SKU',
                dataIndex: 'sku'
            }, {
                xtype: 'numbercolumn',
                text: 'Actual Virtual Sent Qty',
                dataIndex: 'sent',
                format: '0'
            }, {
                xtype: 'numbercolumn',
                text: 'Virtual Sent Qty',
                dataIndex: 'total_ordered',
                format: '0'
            }, {
                xtype: 'numbercolumn',
                text: 'Shipped Qty',
                dataIndex: 'shippedQty',
                format: '0'
            }, {
                xtype: 'numbercolumn',
                text: 'Difference(Virtual-Shipped)',
                dataIndex: 'diff',
                format: '0'
            }],
            buttonAlign: 'center',
            buttons: [{
                text: 'Confirm Shipments',
                handler: 'confirmShipments',
                btnAction: 'confirmShipments',
                bind: {
                    hidden: '{!confirmShipments}'
                }
            }, {
                text: 'Confirm Finalize Shipments',
                handler: 'confirmShipments',
                btnAction: 'confirmFinalizeShipments',
                bind: {
                    hidden: '{confirmShipments}'
                }
            }]
        }]

    }]

});
