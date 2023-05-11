
Ext.define('AmazSync.view.purchaseOrders.list.PurchaseOrdersGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'purchaseOrdersGrid',
    requires: [
        'AmazSync.view.purchaseOrders.list.PurchaseOrdersGridController',
        'AmazSync.view.purchaseOrders.list.PurchaseOrdersGridModel'
    ],

    controller: 'purchaseorders-list-purchaseordersgrid',
    viewModel: {
        type: 'purchaseorders-list-purchaseordersgrid'
    },
    store: 'purchaseOrderStore',
    selModel: {
        selType: 'checkboxmodel'
    },
    //cls: 'productlistgrid',
    viewConfig: {
        enableTextSelection: true
    },
    titlePosition: 4,
    plugins: 'gridfilters',
    tools: [{
        iconCls: 'x-fa fa-sync fontcolorgreen',
        tooltip: 'Refresh',
        title: 'Sync',
        hidden: true,
        handler: 'syncInventoryPlaner',
        margin: '0 0 0 20px',
    }, {
        iconCls: 'x-fa fa-sync fontcolorgreen',
        tooltip: 'Reload',
        title: 'Reload from server',
        handler: 'reload',
        margin: '0 0 0 20px',
    }, {
        xtype: 'radiogroup',
        listeners: {
            change: 'loadShipments'
        },
        items: [
            { boxLabel: 'Live Shipments', name: 'rb', inputValue: 0, checked: true },
            { boxLabel: 'Active Virtual Shipments', name: 'rb', inputValue: 1 },
            { boxLabel: 'In Active Virtual Shipments', name: 'rb', inputValue: 2},
        ]
    }, {
        xtype: "textfield",
        emptyText: 'Search By ShipmentId, Name',
        width: 400,
        enableKeyEvents: true,
        triggers: {
            clear: {
                cls: 'x-form-clear-trigger',
                handler: function () {
                    this.reset();
                }
            }
        },
        listeners: {
            change: 'applyFilter'
        }

    }],
    listeners: {
        sortchange: 'updateView',
        cellclick: 'getPOGetails',
        openSingleShipmentDetail: 'openSingleShipmentDetail'
    },
    columns: [{
        text: 'Shipment Name',
        dataIndex: 'reference',
        width: 300,
        locked: true,
        tdCls: 'fontcolorAmz',
        filter: {
            type: 'string',
        }
    }, {
        text: 'Shipment ID',
        dataIndex: 'remoteId',
        width: 200,
        locked: true,
        filter: {
            type: 'string',
        }
    }, {
        text: 'Details',
        dataIndex: 'details',
        width: 350,
        locked: true,
        renderer: function (value, metaData, record, rowIndex) {
            if (Ext.isEmpty(value)) {
                return "";
            }
            var items = "";
            var data = JSON.parse(value);
            data.forEach(element => {
                var cls = "detail-open-working";
                if (element['data']) {
                    if (element['data'].toLowerCase().includes('closed')) {
                        var cls = "detail-closed";
                    }
                    if (element['data'].toLowerCase().includes('deleted') || element['data'].toLowerCase().includes('cancelled')) {
                        var cls = "detail-cancelled";
                    }
                    if (element['data'].toLowerCase().includes('receiving') || element['data'].toLowerCase().includes('past')) {
                        var cls = "detail-receiving-pastdue";
                    }
                    if (element['data']) {
                        if (element['data'] == 'Amazon') {
                            items += `<a href="${element['link']}" class='m-badge detail-amazon' target="_blank">${element['data']}</a>`;
                        }
                        else {
                            items += `<span class='m-badge ${cls}'>${element['data']}</span>`;
                        }

                    }
                }
            });
            return items;
        }
    }, {
        text: 'Status',
        dataIndex: 'status',
        width: 150,
        locked: true,
        filter: {
            type: 'string',
        }
    }, {
        text: 'Has Non-Existing',
        dataIndex: 'Vendor'
    }, {
        text: 'Vendor',
        dataIndex: 'vendor',
        width: 200,
    }, {
        text: 'Source Warehouse',
        dataIndex: 'source_warehouse_display_name',
        width: 150,
        filter: {
            type: 'string',
        }
    }, {
        text: 'From',
        dataIndex: 'source',
        width: 150,
    }, {
        text: 'Destination Warehouse',
        dataIndex: 'warehouse_display_name',
        width: 150,
        filter: {
            type: 'string',
        }
    }, {
        text: 'Received/Ordered',
        dataIndex: 'total_ordered',
        renderer: function (value, metaData, record) {
            return `${record.get('total_received') ? record.get('total_received') : 0}/${value ? value : 0} `
        }
    }, {
        text: 'Currency',
        dataIndex: 'currency',
        width: 150,
    }, {
        xtype: 'datecolumn',
        text: 'Sent Date',
        dataIndex: 'sent_date',
        width: 150,
        renderer: function (value) {
            if (Date.parse(value)) {
                return Ext.util.Format.date(value, 'M d,Y');
            }
        }
    }, {
        xtype: 'datecolumn',
        text: 'Created Date',
        dataIndex: 'created_date',
        width: 200,
        renderer: function (value) {
            if (Date.parse(value)) {
                return Ext.util.Format.date(value, 'M d,Y');
            }
        }
    }, {
        text: 'Created By',
        dataIndex: 'created_by',
        width: 150
    }, {
        xtype: 'datecolumn',
        text: 'Expected Date',
        dataIndex: 'expected_date',
        width: 150,
        renderer: function (value) {
            if (Date.parse(value)) {
                return Ext.util.Format.date(value, 'M d,Y');
            }
        }
    }, {
        xtype: 'datecolumn',
        text: 'Payment Date',
        dataIndex: 'payment_date',
        width: 150,
        filter: {
            type: 'date',
        },
        renderer: function (value) {
            if (Date.parse(value)) {
                return Ext.util.Format.date(value, 'M d,Y');
            }
        }
    }, {
        xtype: 'datecolumn',
        text: 'Shipment Date',
        dataIndex: 'shipment_date',
        filter: {
            type: 'date',
        },
        width: 150,
        renderer: function (value) {
            if (Date.parse(value)) {
                return Ext.util.Format.date(value, 'M d,Y');
            }
        }
    }, {
        xtype: 'datecolumn',
        text: 'Received Date',
        dataIndex: 'received_date',
        width: 150,
        filter: {
            type: 'date',
        },
        renderer: function (value) {
            if (Date.parse(value)) {
                return Ext.util.Format.date(value, 'M d,Y');
            }
        }
    }, {
        text: 'Shipping & Handling',
        dataIndex: 'shipping_handling'
    }, {
        text: 'Email Sent',
        dataIndex: 'email_sent'
    }, {
        text: 'Shipment Method',
        dataIndex: 'shipment_method'
    }, {
        text: 'Payment Terms',
        dataIndex: 'payment_terms',
        width: 150,
    }, {
        text: 'Subtotal',
        dataIndex: 'full_total'
    }, {
        text: 'Total',
        dataIndex: 'total'
    }, {
        text: 'Total Ordered',
        dataIndex: 'total_ordered'
    }, {
        text: 'Total Received',
        dataIndex: 'total_received'
    }, {
        text: 'Total Sent',
        dataIndex: 'total_sent'
    }, {
        text: 'Total Remaining',
        dataIndex: 'total_remaining'
    },
    {
        text: 'Notes',
        dataIndex: 'notes',
        width: 120,
    }, {
        xtype: 'datecolumn',
        text: 'Last Modified',
        dataIndex: 'last_modified',
        width: 150,
        renderer: function (value) {
            if (Date.parse(value)) {
                return Ext.util.Format.date(value, 'M d,Y h:i a');
            }
        }
    }, {
        text: 'Replenish Type',
        dataIndex: 'replenishment_type',
        width: 150,
    }, {
        text: 'Import',
        dataIndex: 'import'
    }, {
        text: 'Stock Orders Batch',
        dataIndex: ''
    }, {
        text: 'Automation Reference',
        dataIndex: 'automation_reference'
    }, {
        text: 'Source',
        dataIndex: 'source_of_creation',
        width: 220,
    }, {
        text: 'Removed',
        dataIndex: 'removed'
    }
    ]
});
