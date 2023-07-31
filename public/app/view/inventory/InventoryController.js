Ext.define('AmazSync.view.inventory.InventoryController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.inventory-inventory',

    init: function () {
        var vm = this.getViewModel();
        if (!localStorage.getItem('sellerskuLastWareHouse')) {
            commonutil.apiCall('settings/getsetting', commonutil.GET, { settinggroup: 'defaultWarehouse' }, this.getView())
                .then(response => {
                    var setting = JSON.parse(response);
                    var value = JSON.parse(setting.settings)
                    vm.set('defaultWarehouse', value.defaultWarehouse);
                })
        } else {
            vm.set('defaultWarehouse', localStorage.getItem('sellerskuLastWareHouse'));
        }
        Ext.getStore('warehouseStore').load();
    },

    applyFilter: function (field, newValue) {
        debugger
        var vm = this.getViewModel(), view = this.getView();
        var warehouse = view.lookupReference('warehouse').getValue();
        var stockFilter = view.lookupReference('stockFilter').getValue()['stock'];
        var locationFilter = view.lookupReference('locationFilter').getValue()['location'];
        var searchFilter = view.lookupReference('searchFilter').getValue().toLowerCase().trim();
        var inventoryProductListStore = Ext.getStore('inventoryProductListStore');
        inventoryProductListStore.getProxy().setExtraParams({searchParam:searchFilter,warehouseId:warehouse,stockFilter:stockFilter,locationFilter:locationFilter});
        inventoryProductListStore.load()
       
    },
    updateWareHouse: function () {
        var me = this;
        var vm = this.getViewModel(), view = this.getView();
        var warehouse = view.lookupReference('warehouse').getValue();
        binLocationStore = vm.getStore('binLocationStore');
        binLocationStore.getProxy().setExtraParam('warehouseId', warehouse);
        binLocationStore.load();
        localStorage.setItem('sellerskuLastWareHouse', warehouse);
        var inventoryProductListStore = Ext.getStore('inventoryProductListStore');
        inventoryProductListStore.getProxy().setExtraParam('warehouseId', warehouse);
        inventoryProductListStore.load(() => { me.applyFilter() });

    }
});
