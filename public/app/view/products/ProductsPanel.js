
Ext.define('AmazSync.view.products.ProductsPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'productsPanel',
    requires: [
        'AmazSync.view.products.ProductsPanelController',
        'AmazSync.view.products.ProductsPanelModel',
        'AmazSync.view.products.productList.suppliers.SupplierList',
        'AmazSync.view.products.productList.productList',
        'AmazSync.view.products.productList.suppliers.SupplierList',
    ],

    controller: 'products-productspanel',
    viewModel: {
        type: 'products-productspanel'
    },
    layout: 'border',
    bind: {
        hidden: '{roleProductView}'
    },
    items: [{
        xtype: 'form',
        region: 'north',
        layout: 'hbox',
        scrollable: true,
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Search By',
            width: '30%',
            minWidth: 300,
            labelAlign: 'left',
            name: 'sreachBy',
            emptyText: 'Search by Name, SKU, ASIN',
            reference: 'searchByTextFilter',
            bind: {
                value: '{searchFilter}'
            },
            triggers: {
                clear: {
                    cls: 'x-form-clear-trigger',
                    handler: function () {
                        this.setValue(null);
                    }
                }
            },
            listeners: {
                change: {
                    fn: 'applyFilter',
                    buffer: 1000,
                }

            }
        }, {
            xtype: 'fieldset',
            margin: '4px 0 4px 0',
            width: 'auto',
            layout: 'center',
            items: [{
                xtype: 'radiogroup',
                labelAlign: 'left',
                fieldLabel: 'Status',
                reference: 'statusFilter',
                labelWidth: 50,
                defaults: {
                    name: 'status',
                    margin: '0 0 0 10px',
                },
                bind: {
                    value: '{statusFilter}'
                },
                listeners: {
                    change: 'applyFilter'
                },
                items: [
                    {
                        boxLabel: 'All',
                        inputValue: 'All',
                        width: 80
                        //checked: true
                    },
                    {
                        boxLabel: 'Active',
                        inputValue: 'Active',
                        width: 80
                    },
                    {
                        boxLabel: 'Inactive',
                        inputValue: 'Inactive',
                        width: 80
                    },
                    {
                        boxLabel: ' Incomplete',
                        inputValue: 'Incomplete',
                        width: 90
                    }
                ]
            }]
        }, {
            xtype: 'fieldset',
            margin: '4px 0 4px 10px',
            width: 'auto',
            layout: 'center',
            items: [{
                xtype: 'radiogroup',
                labelAlign: 'left',
                fieldLabel: 'Inventory Type',
                labelWidth: 120,
                reference:'inventoryTypeFilter',
                defaults: {
                    name: 'liveonamazon',
                    margin: '0 0 0 10px',
                },
                bind: {
                    value: '{livestatusFilter}'
                },
                listeners: {
                    change: 'applyFilter'
                },
                items: [
                    {
                        boxLabel: 'All',
                        inputValue: 2,
                        width: 50
                        //checked: true
                    },
                    {
                        boxLabel: 'Only Amazon',
                        inputValue: 1,
                        width: 120
                    },
                    {
                        boxLabel: 'Only Local',
                        inputValue: 0,
                        width: 120
                    }
                ]
            }]
        }
        ]
    }, {
        xtype: 'productList',
        region: 'center',
        width: '100%',
    }, {
        xtype: 'supplierList',
        region: 'east',
        width: 300,
        split: true,
        collapsible: true,
        collapsed: true,
        collapseDirection: 'right',
        reference: 'supplierList'
    }
    ]
});
