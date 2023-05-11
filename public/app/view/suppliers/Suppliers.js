
Ext.define('AmazSync.view.suppliers.Suppliers', {
    extend: 'Ext.panel.Panel',

    xtype: 'suppliers',
    requires: [
        'AmazSync.view.suppliers.SuppliersController',
        'AmazSync.view.suppliers.SuppliersModel',
        'AmazSync.view.suppliers.form.SuppliersForm',
        'AmazSync.view.suppliers.result.SuppliersGrid'
    ],

    controller: 'suppliers-suppliers',
    viewModel: {
        type: 'suppliers-suppliers'
    },

    layout: 'border',
    items: [{
        xtype: 'suppliersGrid',
        region: 'center',
        width: '100%',

    }, {
        xtype: 'suppliersForm',
        region: 'east',
        width: 'auto',
        split: true,
        collapsible: true,
        collapsed: true,
        collapseDirection: 'right'
    }]
});
