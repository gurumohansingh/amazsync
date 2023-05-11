
Ext.define('AmazSync.view.products.productList.suppliers.SupplierList', {
    extend: 'Ext.form.Panel',
    xtype: 'supplierList',
    requires: [
        'AmazSync.view.products.productList.suppliers.SupplierListController',
        'AmazSync.view.products.productList.suppliers.SupplierListModel',
        'AmazSync.store.suppierStore'
    ],

    controller: 'products-productlist-suppliers-supplierlist',
    viewModel: {
        type: 'products-productlist-suppliers-supplierlist'
    },
    buttonAlign: 'center',
    margin: 2,
    border: false,
    scrollable: true,
    title: 'Supplier List',
    layout: {
        type: 'form'
    },
    getproductsuppliers: function (sku, casePackQuantity) {
        this.getController().getproductsuppliers(sku, casePackQuantity);
    },
    listeners: {
        calculateCostOfCasepack: 'calculateCostOfCasepack'
    },
    items: [{
        layout: 'vbox',
        defaults: {
            xtype: 'textfield',
            margin: 5,
            width: '100%'
        },
        items: [{
            xtype: 'container',
            layout: 'hbox',
            items: [{
                xtype: 'combo',
                reference: 'supplierNameList',
                fieldLabel: 'Add New Supplier',
                width: 180,
                displayField: 'supplierName',
                typeAhead: true,
                anyMatch: true,
                forceSelection: true,
                transform: 'stateSelect',
                queryMode: 'local',
                valueField: 'id',
                selectOnFocus: true,
                triggerAction: 'all',
                store: 'suppierStore'
            }, {
                xtype: 'button',
                text: 'Add',
                margin: '28px 0 0 0',
                handler: 'alignNewSupplier'
            }]
        }, {
            xtype: 'grid',
            height: 150,
            reference: 'productSuppliersGrid',
            rowLines: false,
            columnLines: false,
            forceFit: true,
            viewConfig: {
                emptyText: 'No supplier found'
            },
            bind: {
                store: '{productSuppliers}'
            },
            listeners: {
                rowclick: 'loadForm'
            },

            columns: [{
                dataIndex: 'supplierName',
                flex: 1,
            }, {
                xtype: "actioncolumn",
                align: "center",
                width: 24,
                items: [
                    {
                        tooltip: 'Remove Suppliers',
                        iconCls: 'x-fa fa-trash fontcolorred',
                        handler: 'removeSupplier'
                    },
                ]
            }]

        },
        {
            xtype: "displayfield",
            fieldLabel: 'Product SKU',
            labelAlign: "left",
            name: 'productSKU'
        }, {
            fieldLabel: 'Supplier SKU',
            allowBlank: false,
            name: 'supplierSKU'
        }, {
            fieldLabel: 'MAP',
            name: 'MAP',
            filter: {
                type: 'string'
            }
        }, {
            fieldLabel: 'MSRP($)',
            name: 'MSRP',
            filter: {
                type: 'number'
            }
        }, {
            fieldLabel: 'MRP($)',
            name: 'MRP',
            filter: {
                type: 'number'
            }
        }, {
            fieldLabel: 'Cost Per Unit',
            allowBlank: false,
            name: 'costPerUnit',
            listeners: {
                change: 'changeCostOfCasepack'
            }
        }, {
            fieldLabel: 'Cost Per Casepack ',
            reference: 'costofCasepack',
            readOnly: true,
            bind: {
                value: '{costPerCasePack}'
            }
        }, {
            xtype: 'checkbox',
            fieldLabel: 'Always Purchase In Case',
            name: 'alwaysPurchaseInCase',
            submitValue: 0
        }, {
            fieldLabel: 'Minimum Order Quantity',
            allowBlank: false,

            name: 'minimumOrderQuantity'
        }, {
            fieldLabel: 'Inbound Shipping Cost',
            allowBlank: false,
            name: 'inboundShippingCost'
        },
        {
            fieldLabel: 'Additional Supplier Costs',
            allowBlank: false,
            name: 'additionalSupplierCosts'
        },
        {
            fieldLabel: 'Tax(%)',
            name: 'tax'
        }
        ]
    }],
    buttons: [{
        text: 'Submit',
        handler: 'submit'
    }, {
        text: 'Cancel',
        handler: 'cancel',
        hidden: true
    }]

});
