
Ext.define('AmazSync.view.virtualShipments.VirtualShipmentsView', {
    extend: 'Ext.window.Window',

    requires: [
        'AmazSync.view.virtualShipments.VirtualShipmentsViewController',
        'AmazSync.view.virtualShipments.VirtualShipmentsViewModel'
    ],

    controller: 'virtualshipments-virtualshipmentsview',
    viewModel: {
        type: 'virtualshipments-virtualshipmentsview'
    },
    listeners: {
        addVirtualshipments: 'virtualshipments'
    },
    modal: true,
    width: '70%',
    height: '70%',
    layout: 'fit',
    items: [{
        xtype: 'virtualShipmentsGrid'
    }]

});
