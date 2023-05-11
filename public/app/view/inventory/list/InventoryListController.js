Ext.define('AmazSync.view.inventory.list.InventoryListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.inventory-list-inventorylist',

    reloadLocalInventory: function () {
        this.getView().getStore().reload();
    },
    removeLocation: function (location) {
        var me = this, view = me.getView();
        commonutil.apiCall('location/removeproductlocation', commonutil.DELETE, location, view)
            .then((res) => {
                Ext.toast('Location removed successfully');
                me.reloadLocalInventory();
            })
            .catch((err) => {
                Ext.toast('Enable to remove');
            })
    },
    saveBinLocation: function (location) {
        var me = this, view = me.getView();
        commonutil.apiCall('location/updateProductlocation', commonutil.POST, location, view)
            .then((res) => {
                Ext.toast('Location saved successfully');
                me.reloadLocalInventory();
            })
            .catch((err) => {
                Ext.toast('Enable to Save');
            })
    },

    updateBinlocation: function (combo, newValue, oldValue) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var record = combo.ownerCt.context.record;
        
        var location = {
            warehouseId: vm.get('defaultWarehouse'),
            sku: combo.ownerCt.context.record.get('sellerSKU'),
            locationid:combo.getSelectedRecord()? combo.getSelectedRecord().get('id'):null
        }

        if (!Ext.isEmpty(newValue)) {
            commonutil.apiCall('location/validatebilocation', commonutil.GET, location, view)
                .then((res) => {                    
                    var products = JSON.parse(res);
                    if (products && products[0] && !Ext.isEmpty(products[0].sellerSKU)) {
                        var storeIndex = combo.ownerCt.context.store.find('sellerSKU',products[0].sellerSKU);
                        Ext.create('Ext.window.Window', {
                            modal: false,
                            title: 'Warning!',
                            closeable: true,
                            layout: 'center',
                            padding: 10,
                            buttonAlign: 'center',
                            items: [
                                {
                                    xtype: 'label',
                                    minWidth: 400,
                                    margin: '0 0 10px 0',
                                    html: `Selected location is associted with ${products[0].sellerSKU}. Are you sure you want to proceed? It will remove the location of sku ${products[0].sellerSKU}`
                                }
                            ],
                            buttons: [{
                                text: `Open Product ${products[0].sellerSKU}`,
                                handler: function () {
                                    record.set('binlocationname', null);
                                    combo.setValue(null);
                                    me.editProduct(null, storeIndex, null);                                    
                                }

                            }, {
                                text: 'Remove',
                                handler: function () {
                                    me.removeLocation(location);
                                    me.saveBinLocation(location);
                                    this.up('window').close();
                                }
                            }, {
                                text: 'Cancel',
                                handler: function () {
                                    combo.setValue(null);
                                    record.set('binlocationname', null);
                                    me.reloadLocalInventory();
                                    this.up('window').close();
                                }
                            }]
                        }).show();
                    }
                    else {
                        me.saveBinLocation(location);
                    }

                })
                .catch((err) => {
                    Ext.toast('Enable to fetch');
                })
        }
        else {
            me.saveBinLocation(location);
        }
    },
    updateInventoryStock: function (cmp, newValue, oldValue, eOpts) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var record = cmp.ownerCt.context.record.getData();
        var inventoryProductListStore = Ext.getStore('inventoryProductListStore');

        var stock = {
            sku: record['sellerSKU'],
            warehouseId: vm.get('defaultWarehouse'),
            locationid: record['locationid'],
            stock: cmp.getValue(),
            masterSKU: record['masterSKU']
        }
        // if (Ext.isEmpty(record['locationid'])) {
        //     Ext.toast('Please select location before update stock');
        //     cmp.reset();
        //     return false;
        // }
        commonutil.apiCall('location/updateInventory', commonutil.POST, stock, view)
            .then((res) => {
                Ext.toast('Stock updated successfully');
                inventoryProductListStore.reload();
            })
            .catch((err) => {
                Ext.toast('Enable to update');
            })
    },
    updateMasterSKU: function (cmp, newValue, oldValue, eOpts) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var record = cmp.ownerCt.context.record.getData();
        var inventoryProductListStore = Ext.getStore('inventoryProductListStore');

        var stock = {
            sku: record['sellerSKU'],
            warehouseId: vm.get('defaultWarehouse'),
            locationid: record['locationid'],
            stock: record['stock'],
            masterSKU: cmp.getValue(),
        }
        // if (Ext.isEmpty(record['locationid'])) {
        //     Ext.toast('Please select location before update stock');
        //     cmp.reset();
        //     return false;
        // }
        commonutil.apiCall('location/updateInventory', commonutil.POST, stock, view)
            .then((res) => {
                Ext.toast('Stock updated successfully');
                inventoryProductListStore.reload();
            })
            .catch((err) => {
                Ext.toast('Enable to update');
            })
    },
    editProduct: function (grid, rowIndex, colIndex) {
        var me = this, view = me.getView(), store = view.getStore();
        var product = store.getAt(rowIndex);
        var emtyCheckList = ['EAN', 'packageWeight', 'itemNote', 'UPC', 'isActive', 'amazonPrepInstructions'];

        var productDetailView = Ext.create('AmazSync.view.products.productDetail.productDetail', {
            title: product.get('sellerSKU'),
            listeners: {
                beforeclose: 'beforeclose'
            }
        });
        var productData = product.getData();
        productData['dimensionsLLocal'] = "";
        productData['dimensionsL'] = "";
        productData['dimensionsWLocal'] = "";
        productData['dimensionsW'] = "";
        productData['dimensionsHLocal'] = "";
        productData['dimensionsH'] = "";
        productData['tag'] = productData['tag'].split(',');
        if (!Ext.isEmpty(productData['expirationDateRequired'])) {
            productData['expirationDateRequired'] == 1 ? "Yes" : "No";
        }
        if (!Ext.isEmpty(productData['dimensions'])) {
            var dimensions = JSON.parse(productData['packageDimensions']);
            productData['dimensionsL'] = dimensions['Length'].Value;
            productData['dimensionsW'] = dimensions['Width'].Value;
            productData['dimensionsH'] = dimensions['Height'].Value;
        }
        if (!Ext.isEmpty(productData['dimensionsLocal'])) {

            var dimensions = JSON.parse(productData['dimensionsLocal']);
            productData['dimensionsLLocal'] = dimensions['Length'];
            productData['dimensionsWLocal'] = dimensions['Width'];
            productData['dimensionsHLocal'] = dimensions['Height'];
        }
        if (productData['productIdType'] == 3) {
            productData['UPC'] = productData['productId'];
        }
        if (productData['productIdType'] == 4) {
            productData['EAN'] = productData['productId']
        }
        if (!Ext.isEmpty(productData['packageWeight'])) {

            var packageWeight = JSON.parse(productData['packageWeight']);
            productData['packageWeight'] = packageWeight['Value'];
        }
        else {

            productData['packageWeight'] = "N/A";
        }

        productData['isActive'] = productData['isActive'] == 1 ? "Yes" : "No";
        for (var key in productData) {

            if (Ext.isEmpty(productData[key]) && emtyCheckList.includes(key) > 0) {
                productData[key] = 'N/A';
            }

        }

        productDetailView.getViewModel().set(productData);
        navigation.addComponent({
            productDetailView,
            directComponent: true,
            tabName: product.get('sellerSKU')
        });
    },
    viewKit: function (grid, rowIndex, colIndex) {
        var me = this, view = me.getView(), store = view.getStore(), vm = me.getViewModel();
        var product = store.getAt(rowIndex);
        var win = Ext.create('Ext.window.Window', {
            title: 'Kit',
            items: [{
                xtype: 'kit',
                parentProduct: product.getData(),
                parentSource: 'inventory',
                warehouseId: vm.get('defaultWarehouse')
            }],
            width: '90%',
            height: Ext.getBody().getHeight() - 200,
            listeners: {
                close: function () {
                    store.reload();
                }
            }
        });
        win.show();
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
                //modal: true,
                floating: true,
                layout: 'fit',
                listeners: {
                    blur: function (window) {
                        try {
                            window && window.close();
                        }
                        catch (e) {

                        }
                    }
                },
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
        else if (e.getTarget().getAttribute('target') == "openKit") {
            this.viewKit(grid, rowIndex);
        }
    }
});
