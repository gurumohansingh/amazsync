
Ext.define('AmazSync.view.main.centerPanel.centerPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'centerPanel',
    requires: [
        'AmazSync.view.main.centerPanel.centerPanelController',
        'AmazSync.view.main.centerPanel.centerPanelModel'
    ],

    controller: 'main-centerpanel-centerpanel',
    viewModel: {
        type: 'main-centerpanel-centerpanel'
    },
    defaults: {
        closable: true,
        autoDestroy: true,
    }
});
