Ext.define('AmazSync.view.products.ProductsPanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.products-productspanel',
    data: {
        name: 'AmazSync',
        statusFilter: { status: "All" },
        livestatusFilter: { liveonamazon: 2 },
        searchFilter: ""

    }

});
