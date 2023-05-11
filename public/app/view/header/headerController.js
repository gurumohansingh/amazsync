Ext.define('AmazSync.view.header.headerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.header-header',
    init: function () {

    },
    setting: function (btn) {
        navigation.addComponent({
            xtype: 'settings',
            tabName: 'setting',
            title: 'Setting'
        });
    },
    openproductList: function (btn) {
        navigation.addComponent({
            xtype: 'productsPanel',
            tabName: 'ProductList',
            title: 'Product List'
        });
    },
    openSuppliers: function (btn) {
        navigation.addComponent({
            xtype: 'suppliers',
            tabName: 'Suppliers',
            title: 'Suppliers'
        });
    },
    openlocation: function (btn) {
        navigation.addComponent({
            xtype: 'locationPanel',
            tabName: 'Locations',
            title: 'Locations'
        });
        return false;
    },
    localInventory: function (btn) {

        navigation.addComponent({
            xtype: 'inventory',
            tabName: 'inventory',
            title: 'Inventory'
        });
    },
    restockInventory: function (btn) {

        navigation.addComponent({
            xtype: 'restockView',
            tabName: 'restockInventory',
            title: 'Restock Inventory'
        });
    },
    purchaseOrdersView: function (btn) {

        navigation.addComponent({
            xtype: 'purchaseOrdersView',
            tabName: 'purchaseOrdersView',
            title: 'Shipments'
        });
    },
    openimporter: function (btn) {
        navigation.addComponent({
            xtype: 'importer',
            tabName: 'importer',
            title: 'Import Wizard'
        });
    },
    openProfitView: function (btn) {
        navigation.addComponent({
            xtype: 'profitView',
            tabName: 'profitView',
            title: 'Profit'
        });
    },
    openUsers: function (btn) {
            navigation.addComponent({
                xtype: 'users',
                tabName: 'Users',
                title: 'Users'
            });
        },
    signOut: function (btn) {

        commonutil.apiCall('users/logout', "POST", null, this.getView()).then(responce => {
            Ext.ComponentQuery.query('app-main')[0].destroy();
            tokenStorage.clear();
            window.location.reload();
        });
    }
});
