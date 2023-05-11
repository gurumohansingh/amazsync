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

    applyFilter: function () {
        var vm = this.getViewModel(), view = this.getView();
        var warehouse = view.lookupReference('warehouse').getValue();
        var stockFilter = view.lookupReference('stockFilter').getValue()['stock'];
        var locationFilter = view.lookupReference('locationFilter').getValue()['location'];
        var searchFilter = view.lookupReference('searchFilter').getValue().toLowerCase().trim();

        var inventoryProductListStore = Ext.getStore('inventoryProductListStore');
        inventoryProductListStore.clearFilter();
        var stockFilterCondition = true;
        var locationFilterCondition = true;
        inventoryProductListStore.filterBy((record) => {
            if (stockFilter == 1)
                stockFilterCondition = record.get('stock') > 0
            if (stockFilter == 2)
                stockFilterCondition = record.get('stock') == 0 || Ext.isEmpty(record.get('stock'))

            if (locationFilter == 1)
                locationFilterCondition = !Ext.isEmpty(record.get('binlocationname'))
            if (locationFilter == 2)
                locationFilterCondition = Ext.isEmpty(record.get('binlocationname'))

            if ((record.get('itemName').toLowerCase().includes(searchFilter)
                || record.get('sellerSKU').toLowerCase().includes(searchFilter)
                || record.get('amazonASIN').toLowerCase().includes(searchFilter))
                && stockFilterCondition && locationFilterCondition
            ) {
                return true;
            }
            else {
                return false;
            }
        })
        vm.set('totalCount', inventoryProductListStore.getCount());
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
