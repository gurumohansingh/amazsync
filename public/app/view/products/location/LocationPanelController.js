Ext.define('AmazSync.view.products.location.LocationPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.products-location-locationpanel',

    init: function () {
        Ext.getStore('warehouseStore').load();
    },

    submitWarehouse: function (btn) {
        var me = this, form = btn.up('form'), view = me.getView();
        var formValues = form.getValues();
        params = {
            name: formValues.name,
            address: formValues.address,
            description: formValues.description
        };
        if (form.isValid()) {
            commonutil.apiCall('location/addwarehouse', commonutil.POST, params, view)
                .then((res) => {
                    Ext.toast('Submit Successfully');
                    Ext.getStore('warehouseStore').reload();
                    form.reset();
                })
                .catch((err) => {
                    Ext.toast('Enable to submit');
                })
        }
    },
    updateWarehouse: function (btn) {
        var me = this, form = btn.up('form'), view = me.getView();
        var params = form.getValues();
        if (form.isValid()) {
            commonutil.apiCall('location/updatewarehouse', commonutil.PUT, params, view)
                .then((res) => {
                    Ext.toast('Submit Successfully');
                    Ext.getStore('warehouseStore').reload();
                    form.reset();
                })
                .catch((err) => {
                    Ext.toast('Enable to submit');
                })
        }
    },

    editWarehouse: function (grid, rowIndex, colIndex) {
        var me = this, vm = me.getViewModel(), view = me.getView(), form = view.lookupReference('warehouseForm').getForm();
        var store = grid.getStore();
        var record = store.getAt(rowIndex);
        form.loadRecord(record);
    },

    removeWarehouse: function (grid, rowIndex, colIndex) {
        var me = this, vm = me.getViewModel(), view = me.getView();
        var store = grid.getStore();
        var record = store.getAt(rowIndex);
        commonutil.apiCall('location/deletewarehouse', commonutil.DELETE, { id: record.get('id') }, grid)
            .then((res) => {
                Ext.toast('Deleted Successfully');
                vm.set('binlocation', true);
                vm.set('warehouseId', null);
                store.reload();
            })
            .catch((err) => {
                console.log(err);
                Ext.toast('Enable to delete');
            })
    },

    getBinLocation: function (grid, record, tr, rowIndex, e, eOpts) {
        var me = this, vm = me.getViewModel(), view = me.getView(), locationForm = view.lookupReference('wareBinLocation').getForm();

        vm.set('binlocation', false);
        vm.set('warehouseId', record.get('id'));
        vm.set('warehouseName', record.get('name'));
        locationForm.findField('warehouseId').setValue(record.get('id'));
        var binLocatioStore = Ext.getStore('binLocatioStore');
        binLocatioStore.getProxy().setExtraParam('warehouseId', record.get('id'));
        binLocatioStore.load();
    },

    submitBinLocation: function (btn) {
        var me = this, form = btn.up('form'), view = me.getView(), vm = me.getViewModel()
        var formValues = form.getValues();

        if (Ext.isEmpty(vm.get('warehouseId'))) {
            Ext.toast('Please select warehouse');
            return false;
        }
        params = {
            name: formValues.name,
            description: formValues.description,
            warehouseId: vm.get('warehouseId')
        };
        if (form.isValid()) {
            commonutil.apiCall('location/addbinlocations', commonutil.POST, params, view)
                .then((res) => {
                    Ext.toast('Submit Successfully');
                    Ext.getStore('binLocatioStore').reload();
                    form.reset();
                })
                .catch((err) => {
                    Ext.toast('Enable to submit');
                })
        }
    },
    updateBinLocation: function (btn) {
        var me = this, form = btn.up('form'), view = me.getView(), vm = me.getViewModel()
        var formValues = form.getValues();

        if (Ext.isEmpty(vm.get('warehouseId'))) {
            Ext.toast('Please select warehouse');
            return false;
        }
        params = {
            name: formValues.name,
            description: formValues.description,
            warehouseId: vm.get('warehouseId'),
            id: formValues.id
        };
        if (form.isValid()) {
            commonutil.apiCall('location/updatebinlocations', commonutil.PUT, params, view)
                .then((res) => {
                    Ext.toast('Submit Successfully');
                    Ext.getStore('binLocatioStore').reload();
                    form.reset();
                })
                .catch((err) => {
                    Ext.toast('Enable to submit');
                })
        }
    },

    editBinLocation: function (grid, rowIndex, colIndex) {
        var me = this, vm = me.getViewModel(), view = me.getView(), form = view.lookupReference('wareBinLocation').getForm();
        var store = grid.getStore();
        var record = store.getAt(rowIndex);
        form.loadRecord(record);
    },

    removeBinLocation: function (grid, rowIndex, colIndex) {
        var me = this, vm = me.getViewModel(), view = me.getView();
        var store = grid.getStore();
        var record = store.getAt(rowIndex);
        commonutil.apiCall('location/deletebinlocations', commonutil.DELETE, { id: record.get('id') }, grid)
            .then((res) => {
                Ext.toast('Deleted Successfully');
                store.reload();
            })
            .catch((err) => {
                console.log(err);
                Ext.toast('Enable to delete');
            })
    },

    downloadSample: function (btn) {
        commonutil.formCall('file/downloadlocationsample', commonutil.GET, btn.up('form'), null, this.getView(), true);
    },

    uploadcsv: function (btn) {
        var me = this, form = btn.up('form'), view = me.getView(), vm = me.getViewModel()
        var formValues = form.getValues();

        if (Ext.isEmpty(vm.get('warehouseId'))) {
            Ext.toast('Please select warehouse');
            return false;
        }
        commonutil.formCall('file/uploadlocationcsv', commonutil.POST, btn.up('form'), { warehouseId: vm.get('warehouseId') }, this.getView(), true)
            .then((response) => {
                Ext.getStore('binLocatioStore').reload();
                Ext.toast(response);
            })
            .catch((err) => {
                Ext.toast("Upload failed");
            })
    }
});
