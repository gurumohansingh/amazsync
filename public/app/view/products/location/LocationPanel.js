
Ext.define('AmazSync.view.products.location.LocationPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'locationPanel',
    requires: [
        'AmazSync.view.products.location.LocationPanelController',
        'AmazSync.view.products.location.LocationPanelModel'
    ],

    controller: 'products-location-locationpanel',
    viewModel: {
        type: 'products-location-locationpanel'
    },
    layout: 'hbox',
    items: [{
        xtype: 'warehouseList',
        flex: 1,
    }, {
        xtype: 'binLocationList',
        flex: 1,
    }]
});
