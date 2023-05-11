Ext.define('AmazSync.view.products.productDetail.productDetailController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.products-productdetail-productdetail',

    init: function () {

        var me = this, view = me.getView(), vm = me.getViewModel();
    },
    checkBeforeClose: function (cpm) {

        var me = this, view = me.getView(), vm = me.getViewModel();
        var detailForm = vm.getData();

        commonutil.apiCall('products/getproduct', commonutil.GET, { sku: vm.get('sellerSKU') }, view)
            .then((res) => {
                console.log(me);
                var match = me.compare(detailForm, JSON.parse(res)[0]);
                if (!match) {
                    Ext.MessageBox.show({
                        title: 'UnSaved changes',
                        msg: 'Unsaved changes found. Are you sure you want to close?',
                        buttons: Ext.MessageBox.OKCANCEL,
                        icon: Ext.MessageBox.WARNING,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                cpm.suspendEvent('beforeclose');
                                cpm.close();
                            }
                        }
                    });
                } else {
                    cpm.suspendEvent('beforeclose');
                    cpm.close();
                }
            })
            .catch((err) => {
                Ext.toast('Enable to close');
            })

    },
    afterrender: function () {

        var me = this, view = me.getView(), vm = me.getViewModel();
        var tagField = view.lookupReference('tagField');
        tagField.setValue(vm.get('tag'));

        view.lookupReference('supplierList').getproductsuppliers(vm.get('sellerSKU'));
    },
    saveProduct: function (btn) {

        var me = this, view = me.getView(), vm = me.getViewModel();
        var updatedata = vm.getData();

        var dimensionsLocal = {
            Length: updatedata['dimensionsLLocal'],
            Width: updatedata['dimensionsWLocal'],
            Height: updatedata['dimensionsHLocal']
        };

        var parmas = {
            sellerSKU: updatedata['sellerSKU'],
            suppliers: updatedata['suppliers'],
            reshippingCost: updatedata['reshippingCost'],
            prepMaterialCost: updatedata['prepMaterialCost'],
            prepLaborCost: updatedata['prepLaborCost'],
            tag: updatedata['tag'],
            kit: updatedata['kit'],
            targetDaysInAmazon: updatedata['targetDaysInAmazon'],
            targetDaysInWarehouse: updatedata['targetDaysInWarehouse'],
            isPartSKUOnly: updatedata['isPartSKUOnly'] == true ? 1 : 0,
            casePackUPC: updatedata['casePackUPC'],
            casePackQuantity: updatedata['casePackQuantity'],
            EANLocal: updatedata['EANLocal'],
            packageWeightLocal: updatedata['packageWeightLocal'],
            itemNoteLocal: updatedata['itemNoteLocal'],
            dimensionsLocal: JSON.stringify(dimensionsLocal),
            UPCLocal: updatedata['UPCLocal'],
            isActiveLocal: updatedata['isActiveLocal'] == true ? 1 : 0,
            additionalPrepInstructions: updatedata['additionalPrepInstructions'],
            itemNameLocal: updatedata['itemNameLocal'],
            countryofOriginLocal: updatedata['countryofOriginLocal'],
            htcCodeLocal: updatedata['htcCodeLocal'],
            ismasterSku: updatedata['ismasterSku'] == true ? 1 : 0,
            masterSku: updatedata['masterSku']
        }

        commonutil.apiCall('products/update', view.newSku ? commonutil.POST : commonutil.PUT, parmas, view)
            .then((res) => {
                Ext.toast('Submit Successfully');
                Ext.getStore('productList').reload();
                Ext.getStore('inventoryProductListStore').reload();
            })
            .catch((err) => {
                Ext.toast('Enable to submit');
            })
    },

    loadBiLocation: function (combo, newValue) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var store = vm.getStore('warehouseStore');
        store.getProxy().setExtraParam('warehouseId', newValue);
        store.load(function () {
            combo.setValue(vm.get('warehouse'));
        });

    },

    validateBilocation: function (combo, newValue, oldValue) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        if (!Ext.isEmpty(newValue)) {
            var selected = combo.getSelectedRecord().getData();
            selected['sellerSKU'] = vm.get('sellerSKU');
            commonutil.apiCall('location/validatebilocation', commonutil.GET, selected, view)
                .then((res) => {
                    combo.setValue(vm.get('location'));
                    var products = JSON.parse(res);
                    if (products && products[0] && !Ext.isEmpty(products[0].sellerSKU)) {

                        Ext.MessageBox.show({
                            title: 'Location',
                            msg: `Selected location is associted with ${products[0].sellerSKU}. Are you sure you want to proceed?<br> It will remove the location of sku ${products[0].sellerSKU}`,
                            buttons: Ext.MessageBox.OKCANCEL,
                            icon: Ext.MessageBox.WARNING,
                            fn: function (btn) {
                                if (btn == 'ok') {
                                    me.removeLocation(selected);
                                } else {
                                    combo.setValue(oldValue);
                                }
                            }
                        });
                    }

                })
                .catch((err) => {
                    Ext.toast('Enable to fetch');
                })
        }
    },

    removeLocation: function (location) {
        var me = this, view = me.getView();
        commonutil.apiCall('location/removeproductlocation', commonutil.DELETE, location, view)
            .then((res) => {
                Ext.toast('Location removed successfully');
                Ext.getStore('productList').reload();
            })
            .catch((err) => {
                Ext.toast('Enable to remove');
            })
            .catch((err) => {
                Ext.toast('Enable to remove');
            })
    },
    compare: function (unSavedValues, savedValue) {
        var local = {
            Length: unSavedValues['dimensionsLLocal'],
            Width: unSavedValues['dimensionsWLocal'],
            Height: unSavedValues['dimensionsHLocal']
        };
        var saved = {
            Length: '',
            Width: '',
            Height: ''
        };
        if (!Ext.isEmpty(savedValue['dimensionsLocal'])) {
            var jsaved = JSON.parse(savedValue['dimensionsLocal']);
            saved = {
                Length: jsaved.Length,
                Width: jsaved.Width,
                Height: jsaved.Height
            };
        }
        var match = true;
        var compareList = ['reshippingCost', 'prepMaterialCost', 'prepLaborCost', 'tag', 'targetDaysInAmazon', 'targetDaysInWarehouse', 'isPartSKUOnly', 'casePackUPC', 'casePackQuantity', 'EANLocal', 'packageWeightLocal', 'itemNoteLocal', 'UPCLocal', 'isActiveLocal', 'additionalPrepInstructions', 'itemNameLocal']
        compareList.forEach((key) => {
            if (unSavedValues[key] != savedValue[key]) {
                match = false
            }
        })

        if (local.Height != saved.Height || local.Width != saved.Width || local.Length != saved.Length) {
            match = false
        }
        return match
    },

    discard: function (btn) {
        var me = this, view = me.getView();
        view.close();
    },
    calculateCasePackCost: function (text) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var casePackQuantity = text.getValue();
        view.lookupReference('supplierList').fireEvent('calculateCostOfCasepack', casePackQuantity);

    }
});
