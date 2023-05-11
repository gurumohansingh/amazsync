
Ext.define('AmazSync.view.settings.setting', {
    extend: 'Ext.tab.Panel',
    xtype: 'settings',
    requires: [
        'AmazSync.view.settings.settingController',
        'AmazSync.view.settings.settingModel',
        'AmazSync.view.settings.amazonConnect.setting',
        'AmazSync.view.utility.UtilityPanel'
    ],
    title: 'Settings',
    controller: 'settings-setting',
    viewModel: {
        type: 'settings-setting'
    },
    items: [{
        xtype: 'amazonConnectSetting',
        title: 'Amazon Connect'
    }, {
        xtype: 'supplierSettings',
        title: 'Defaults'
    }, {
        xtype: 'utilityPanel',
        title: 'Utility',

    },
    {
        xtype: 'auditView',
        title: 'History',
    }]
});
