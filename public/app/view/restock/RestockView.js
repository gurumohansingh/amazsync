
Ext.define('AmazSync.view.restock.RestockView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.restockView',
    requires: [
        'AmazSync.view.restock.RestockViewController',
        'AmazSync.view.restock.RestockViewModel'
    ],

    controller: 'restock-restockview',
    viewModel: {
        type: 'restock-restockview'
    },
    width: '100%',
    height: '100%',
    layout: 'border',
    items: [{
        xtype: 'panel',
        width: '100%',
        region: 'north',
        scrollable: true,
        layout: { type: 'hbox', pack: 'center' },
        items: [{
            xtype: 'combo',
            fieldLabel: 'Restock AMZ',
            displayField: 'name',
            valueField: 'value',
            queryMode: 'local',
            labelAlign: 'left',
            margin: '15px 0 0 0',
            value: 'US',
            reference: 'marketPlace',
            store: {
                data: [{ name: 'USA', value: 'US' }, { name: 'Canada', value: 'CA' }]
            },
            listeners: {
                change: 'applyFilter'
            },
        }, {
            xtype: 'combo',
            fieldLabel: 'Warehouse',
            name: 'warehouse',
            displayField: 'name',
            valueField: 'id',
            forceSelection: true,
            labelAlign: 'left',
            allowBlank: true,
            labelWidth: 100,
            margin: '15px 10px 0 10px',
            store: 'warehouseStore',
            reference: 'warehouse',

            bind: {
                value: '{defaultWarehouse}'
            },
            listeners: {
                change: 'applyFilter',
                afterRender: 'setRecentWarehouse'
            },
            triggers: {
                clear: {
                    cls: 'x-form-clear-trigger',
                    handler: 'fetchDataWithoutWareHouse'
                }
            },
        }, {
            xtype: 'textfield',
            fieldLabel: 'Search By',
            labelAlign: 'left',
            name: 'sreachBy',
            emptyText: 'Search by Name, SKU, ASIN',
            reference: 'searchFilter',
            margin: '15px 10px 0 10px',
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
            title: 'Recommended Ship Date',
            items: [{
                xtype: 'radiogroup',
                labelAlign: 'left',
                reference: 'recommendedShipDateOption',
                defaults: {
                    name: 'recommendedShipDate',
                    margin: '0 0 0 10px',
                },
                listeners: {
                    change: 'applyFilter'
                },
                items: [
                    {
                        boxLabel: 'All',
                        inputValue: 'All',
                        width: 50,
                        checked: true
                    },
                    {
                        boxLabel: 'Today',
                        inputValue: 'today',
                        width: 70
                    },
                    {
                        boxLabel: 'Next 7 Days',
                        inputValue: 'next7',
                        width: 115
                    },
                    {
                        boxLabel: 'Next 14 Days',
                        inputValue: 'next14',
                        width: 115
                    },
                    {
                        boxLabel: 'Next 30 Days',
                        inputValue: 'next30',
                        width: 115
                    }
                ]
            }]
        }, {
            xtype: 'fieldset',
            title: 'Stock at Current Warehouse',
            margin: '0 0 0 10px',
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
                    { boxLabel: 'IN Stock', name: 'stock', inputValue: '1', width: 80, checked: true },
                    { boxLabel: 'Out of Stock', name: 'stock', inputValue: '2', width: 110 },
                    { boxLabel: 'ALL', name: 'stock', inputValue: '3', width: 40 }

                ]
            }]
        }]
    }, {
        xtype: 'restockGrid',
        region: 'center',
    }]

});
