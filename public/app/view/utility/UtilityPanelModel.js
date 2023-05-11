Ext.define('AmazSync.view.utility.UtilityPanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.utility-utilitypanel',
    data: {
        name: 'AmazSync',
        lastRun: "No Run"
    },

    stores: {
        lastSynchStore: {
            autoLoad: false,
            method: 'GET',
            type: 'ajaxStore',
            proxy: {
                type: 'ajax',
                url: commonutil.getUrl('info/getLastSync'),
                reader: {
                    type: 'json',
                    rootProperty: ''
                }
            }
        }
    }
});
