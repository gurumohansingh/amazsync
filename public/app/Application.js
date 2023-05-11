/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('AmazSync.Application', {
    extend: 'Ext.app.Application',
    name: 'AmazSync',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },
    stores: ['restockStore', 'masterSkuStore', 'productList', 'countryOfOriginStore', 'skuStore', 'suppierStore', 'binLocatioStore', 'warehouseStore', 'inventoryProductListStore', 'rolesStore', 'purchaseOrderStore'],

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },
    launch: function () {
        window.addEventListener("beforeunload", function (e) {
            e = e || window.event;

            // For IE and Firefox prior to version 4
            if (e) {
                e.returnValue = 'Sure?';
            }

            // For Safari
            return 'Sure?';
        });
    }
});
