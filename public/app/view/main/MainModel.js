/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('AmazSync.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data: {
        defaultCurrency: null,
        userName: null,
        userRoles: null,
        "roleProductView": true,
        "roleProductEdit": true,
        "roleProductSingleSync": true,
        "roleProductViewSupplier": true,
        "roleProductViewKit": true,
        "roleSuppliersView": true,
        "roleSuppliersAddNew": true,
        "roleSuppliersEdit": true,
        "roleSuppliersDelete": true,
        "roleInventoryView": true,
        "roleInventoryEditLocation": true,
        "roleInventoryEditStock": true,
        "roleLocationsView": true,
        "roleLocationsWarehouseEdit": true,
        "roleLocationsWarehouseAdd": true,
        "roleLocationsWarehouseDelete": true,
        "roleLocationsEdit": true,
        "roleLocationsAdd": true,
        "roleLocationsDelete": true,
        "roleLocationsDownloadSample": true,
        "roleLocationsUpload": true,
        "roleSyncInventoryView": true,
        "roleAdmnAll": true,
    }

    //TODO - add data, formulas and/or methods to support your view
});
