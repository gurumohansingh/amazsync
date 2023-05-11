
Ext.define('AmazSync.view.settings.amazonConnect.setting', {
    extend: 'AmazSync.view.override.formPanel',
    xtype: 'amazonConnectSetting',
    requires: [
        'AmazSync.view.settings.amazonConnect.settingController',
        'AmazSync.view.settings.amazonConnect.settingModel'
    ],

    controller: 'settings-amazonconnect-setting',
    viewModel: {
        type: 'settings-amazonconnect-setting'
    },
    items: [{
        xtype: 'container',
        cls: 'formborder',
        padding: 10,
        defaults: {
            width: 500,
            lableWidth: 200,
            xtype: 'textfield',
            allowBlank: false
        },
        items: [{
            fieldLabel: 'Seller Id',
            name: 'SellerId',
            bind: {
                value: '{SellerId}'
            }
        }, {
            fieldLabel: 'MWSAuthToken',
            name: 'MWSAuthToken',
            bind: {
                value: '{MWSAuthToken}'
            }
        }, {
            fieldLabel: 'AWSAccessKeyId',
            name: 'AWSAccessKeyId',
            bind: {
                value: '{AWSAccessKeyId}'
            }
        }, {
            fieldLabel: 'ClientSecret',
            name: 'ClientSecret',
            bind: {
                value: '{ClientSecret}'
            }
        }, {
            fieldLabel: 'Market PalaceID',
            name: 'MarketPalaceID',
            bind: {
                value: '{MarketPalaceID}'
            }
        }, {
            xtype: 'button',
            formBind: 'true',
            text: 'Update',
            handler: 'UpdateSetting',
            width: 100
        }]
    }]
});
