
Ext.define('AmazSync.view.suppliers.form.SuppliersForm', {
    extend: 'Ext.form.Panel',

    xtype: 'suppliersForm',
    reference: 'suppliersForm',
    title: 'Add/Update Suppliers',
    buttonAlign: 'center',
    margin: 10,
    border: false,
    scrollable: true,
    layout: {
        type: 'form'
    },

    items: [{
        layout: 'vbox',
        defaults: {
            labelWidth: 100,
            xtype: 'textfield',
            margin: 10,
        },
        items: [{
            xtype: 'hiddenfield',
            name: 'id',
        }, {
            fieldLabel: 'Supplier Name',
            name: 'supplierName',
            allowBlank: false,
        },
        {
            fieldLabel: 'Address',
            name: 'address',
            allowBlank: false,
            height: 50,
        },
        {
            fieldLabel: 'Address2',
            name: 'address2',
            height: 50,
        },
        {
            fieldLabel: 'City',
            name: 'city'
        },
        {

            fieldLabel: 'State',
            name: 'state'
        },
        {

            fieldLabel: 'Country',
            name: 'country',
            inputValue: 1,
        },
        {

            fieldLabel: 'Zip Code',
            name: 'zipCode'
        }, {

            fieldLabel: 'Phone',
            name: 'phone'
        }, {

            fieldLabel: 'Contact Name',
            name: 'contactName'
        }, {

            fieldLabel: 'Contact Email',
            name: 'contactEmail',
            vtype: 'email'
        }, {
            xtype: 'combo',
            fieldLabel: 'Restock Model',
            name: 'restockModel',
            displayField: 'value',
            valueField: 'value',
            forceSelection: true,
            store: {
                data: [{ value: 'Local Warehouse' }, { value: 'Direct AMZ Ship' }]
            }
        }, {
            xtype: 'numberfield',
            fieldLabel: 'Default Lead Time In Days',
            name: 'DefaultLeadTimeInDays'
        }, {
            xtype: 'numberfield',
            fieldLabel: 'Default Target Days in Warehouse',
            name: 'defaultTargetDaysInWarehouse'
        }, {
            xtype: 'numberfield',
            fieldLabel: 'Default Target Days In Amazon',
            name: 'defaultTargetDaysInAmazon'
        }, {
            xtype: 'numberfield',
            fieldLabel: 'Free Freight Min',
            name: 'freeFreightMin'
        }, {
            xtype: 'numberfield',
            fieldLabel: 'Min Purchase Budget',
            name: 'minPurchaseBudget'
        }, {
            xtype: 'combo',
            fieldLabel: 'Payment Terms',
            name: 'paymentTerms',
            displayField: 'value',
            valueField: 'value',
            forceSelection: true,
            bind: {
                store: '{paymentTermsStore}'
            }
        }, {
            xtype: 'textarea',
            fieldLabel: 'PO Notes',
            name: 'PONotes'
        }, {
            xtype: 'combo',
            fieldLabel: 'Default Currency',
            name: 'defaultCurrency',
            displayField: 'value',
            valueField: 'value',
            forceSelection: true,
            store: {
                data: [{ value: 'USD' }, { value: 'JPY' }, { value: 'EUR' }, { value: 'GBP' }, { value: 'AUD' }, { value: 'CAD' }, { value: 'CHF' }, { value: 'CNH' },]
            }
        }, {
            xtype: 'textarea',
            fieldLabel: 'Internal Notes',
            name: 'internalNotes'
        }, {
            xtype: 'combo',
            fieldLabel: 'Shipment Method',
            name: 'shipmentMethod',
            displayField: 'value',
            valueField: 'value',
            forceSelection: true,
            store: {
                data: [{ value: 'Air' }, { value: 'Ground' }, { value: 'LTL' }, { value: 'Ocean' }]
            }
        }, {
            xtype: 'textfield',
            fieldLabel: 'Default Tax',
            name: 'defaultTax'
        }, {
            xtype: 'checkbox',
            fieldLabel: 'Exclusive Agreement',
            name: 'exclusiveAgreement',
            inputValue: 1
        }]
    }],
    buttons: [{
        text: 'Submit',
        handler: 'submit',
        bind: {
            hidden: '{roleSuppliersAddNew}'
        }
    }, {
        text: 'Delete',
        handler: 'delete',
        bind: {
            hidden: '{roleSuppliersDelete}'
        }
    }, {
        text: 'Cancel',
        handler: 'cancel'
    }]

});
