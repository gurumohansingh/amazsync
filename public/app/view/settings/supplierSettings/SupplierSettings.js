
Ext.define('AmazSync.view.settings.supplierSettings.SupplierSettings', {
    extend: 'Ext.form.Panel',
    xtype: 'supplierSettings',
    cls: 'formborder',
    requires: [
        'AmazSync.view.settings.supplierSettings.SupplierSettingsController',
        'AmazSync.view.settings.supplierSettings.SupplierSettingsModel'
    ],

    controller: 'settings-suppliersettings-suppliersettings',
    viewModel: {
        type: 'settings-suppliersettings-suppliersettings'
    },
    layout: {
        type: 'hbox',
        pack: 'center',
    },
    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            items: [{
                xtype: 'container',
                layout: 'hbox',
                cls: 'hrline',
                items: [{
                    xtype: 'combo',
                    fieldLabel: 'Default Currency',
                    name: 'defaultCurrency',
                    displayField: 'value',
                    valueField: 'value',
                    forceSelection: true,
                    labelAlign: 'left',
                    labelWidth: 150,
                    allowBlank: false,
                    store: {
                        data: [{ value: 'USD' }, { value: 'JPY' }, { value: 'EUR' }, { value: 'GBP' }, { value: 'AUD' }, { value: 'CAD' }, { value: 'CHF' }, { value: 'CNH' },]
                    }
                }, {
                    xtype: 'button',
                    text: 'Submit',
                    formBind: true,
                    margin: '5px 0 0 10px',
                    handler: 'saveSupplierSettings'
                }]
            }, {
                xtype: 'container',
                layout: 'hbox',
                items: [{
                    xtype: 'combo',
                    fieldLabel: 'Default Warehouse',
                    name: 'defaultWarehouse',
                    displayField: 'name',
                    valueField: 'id',
                    forceSelection: true,
                    labelAlign: 'left',
                    allowBlank: false,
                    labelWidth: 150,
                    store: 'warehouseStore'
                }, {
                    xtype: 'button',
                    text: 'Submit',
                    formBind: true,
                    margin: '5px 0 0 10px',
                    handler: 'saveWarehouse'
                }]
            }]
        }]
});
