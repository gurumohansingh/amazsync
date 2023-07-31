
Ext.define('AmazSync.view.suppliers.result.SuppliersGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.filters.Filters'
    ],

    xtype: 'suppliersGrid',
    cls: 'productlistgrid',
    reference: 'productList',
    bind: {
        store: '{suppierStore}'
    },
    plugins: 'gridfilters',
    titlePosition: 3,
    padding: 5,
    rowLines: false,
    bbar: {        
        xtype: 'pagingtoolbar',
        displayInfo: true,        
    },
    //forceFit: true,
    tools: [{
        iconCls: 'x-fa fa-sync fontcolorgreen',
        tooltip: 'Refresh',
        title: 'Sync',
        handler: 'syncSupplier',
        margin: '0 0 0 10px'
    },
    {
        iconCls: 'x-fa fa-plus fontmustard',
        tooltip: 'Add New Supplier',
        margin: '0 0 0 10px',
        handler: 'addNewSupplier',
        bind: {
            hidden: '{roleSuppliersAddNew}'
        },

    }, {
        xtype: 'textfield',
        emptyText: 'Search',
        listeners: {
            change: {
                fn:'applySearch',
                buffer:750
            }
        },
        triggers: {
            clear: {
                cls: 'x-form-clear-trigger',
                handler: function () {
                    this.setValue(null);
                }
            }
        },
    }],

    viewConfig: {
        enableTextSelection: true,
        emptyText: '<span class="emptytext">No Suppliers found</span>',
        textAlight: 'center'
    },
    columns: {
        defaults: {
            align: 'left',
            width: 100
        },
        items: [{
            xtype: "actioncolumn",
            align: "center",
            text: 'Action',
            width: 50,
            bind: {
                hidden: '{roleSuppliersEdit}'
            },
            items: [
                {
                    tooltip: 'Edit Suppliers',
                    iconCls: 'x-fa fa-edit fontmustard',
                    handler: 'editSupplier',
                    tooltip: 'Edit Suppliers'
                }
            ]
        }, {
            xtype: "actioncolumn",
            align: "center",
            text: 'Action',
            width: 50,
            bind: {
                hidden: '{roleSuppliersDelete}'
            },
            items: [
                {
                    tooltip: 'Remove Suppliers',
                    iconCls: 'x-fa fa-trash fontcolorred',
                    handler: 'removeSupplier',
                    tooltip: 'Remove Suppliers'
                },
            ]
        }, {
            text: 'Supplier Name',
            tooltip: 'Supplier Name',
            dataIndex: 'supplierName',
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Address',
            tooltip: 'Address',
            dataIndex: 'address',
            width: 200,
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Address2',
            tooltip: 'Address2',
            dataIndex: 'address2',
            width: 200,
            filter: {
                type: 'string'
            }
        },
        {
            text: 'City',
            tooltip: 'City',
            dataIndex: 'city',
            filter: {
                type: 'string'
            }
        },
        {
            text: 'State',
            tooltip: 'State',
            dataIndex: 'state',
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Country',
            tooltip: 'Country',
            dataIndex: 'country',
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Zip Code',
            tooltip: 'Zip Code',
            dataIndex: 'zipCode',
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Phone',
            tooltip: 'Phone',
            dataIndex: 'phone',
            filter: {
                type: 'string'
            }
        }, {
            text: 'Contact Name',
            tooltip: 'Contact Name',
            dataIndex: 'contactName',
            filter: {
                type: 'string'
            }
        }, {
            text: 'Contact Email',
            tooltip: 'Contact Email',
            dataIndex: 'contactEmail',
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Default Lead Time In Days',
            tooltip: 'Default Lead Time In Days',
            dataIndex: 'DefaultLeadTimeInDays',
            filter: {
                type: 'number'
            }
        }, {
            text: 'Free Freight Min',
            tooltip: 'Free Freight Min',
            dataIndex: 'freeFreightMin',
            filter: {
                type: 'string'
            }
        }, {
            text: 'Min Purchase Budget',
            tooltip: 'Min Purchase Budget',
            dataIndex: 'minPurchaseBudget',
            filter: {
                type: 'string'
            }
        }, {
            text: 'Payment Terms',
            tooltip: 'Payment Terms',
            dataIndex: 'paymentTerms',
            filter: {
                type: 'string'
            }
        }, {
            text: 'PO Notes',
            tooltip: 'PO Notes',
            dataIndex: 'PONotes',
            filter: {
                type: 'string'
            }
        }, {
            text: 'Default Currency',
            tooltip: 'Default Currency',
            dataIndex: 'defaultCurrency',
            filter: {
                type: 'string'
            }
        }, {
            text: 'Internal Notes',
            tooltip: 'Internal Notes',
            dataIndex: 'internalNotes',
            filter: {
                type: 'string'
            }
        }, {
            text: 'Shipment Method',
            tooltip: 'Shipment Method',
            dataIndex: 'shipmentMethod',
            filter: {
                type: 'string'
            }
        }, {
            text: 'Default Tax',
            dataIndex: 'defaultTax',
            tooltip: 'Default Tax',
            filter: {
                type: 'string'
            }
        }, {
            text: 'Default Target Days in Warehouse',
            tooltip: 'Default Target Days in Warehouse',
            dataIndex: 'defaultTargetDaysInWarehouse',

        }, {
            text: 'Default Target Days In Amazon',
            tooltip: 'Default Target Days In Amazon',
            dataIndex: 'defaultTargetDaysInAmazon',

        }, {
            text: 'Exclusive Agreement',
            tooltip: 'Exclusive Agreement',
            dataIndex: 'exclusiveAgreement',
        }, {
            text: 'Restock Model',
            tooltip: 'Restock Model',
            dataIndex: 'restockModel'
        }, {
            text: 'Time Stamp',
            tooltip: 'Time Stamp',
            dataIndex: 'timestamp',
            filter: {
                type: 'date'
            }
        }]
    }
});