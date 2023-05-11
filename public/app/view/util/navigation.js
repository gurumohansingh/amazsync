
Ext.define('AmazSync.view.util.navigation', {
    alternateClassName: 'navigation',
    singleton: true,
    tabs: [],
    addComponent: function (component) {
        var centerPanel = Ext.ComponentQuery.query('centerPanel')[0];
        var tabId = "tabname-".concat(component.tabName).replaceAll(" ", "").replace(/[^a-zA-Z0-9-]/g, "");
        var tab = Ext.ComponentQuery.query(`#${tabId}`)[0];
        if (!tab) {

            if (component.directComponent) {
                if (component.productDetailView) {
                    component.productDetailView['itemId'] = tabId;
                    centerPanel.add(component.productDetailView);
                }
                if (component.poDetails) {
                    component.poDetails['itemId'] = tabId;
                    centerPanel.add(component.poDetails);
                }
            }
            else {
                component['itemId'] = tabId;
                centerPanel.add(component);
            }
            this.tabs.push(component);
            centerPanel.setActiveTab(tabId);
        }
        else {
            centerPanel.setActiveTab(tab);
        }
    },
    remove: function () {

    },
    getTabs: function () {
        return this.tabs;
    }
});
