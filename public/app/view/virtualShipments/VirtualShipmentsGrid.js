
Ext.define('AmazSync.view.virtualShipments.VirtualShipmentsGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.virtualShipmentsGrid',

    viewConfig: {
        emptyText: 'No No shipment found.',
    },
    forceFit: true,
    titleAlign: 'center',
    bind: {
        store: '{virtualShipmentStore}'
    },
    tools: [{
        xtype: 'textfield',
        fieldLabel: 'Shipment Name',
        labelWidth: 150,
        width: 400,
        labelAlign: 'left',
        allowBlank: false,
        bind: {
            value: '{shipmentName}'
        }

    }, {
        xtype: 'button',
        text: 'Submit',
        formBind: true,
        handler: 'addVirtualshipments'
    }],
    columns: [{
        text: 'SKU',
        dataIndex: 'amz_sku'
    }, {
        text: 'QTY',
        dataIndex: 'qty_to_send_amz'
    }, {
        text: 'CASE',
        dataIndex: 'casePackQuantity'
    }]
});
