Ext.define('AmazSync.view.suppliers.SuppliersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.suppliers-suppliers',

    syncSupplier: function () {
        this.getViewModel().getStore('suppierStore').reload();
    },

    applySearch: function (searchbox, value) {
        var store = this.getViewModel().getStore('suppierStore');
        store.clearFilter();
        if (Ext.isEmpty(value)) {
            return false;
        }
        store.filterBy((rec) => {
            return rec.get('supplierName').indexOf(value) > -1 || rec.get('city').indexOf(value) > -1;
        })
    },

    submit: function (btn) {
        var me = this, view = me.getView(), form = btn.up('form'), store = me.getViewModel().getStore('suppierStore');
        formPanel = view.lookupReference('suppliersForm');

        if (form.isValid()) {
            var formData = form.getValues();
            var supplier = formData;
            supplier['exclusiveAgreement'] = supplier['exclusiveAgreement'] ? 1 : 0;
            if (Ext.isEmpty(supplier.id)) {
                delete supplier.id;
                commonutil.apiCall('supplier', commonutil.POST, supplier, view)
                    .then((res) => {
                        form.reset();
                        store.reload();
                        Ext.toast('Submit Successfully');
                        formPanel.setCollapsed(true);
                    })
                    .catch((err) => {
                        Ext.toast('Enable to submit');
                    })
            }
            else {
                commonutil.apiCall('supplier', commonutil.PUT, supplier, view)
                    .then((res) => {
                        form.reset();
                        store.reload();
                        Ext.toast('Submit Successfully');
                        formPanel.setCollapsed(true);
                    })
                    .catch((err) => {
                        Ext.toast('Enable to submit');
                    })
            }

        }
    },

    removeSupplier: function (grid, rowIndex, colIndex) {
        var me = this, view = me.getView(), store = me.getViewModel().getStore('suppierStore');
        var supplierId = store.getAt(rowIndex).get('id');
        commonutil.apiCall('supplier', commonutil.DELETE, { supplierId: supplierId }, view)
            .then((res) => {
                store.reload();
                Ext.toast('Submit Successfully');
            })
            .catch((err) => {
                Ext.toast('Enable to delete');
            })

    },

    cancel: function (btn) {
        var form = btn.up('form');
        form.reset();
        form.setCollapsed(true);
    },

    addNewSupplier: function () {
        var me = this, view = me.getView(), form = view.lookupReference('suppliersForm');
        form.getForm().reset();
        form.getForm().findField('defaultCurrency').setValue(AmazSync.defaultCurrency);
        form.setCollapsed(false);
    },

    editSupplier: function (grid, rowIndex, colIndex) {
        var me = this, view = me.getView(), form = view.lookupReference('suppliersForm'), store = me.getViewModel().getStore('suppierStore');
        form.reset();
        form.setCollapsed(false);
        var editSupplierData = store.getAt(rowIndex).getData();
        if (Ext.isEmpty(editSupplierData.defaultCurrency)) {
            editSupplierData.defaultCurrency = AmazSync.defaultCurrency;
        }
        form.getForm().setValues(editSupplierData);
    }
});
