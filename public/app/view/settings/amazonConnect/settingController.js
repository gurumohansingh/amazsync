Ext.define('AmazSync.view.settings.amazonConnect.settingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings-amazonconnect-setting',

    init: function () {
        var me = this, form = me.getView().getForm();
        commonutil.apiCall('settings/getsetting', commonutil.GET, { settinggroup: 'sellerSettingGroup' }, me.getView())
            .then(response => {
                var setting = JSON.parse(response)
                me.getViewModel().set(JSON.parse(setting.settings));
            })
    },

    UpdateSetting: function (dtn) {
        var me = this, form = me.getView().getForm();
        var values = form.getValues();
        values['settinggroup'] = 'sellerSettingGroup'
        commonutil.apiCall('settings/update', commonutil.POST, values, me.getView());
    }

});
