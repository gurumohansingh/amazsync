Ext.define('AmazSync.view.products.productList.suppliers.SupplierListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.products-productlist-suppliers-supplierlist',

    updateSupplierList: function (tagfield, newValue, oldValue, eOpts) {
        var me = this, view = me.getView();
        var supplierStore = view.lookupReference('supplier').getStore();
        var allsupplierStore = Ext.getStore('suppierStore');
        supplierStore.removeAll();
        newValue.forEach(element => {
            supplierStore.add(allsupplierStore.findRecord('id', element));
        });
    },

    getproductsuppliers: function (sku, casePackQuantity) {

        var me = this, vm = me.getViewModel(), view = me.getView();
        me.sku = sku;
        var suppierStore = vm.getStore('productSuppliers');
        suppierStore.removeAll();
        suppierStore.getProxy().setExtraParam('productSKU', sku);
        suppierStore.load();
        view.getForm().reset();
        view.setCollapsed(false);
        vm.set('casePackQty', casePackQuantity);
    },

    alignNewSupplier: function (button) {

        var me = this, vm = me.getViewModel(), view = me.getView();
        var productSuppliersGrid = view.lookupReference('productSuppliersGrid');
        var supplierName = view.lookupReference('supplierNameList').getSelectedRecord().getData();
        var productSuppliersStore = vm.getStore('productSuppliers');
        if (productSuppliersStore.find('supplierID', supplierName.id) > -1) {
            Ext.toast('Selected supplier already associated');
            return false;
        } else {
            productSuppliersStore.add({ supplierName: supplierName.supplierName, supplierID: supplierName.id, defaultTax: supplierName.defaultTax });
        }
    },

    removeSupplier: function (grid, rowIndex, colIndex) {
        var me = this, vm = me.getViewModel(), view = me.getView();
        var productSuppliersStore = vm.getStore('productSuppliers');
        var record = productSuppliersStore.getAt(rowIndex).getData();
        var params = {
            productSKU: me.sku,
            supplierID: record['supplierID']
        };
        commonutil.apiCall('supplier/deletesupplier', commonutil.GET, null, view)
            .then((res) => {
                Ext.toast('Deleted Successfully');
                productSuppliersStore.reload();
            })
            .catch((err) => {
                Ext.toast('Enable to delete');
            })

    },

    loadForm: function (grid, record, tr, rowIndex, e, eOpts) {
        var me = this, vm = me.getViewModel(), view = me.getView();
        var rec = record.getData();
        view.getForm().reset();
        rec['productSKU'] = me.sku;
        if (Ext.isEmpty(rec.tax) || rec.tax == 0) {
            rec.tax = rec.defaultTax;
        }
        view.getForm().setValues(rec);
    },

    calculateCostOfCasepack: function (casePackQuantity) {
        var me = this, vm = me.getViewModel(), view = me.getView();
        var from = view.getForm().getValues();
        var costPerUnit = from['costPerUnit']
        vm.set('casePackQty', casePackQuantity);
        vm.set('costPerCasePack', costPerUnit * casePackQuantity);
    },
    changeCostOfCasepack: function (text) {
        var me = this, vm = me.getViewModel(), view = me.getView();
        vm.set('costPerCasePack', text.getValue() * vm.get('casePackQty'));
    },
    submit: function (btn) {
        var me = this, vm = me.getViewModel(), view = me.getView();
        var form = view.getForm().getValues();
        var productSuppliersStore = vm.getStore('productSuppliers');
        var grid = view.lookupReference('productSuppliersGrid')
        var selectedSuppliers = grid.getSelectionModel().getSelected() && grid.getSelectionModel().getSelected().items[0] && grid.getSelectionModel().getSelected().items[0].getData();
        if (Ext.isEmpty(selectedSuppliers)) {
            Ext.toast('Please select at least one supplier to submit');
            return false;
        }
        var params = {
            productSKU: me.sku,
            supplierID: selectedSuppliers['supplierID'],
            supplierSKU: form['supplierSKU'],
            costPerUnit: form['costPerUnit'],
            alwaysPurchaseInCase: view.getForm().findField('alwaysPurchaseInCase').getValue() ? 1 : 0,
            minimumOrderQuantity: form['minimumOrderQuantity'],
            inboundShippingCost: form['inboundShippingCost'],
            additionalSupplierCosts: form['additionalSupplierCosts'],
            MAP: form['MAP'],
            MSRP: form['MSRP'],
            MRP: form['MRP'],
            tax: form['tax']
        };
        if (Ext.isEmpty(selectedSuppliers.productSKU)) {
            commonutil.apiCall('supplier/addsupplier', commonutil.POST, params, view)
                .then((res) => {
                    Ext.toast('Submit Successfully');
                    Ext.getStore('productList').reload();
                    productSuppliersStore.reload();
                })
                .catch((err) => {
                    Ext.toast('Enable to submit');
                })
        } else {
            commonutil.apiCall('supplier/updatesupplier', commonutil.PUT, params, view)
                .then((res) => {
                    Ext.toast('Submit Successfully');
                    Ext.getStore('productList').reload();
                    productSuppliersStore.reload();
                })
                .catch((err) => {
                    Ext.toast('Enable to submit');
                })
        }
    },

    cancel: function () {
        var me = this, vm = me.getViewModel(), view = me.getView();
        var productSuppliersStore = vm.getStore('productSuppliers');
        productSuppliersStore.removeAll();
        view.getForm().reset();
        view.setCollapsed(true);
        me.sku = null;
    }
});
