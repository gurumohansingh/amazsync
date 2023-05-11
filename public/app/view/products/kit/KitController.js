Ext.define('AmazSync.view.products.kit.KitController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.products-kit-kit',
    init: function () {
        var me = this, view = me.getView(), vm = me.getViewModel(), kitStore = vm.getStore('productskitStore'),
            allProductskitStore = vm.getStore('allProductskitStore');
        var parentProduct = view.parentProduct;

        view.lookupReference('image').setSrc(parentProduct.imageUrl);
        view.lookupReference('sku').setValue(parentProduct.sellerSKU);
        view.lookupReference('productName').setText(parentProduct.itemName);
        view.lookupReference('itemNameLocal').setValue(parentProduct.itemNameLocal);
        kitStore.getProxy().setExtraParam('parentSku', parentProduct.sellerSKU);
        if (view.parentSource == 'inventory') {
            kitStore.getProxy().setExtraParam('warehouseId', view.warehouseId);
        }
        kitStore.load();

        allProductskitStore.getProxy().setExtraParam('sellerSKU', parentProduct.sellerSKU);
    },

    applyFilter: function (searchCmp) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var searchText = searchCmp.getValue().toLowerCase().trim(), allProductskitStore = vm.getStore('allProductskitStore');
        if (searchText.length >= 2) {
            allProductskitStore.getProxy().setExtraParam('searchTxt', searchText);
            allProductskitStore.load();
        } else {
            allProductskitStore.removeAll();
        }

    },

    removeProductFromKit: function (grid, rowIndex, colIndex) {
        var me = this, view = me.getView(), vm = me.getViewModel(), store = grid.getStore();
        var product = store.getAt(rowIndex);

        allProductskitStore = vm.getStore('allProductskitStore');
        var params = {
            sku: product.get('sellerSKU'),
            parentSku: view.parentProduct.sellerSKU
        };
        commonutil.apiCall('kit/deletekitproduct', commonutil.DELETE, params, view)
            .then((res) => {
                delete
                    Ext.toast('Deleted Successfully');
                allProductskitStore.reload();
                store.reload();
            })
            .catch((err) => {

                Ext.toast('Enable to delete');
            })

    },

    addProductInKit: function (grid, rowIndex, colIndex) {
        var me = this, view = me.getView(), store = grid.getStore(), vm = me.getViewModel();
        var product = store.getAt(rowIndex);
        var kitStore = vm.getStore('productskitStore'),
            allProductskitStore = vm.getStore('allProductskitStore');
        var params = {
            sku: product.get('sellerSKU'),
            parentSku: view.parentProduct.sellerSKU,
            count: 1
        };
        var checkExist = kitStore.find('sellerSKU', product.get('sellerSKU'));

        if (checkExist > -1) {
            Ext.toast('SKU already in kit list');
            return false;
        }
        commonutil.apiCall('kit/addkitproduct', commonutil.POST, params, view)
            .then((res) => {
                Ext.toast('Added Successfully');
                allProductskitStore.reload();
                kitStore.reload();
            })
            .catch((err) => {
                Ext.toast('Enable to add');
            })
    },
    updateCount: function (text, newValue, oldValue, eOpts) {
        var me = this, view = me.getView();
        var kitCount = {
            sku: text.ownerCt.context.record.get('sellerSKU'),
            parentSku: view.parentProduct.sellerSKU,
            count: text.getValue()
        }

        commonutil.apiCall('kit/updatekitcount', commonutil.POST, kitCount, view)
            .then((res) => {
                Ext.toast('Count updated successfully');

            })
            .catch((err) => {
                Ext.toast('Enable to update');
            })
            .catch((err) => {
                Ext.toast('Enable to update');
            })
    },
    updateKitName: function (btn) {
        var me = this, view = me.getView();
        var params = {
            parentSku: view.parentProduct.sellerSKU,
            itemNameLocal: view.lookupReference('itemNameLocal').getValue()
        }

        commonutil.apiCall('kit/updatekitname', commonutil.POST, params, view)
            .then((res) => {
                Ext.toast('Kit name updated successfully');

            })
            .catch((err) => {
                Ext.toast('Enable to update');
            })
            .catch((err) => {
                Ext.toast('Enable to update');
            })
    },
    opneImage: function (grid, record, tr, rowIndex, e, eOpts) {
        if (e.getTarget().tagName.toUpperCase() === "IMG") {
            var imageUrl = record.get('imageUrl').split(".");
            imageUrl.splice(imageUrl.length - 2, 1);
            if (imageUrl.length == 0) {
                Ext.Msg.alert("Info", "No image found");
                return false;
            }

            var win = Ext.create('Ext.window.Window', {
                modal: true,
                layout: 'fit',
                items: [{
                    xtype: 'image',
                    src: imageUrl.join('.'),
                    publishes: {
                        width: true,
                        height: true
                    },
                    listeners: {
                        load: {
                            element: 'el',
                            scope: win,
                            fn: function (win, component, prevIndex, newIndex, eOpts) {
                                this.component.up('window').updateLayout();
                                this.component.up('window').center()
                            }
                        }
                    }
                }]
            })
            win.show();
        }
    }
});
