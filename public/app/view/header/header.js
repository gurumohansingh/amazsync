
Ext.define('AmazSync.view.header.header', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.headerToolBar',
    requires: [
        'AmazSync.view.header.headerController',
        'AmazSync.view.header.headerModel',
        'AmazSync.view.products.ProductsPanel',
        'AmazSync.view.importer.Importer',
    ],

    controller: 'header-header',
    viewModel: {
        type: 'header-header'
    },
    width: '100%',
    scrollable: true,
    items: [{
        xtype: 'displayfield',
        bind: {
            value: 'Welcome to <b>{userName}</b>'
        },
        margin: '0 0 0 30px'
    }, "->",
    {
        xtype: 'button',
        cls: 'headerbtn',
        iconCls: 'x-fa fa-box fa-lg fontmustard',
        margin: '0 0 0 30px',
        text: 'Products',
        handler: 'openproductList',
        bind: {
            hidden: '{roleProductView}'
        }
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-dolly fa-lg fontmustard',
        cls: 'headerbtn',
        margin: '0 0 0 30px',
        text: 'Suppliers',
        handler: 'openSuppliers',
        bind: {
            hidden: '{roleSuppliersView}'
        }
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-warehouse fa-lg fontmustard',
        cls: 'headerbtn',
        margin: '0 0 0 30px',
        text: 'Inventory',
        handler: 'localInventory',
        bind: {
            hidden: '{roleInventoryView}'
        }
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-cart-arrow-down fa-lg fontmustard',
        cls: 'headerbtn',
        margin: '0 0 0 30px',
        text: 'Restock Inventory',
        handler: 'restockInventory',
        // //DOTO
        // bind: {
        //     hidden: '{roleInventoryView}'
        // }
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-location-arrow  fa-lg fontmustard',
        cls: 'headerbtn',
        margin: '0 0 0 30px',
        text: 'Locations',
        handler: 'openlocation',
        bind: {
            hidden: '{roleLocationsView}'
        }
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-sync fa-lg fontmustard',
        cls: 'headerbtn',
        margin: '0 0 0 30px',
        text: 'Shipments',
        handler: 'purchaseOrdersView',
        bind: {
            hidden: '{roleAdmnAll}'
        }
    },{
        xtype: 'button',
        iconCls: 'x-fa fa-chart-line fa-lg fontmustard',
        cls: 'headerbtn',
        margin: '0 0 0 30px',
        text: 'Profit',
        handler: 'openProfitView',
        bind: {
            hidden: '{roleAdmnAll}'
        }
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-arrow-down fa-lg fontmustard',
        cls: 'headerbtn',
        margin: '0 0 0 30px',
        text: 'Importer',
        handler: 'openimporter',
        bind: {
            hidden: '{roleAdmnAll}'
        }
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-cog fa-lg fontmustard',
        cls: 'headerbtn',
        text: 'Settings',
        margin: '0 0 0 30px',
        handler: 'setting',
        bind: {
            hidden: '{roleAdmnAll}'
        }
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-users fa-lg fontmustard',
        cls: 'headerbtn',
        text: 'Users',
        margin: '0 0 0 30px',
        handler: 'openUsers',
        bind: {
            hidden: '{roleAdmnAll}'
        }
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-sign-out-alt fa-lg fontmustard',
        cls: 'headerbtn',
        text: 'Sign Out',
        margin: '0 0 0 30px',
        handler: 'signOut'
    }]
});
