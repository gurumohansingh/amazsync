
Ext.define('AmazSync.view.importer.ImporterType', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.importerType',
    layout: 'center',
    items: [{
        xtype: 'container',
        border: true,
        cls: 'formborder round',
        layout: 'vbox',
        padding: 50,
        items: [{
            xtype: 'combo',
            fieldLabel: 'Select Import Type',
            displayField: 'name',
            valueField: 'type',
            forceSelection: true,
            width: 600,
            margin: '0 0 20px 0',
            allowBlank: false,
            bind: {
                value: '{importType}'
            },
            listeners: {
                change: 'loadColumns'
            },
            store: {
                data: [{
                    type: "products", name: "Import Products"
                }, {
                    type: "inventorystock", name: "Import Inventory"
                }, {
                    type: "suppliersList", name: "Import Suppliers"
                }, {
                    type: "suppliers", name: "Import Supplier SKU Details"
                }]
            }
        }, {
            xtype: 'combo',
            fieldLabel: 'Warehouse',
            name: 'warehouse',
            displayField: 'name',
            valueField: 'id',
            forceSelection: true,
            labelAlign: 'left',
            allowBlank: false,
            labelWidth: 100,
            margin: '0 0 20px 0',
            store: 'warehouseStore',
            reference: 'warehouse',
            bind: {
                value: '{wareHouseId}',
                hidden: '{wareHouse}'
            }
        }, {
            xtype: 'checkbox',
            labelAlign: 'left',
            fieldLabel: 'Do you want to add missing location?',
            boxLabel: 'Yes',
            name: 'missingLocation',
            labelWidth: 280,
            width: 600,
            margin: '0 0 20px 0',
            bind: {
                value: '{missingLocation}',
                hidden: '{wareHouse}'
            }
        }, {
            xtype: 'checkbox',
            labelAlign: 'left',
            fieldLabel: 'Do you want to replace Inventory stock?',
            boxLabel: 'Yes',
            name: 'replaceStock',
            labelWidth: 280,
            width: 600,
            margin: '0 0 20px 0',
            bind: {
                value: '{replaceStock}',
                hidden: '{wareHouse}'
            }
        }, {
            xtype: 'component',
            labelAlign: 'left',
            html: 'Note:If you select yes then the stock will be replace with import csv. Otherwise, stock will be add/substract from existing stock. Please add substract(-10) in CSV',
            labelWidth: 280,
            width: 600,
            margin: '0 0 20px 0',
            bind: {
                hidden: '{wareHouse}'
            }
        }, {
            xtype: 'checkbox',
            labelAlign: 'left',
            fieldLabel: 'Do you want to add missing supplier?',
            boxLabel: 'Yes',
            name: 'addMissingSuppliers',
            labelWidth: 280,
            width: 600,
            margin: '0 0 20px 0',
            bind: {
                value: '{addMissingSuppliersValue}',
                hidden: '{addMissingSuppliers}'
            }
        }, {
            xtype: 'component',
            labelAlign: 'left',
            html: 'Note: Missing suppliers sku will be not added. If you want to add missing supplier then enable the above check.',
            labelWidth: 280,
            width: 600,
            margin: '0 0 20px 0',
            bind: {
                hidden: '{addMissingSuppliers}'
            }
        }, {
            xtype: 'form',
            title: 'File',
            items: [{
                xtype: 'filefield',
                width: 600,
                margin: '0 0 20px 0',
                name: 'importer',
                fieldLabel: 'Browse File',
                msgTarget: 'side',
                allowBlank: false,
                anchor: '100%',
                buttonText: 'Select File...',
                allowBlank: false,
            }],
            buttonAlign: 'center',
            buttons: [{
                text: 'Upload',
                handler: 'getFileHeader',
                formBind: true,
            }]
        }]
    }]

});
