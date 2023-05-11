Ext.define('AmazSync.view.main.centerPanel.centerPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-centerpanel-centerpanel',

    beforeclose: function (tab, e) {
        tab.fireEvent('checkBeforeClose', tab);
        return false;
    }
});
