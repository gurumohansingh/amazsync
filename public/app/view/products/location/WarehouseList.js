
Ext.define('AmazSync.view.products.location.WarehouseList', {
    extend: 'Ext.panel.Panel',
    xtype: 'warehouseList',
    layout: 'hbox',
    title: 'Warehouse',
    margin: 10,
    height: '100%',
    items: [{
        xtype: 'grid',
        margin: 10,
        flex: 3,
        forceFit: true,
        title: 'All Warehouses',
        store: 'warehouseStore',
        scrollable: true,
        height: '100%',
        viewConfig: {
            enableTextSelection: true,
            emptyText: '<span class="emptytext">No warehouse found</span>',
            textAlight: 'center'
        },
        listeners: {
            rowclick: 'getBinLocation'
        },
        columns: [{
            text: 'Name',
            dataIndex: 'name'
        },
        {
            text: 'Address',
            dataIndex: 'address'
        }, {
            text: 'Description',
            dataIndex: 'description'
        }, {
            xtype: "actioncolumn",
            align: "center",
            text: 'Edit',
            width: 100,
            bind: {
                hidden: '{roleLocationsWarehouseEdit}'
            },
            items: [
                {
                    tooltip: 'Edit warehouse',
                    iconCls: 'x-fa fa-edit fontmustard',
                    handler: 'editWarehouse'
                }
            ]
        }, {
            xtype: "actioncolumn",
            align: "center",
            text: 'Delete',
            width: 100,
            bind: {
                hidden: '{roleLocationsWarehouseDelete}'
            },
            items: [
                {
                    tooltip: 'Remove warehouse',
                    iconCls: 'x-fa fa-trash fontcolorred',
                    handler: 'removeWarehouse'
                },
            ]
        }]
    }, {
        xtype: 'form',
        layout: 'vbox',
        reference: 'warehouseForm',
        margin: 10,
        flex: 2,
        title: 'Add/Update warehouse',
        buttonAlign: 'center',
        defaults: {
            xtype: 'textfield',
        },
        items: [{
            xtype: 'hiddenfield',
            name: 'id'
        }, {
            fieldLabel: 'Name',
            allowBlank: false,
            name: 'name'
        }, {
            fieldLabel: 'Address',
            name: 'address'
        }, {
            fieldLabel: 'Description',
            name: 'description'
        }],
        buttons: [{
            text: 'Add New',
            formBind: true,
            handler: 'submitWarehouse',
            bind: {
                hidden: '{roleLocationsWarehouseAdd}'
            }
        }, {
            text: 'Update',
            formBind: true,
            handler: 'updateWarehouse',
            bind: {
                hidden: '{roleLocationsWarehouseAdd}'
            }
        }]
    }]

});
