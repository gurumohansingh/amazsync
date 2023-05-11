Ext.define('AmazSync.view.settings.supplierSettings.SupplierSettingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings-suppliersettings-suppliersettings',

    init: function () {
        var me = this, form = me.getView().getForm();
        commonutil.apiCall('settings/getsetting', commonutil.GET, { settinggroup: 'suppliersettings' }, me.getView())
            .then(response => {
                var setting = JSON.parse(response);
                form.setValues(JSON.parse(setting.settings));
            })
        commonutil.apiCall('settings/getsetting', commonutil.GET, { settinggroup: 'defaultWarehouse' }, me.getView())
            .then(response => {
                var setting = JSON.parse(response);
                form.setValues(JSON.parse(setting.settings));
            });
        Ext.getStore('warehouseStore').load();
    },

    saveSupplierSettings: function (dtn) {
        var me = this, form = me.getView().getForm();
        var values = form.getValues();
        var params = {
            settinggroup: 'suppliersettings',
            defaultCurrency: values['defaultCurrency']
        };
        commonutil.apiCall('settings/updatesettings', commonutil.POST, params, me.getView());
    },

    saveWarehouse: function (dtn) {
        var me = this, form = me.getView().getForm();
        var values = form.getValues();
        var params = {
            settinggroup: 'defaultWarehouse',
            defaultWarehouse: values['defaultWarehouse']
        }
        commonutil.apiCall('settings/updatesettings', commonutil.POST, params, me.getView());
    }
});
