
Ext.define('AmazSync.view.utility.UtilityPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'utilityPanel',
    requires: [
        'AmazSync.view.utility.UtilityPanelController',
        'AmazSync.view.utility.UtilityPanelModel'
    ],

    controller: 'utility-utilitypanel',
    viewModel: {
        type: 'utility-utilitypanel'
    },
    layout: 'border',
    items: [{
        region: 'west',
        xtype: 'container',
        layout: 'vbox',
        padding: 20,
        items: [{
            xtype: 'button',
            iconCls: 'x-fa fa-arrow-down fontcolorgreen',
            text: 'Full Amazon Sync',
            tooltip: 'Full Amazon Sync will fetch all the skus from amazon and will update/add',
            handler: 'updateInventory',
            margin: 10,
            bind: {
                hidden: '{roleSyncInventoryView}'
            }
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-arrow-down fontcolorgreen',
            margin: 10,
            text: 'Restock Amazon Sync',
            tooltip: 'It will fetch restock data from amazon',
            handler: 'fetchRestock',
            bind: {
                hidden: '{roleSyncInventoryView}'
            }
        },{
            xtype: 'button',
            iconCls: 'x-fa fa-arrow-down fontcolorgreen',
            margin: 10,
            text: 'Update Amazon SKU Fees',
            tooltip: 'It will fetch latest amazon fees for products',
            handler: 'fetchAmazonFees',
            bind: {
                hidden: '{roleSyncInventoryView}'
            }
        }
        ,{
            xtype: 'button',
            iconCls: 'x-fa fa-arrow-down fontcolorgreen',
            margin: 10,
            text: 'Sync Amazon Shipments',
            tooltip: 'It will fetch latest amazon Shipments',
            handler: 'fetchAmazonShipments',
            bind: {
                hidden: '{roleSyncInventoryView}'
            }
        }]
    }, {
        xtype: 'lastSyncGrid',
        region: 'center',
    }]
});
