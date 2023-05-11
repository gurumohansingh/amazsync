
Ext.define('AmazSync.view.purchaseOrders.detail.PurchaseOrderDetail', {
    extend: 'Ext.grid.Panel',

    requires: [
        'AmazSync.view.purchaseOrders.detail.PurchaseOrderDetailController',
        'AmazSync.view.purchaseOrders.detail.PurchaseOrderDetailModel',
        'AmazSync.view.purchaseOrders.amazonShipment.AmazonShipmentView'
    ],

    controller: 'purchaseorders-detail-purchaseorderdetail',
    viewModel: {
        type: 'purchaseorders-detail-purchaseorderdetail'
    },
    tbar: [{
        xtype: 'tbfill'
    }, {
        xtype: 'button',
        text: 'Delete Virtual Shipments',
        formBind: true,
        handler: 'deleteVirtualshipment',
        cls: 'btnborder',
        bind:{
            hidden:'{hiddenButtons}'
        }
    }, {
        xtype: 'button',
        text: 'Optimize Case Pack Quantity',
        formBind: true,
        handler: 'optimizeVirtualshipments',
        cls: 'btnborder',
        bind:{
            hidden:'{hiddenButtons}'
        }
    }, {
        xtype: 'button',
        text: 'Generate 2dWorkflow Draft Shipment',
        formBind: true,
        handler: 'generateWorkFlow',
        cls: 'btnborder',
        bind:{
            hidden:'{hiddenButtons}'
        }
    }, {
        xtype: 'button',
        text: 'Sync Shipment with Amazon',
        formBind: true,
        handler: 'syncShipmentwithAmazon',
        cls: 'btnborder',
        bind:{
            hidden:'{hiddenButtons}'
        }
    }, {
        xtype: 'button',
        text: 'Finalize Amazon Shipment',
        formBind: true,
        handler: 'finalizeAmazonShipment',
        cls: 'btnborder',
        bind:{
            hidden:'{hiddenButtons}'
        }
    }, {
        xtype: 'tbfill'
    }],
    store: Ext.create('Ext.data.Store', {
        listeners: {
            load: 'updateView'
        }
    }),
    listeners: {
        sortchange: 'updateView',
    },
    forceFit: true,
    viewConfig: {
        enableTextSelection: true,
        emptyText: '<span class="emptytext">No data found</span>',
        textAlight: 'center'
    },
    columns: [{
        text: 'Image',
        xtype: 'templatecolumn',
        align: 'center',
        width: 100,
        locked: true,
        tpl: `<img src="{image}" alt="No" style="height:50px;width:50px"/>`
    }, {
        text: 'Name',
        dataIndex: 'title',
        width: 200,
        locked: true
    }, {
        text: 'Variant ID',
        dataIndex: 'id',
        width: 300,
        locked: true,
        hidden: true,
        tdCls: 'fontcolorAmz'
    }, {
        text: 'Title',
        dataIndex: 'title',
        width: 200,
        locked: true
    }, {
        text: 'SKU',
        dataIndex: 'sku',
        width: 350,
    }, {
        text: 'Vendor Reference',
        dataIndex: 'vendor_reference',
        width: 150,
    }, {
        text: 'Vendor Product Name',
        dataIndex: 'vendor_product_name'
    }, {
        text: 'Barcode',
        dataIndex: 'barcode',
        width: 200,
    }, {
        text: 'FNSKU',
        dataIndex: 'fnsku',
        width: 150,
    }, {
        text: 'ASIN',
        dataIndex: 'asin',
        width: 150,
    }, {
        text: 'MOQ',
        dataIndex: 'moq',
        width: 150,
    }, {
        xtype: 'numbercolumn',
        text: 'Case Pack Quantity',
        dataIndex: 'casePackQuantity',
        width: 150,
        format: '0'
    }, {
        xtype: 'numbercolumn',
        text: 'Actual Qty Sent',
        dataIndex: 'sent',
        width: 200,
        format: '0'
    }, {
        xtype: 'numbercolumn',
        text: 'Qty To Send',
        dataIndex: 'total_ordered',
        format: '0'

    }, {
        text: 'UOM',
        dataIndex: 'umo',
        width: 150,
    }, {
        text: 'UMO Cases',
        dataIndex: 'umo_class',
        width: 150,
    }, {
        text: 'Sent History',
        dataIndex: 'sent_history',
        width: 150,
        renderer: function (value) {
            if (value) {
                return `${Ext.util.Format.date(new Date(value[0].date * 1000), 'd M, Y g: i a')}  ${value[0].value}`
            }
        }

    }, {
        text: 'Category',
        dataIndex: 'product_type',
        width: 150,

    }, {
        text: 'Received',
        dataIndex: 'received',
        width: 150,
    }, {
        text: 'Received History',
        dataIndex: 'received_history',
        width: 150,
        renderer: function (value) {
            if (value) {
                return `${Ext.util.Format.date(new Date(value[0].date * 1000), 'd M, Y g: i a')}  ${value[0].value}`
            }

        }

    }, {
        text: 'Remaining',
        dataIndex: 'received_date',
        width: 150,
        //todo
    }, {
        text: 'To Receive',
        dataIndex: 'shipping_handling'
        //todo
    }, {
        text: 'Total CBM',
        dataIndex: 'email_sent'
        //todo
    }, {
        text: 'New Weight',
        dataIndex: 'weight'
        //todo
    }, {
        text: 'Gross Weight',
        dataIndex: 'weight',
        width: 150,
        //todo
    }, {
        text: 'Unit Price',
        dataIndex: 'cost_price'
    }, {
        text: 'Retail Price',
        dataIndex: 'price'
    }, {
        text: 'Ordered Retail Price',
        dataIndex: 'price',
        renderer: function (value, meta, record) {
            if (value) {
                return `$ ${value * record.get('replenishment')}`
            }
        }
    }, {
        text: 'Ordered Unit Cost',
        dataIndex: 'cost_price',
        renderer: function (value, meta, record) {
            if (value) {
                return `$ ${value * record.get('replenishment')}`
            }
        }
    }, {
        text: 'Received Unit Cost',
        dataIndex: 'total_sent'
    }, {
        text: 'Remaining Unit Cost',
        dataIndex: 'total_remaining'
    },
    {
        text: 'Discount',
        dataIndex: 'notes',
        width: 120,
    }, {

        text: 'Total Excl Tax',
        dataIndex: 'last_modified',
        width: 150,
    }, {
        text: 'Tax',
        dataIndex: 'replenishment_type',
        width: 150,
    }, {
        text: 'Total',
        dataIndex: 'import'
    }, {
        text: 'Manually Changed',
        dataIndex: ''
    }, {
        text: 'Changed due to MOQ',
        dataIndex: 'automation_reference'
    }, {
        text: 'Changed due to UOM',
        dataIndex: 'source_of_creation',
        width: 220,
    }, {
        text: 'Less than MOQ',
        dataIndex: 'removed'
    }, {
        text: 'Not a multiple of UOM',
        dataIndex: 'removed'
    }, {
        text: 'Non-existing',
        dataIndex: 'removed'
    }, {
        text: 'Has listing for connection',
        dataIndex: 'removed'
    }
    ]
});
