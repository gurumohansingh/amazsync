
Ext.define('AmazSync.view.purchaseOrders.PurchaseOrdersView', {
    extend: 'Ext.panel.Panel',
    xtype: 'purchaseOrdersView',
    requires: [
        'AmazSync.view.purchaseOrders.PurchaseOrdersViewController',
        'AmazSync.view.purchaseOrders.PurchaseOrdersViewModel'
    ],

    controller: 'purchaseorders-purchaseordersview',
    viewModel: {
        type: 'purchaseorders-purchaseordersview'
    },
    layout: 'fit',
    items: [{
        xtype: 'purchaseOrdersGrid'
    }]
});
