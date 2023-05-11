/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('AmazSync.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',
    init: function () {
        var vm = this.getViewModel();
        commonutil.apiCall('settings/getsetting', commonutil.GET, { settinggroup: 'suppliersettings' }, null)
            .then(response => {
                var setting = JSON.parse(response);

                var defaultCurrency = JSON.parse(setting.settings)
                AmazSync.defaultCurrency = defaultCurrency && defaultCurrency.defaultCurrency;
            })
        Ext.on('resize', function (view) {
            Ext.ComponentQuery.query("app-main")[0].updateLayout({ defer: 100, isRoot: true });
        });
    },
    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    },
});
