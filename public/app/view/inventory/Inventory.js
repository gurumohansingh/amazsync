
Ext.define('AmazSync.view.inventory.Inventory', {
    extend: 'Ext.form.Panel',
    xtype: 'inventory',
    requires: [
        'AmazSync.view.inventory.InventoryController',
        'AmazSync.view.inventory.InventoryModel',
        'AmazSync.view.inventory.list.InventoryList'
    ],

    controller: 'inventory-inventory',
    viewModel: {
        type: 'inventory-inventory'
    },
    layout: 'border',
    items: [
        {
            xtype: 'container',
            layout: { type: 'hbox', pack: 'center' },
            region: 'north',
            scrollable: true,
            items: [{
                xtype: 'combo',
                fieldLabel: 'Warehouse',
                name: 'warehouse',
                displayField: 'name',
                valueField: 'id',
                forceSelection: true,
                labelAlign: 'left',
                allowBlank: false,
                labelWidth: 100,
                store: 'warehouseStore',
                reference: 'warehouse',
                bind: {
                    value: '{defaultWarehouse}'
                },
                listeners: {
                    change: 'updateWareHouse'
                }
            }, {
                xtype: "textfield",
                emptyText: 'Search By SKU, Name, ASIN',
                width: 300,
                name: 'inventorySearchBox',
                reference: 'searchFilter',
                bind: {
                    value: '{searchFilter}'
                },
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: function () {
                            this.reset();
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
                margin: '2px 0 0 0',
                layout: 'center',
                items: [{
                    xtype: 'radiogroup',
                    columns: 3,
                    reference: 'stockFilter',
                    listeners: {
                        change: 'applyFilter'
                    },
                    bind: {
                        value: '{stockFilter}'
                    },
                    items: [
                        { boxLabel: 'ALL', name: 'stock', inputValue: '3', width: 40 },
                        { boxLabel: 'IN Stock', name: 'stock', inputValue: '1', width: 80, checked: true },
                        { boxLabel: 'Out of Stock', name: 'stock', inputValue: '2', width: 110 }

                    ]
                }]
            }, {
                xtype: 'fieldset',
                margin: '2px 0 0 10px',
                layout: 'center',
                items: [{
                    xtype: 'radiogroup',
                    columns: 3,
                    reference: 'locationFilter',
                    listeners: {
                        change: 'applyFilter'
                    },
                    bind: {
                        value: '{locationFilter}'
                    },
                    items: [
                        { boxLabel: 'All', name: 'location', inputValue: '3', width: 40 },
                        { boxLabel: 'Location', name: 'location', inputValue: '1', width: 80, checked: true },
                        { boxLabel: 'No Location', name: 'location', inputValue: '2', width: 110 }

                    ]
                }]
            }]
        }, {
            xtype: 'inventoryList',
            region: 'center',
            margin: '10px 0 0 0'
        }
    ]
});
