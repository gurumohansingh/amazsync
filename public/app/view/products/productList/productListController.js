Ext.define('AmazSync.view.products.productList.productListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.products-productlist-productlist',
    init: function () {
        var me = this, view = me.getView(), store = view.getStore();
        store.on('load', () => {
            me.updateCount();
        }, me)
        store.load();
        var vm = this.getViewModel();
    },
    syncProducts: function (tool) {
        var me = this, view = me.getView(), store = view.getStore();
        store.reload();
        me.updateCount();
    },
    updateCount: function () {
        var me = this, view = me.getView(), store = view.getStore(),
            vm = me.getViewModel();
        vm.set('totalCount', store.getCount());
    },

    nanoUpdateInventory: function (btn) {
        Ext.Msg.show({
            title: 'Updating Local Inventory',
            message: 'Do you want to run process in background?',
            buttons: Ext.Msg.YESNOCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn === 'yes') {
                    commonutil.apiCall('mws/nanosync', "GET", null, null).then(responce => {
                        Ext.getStore('productList').reload();
                        Ext.Msg.alert('Local Inventory', 'Local SKU Updated successfully.');
                    })
                }
            }
        });
    },
    editProduct: function (grid, rowIndex, colIndex) {
        try {
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
            if (!Ext.isEmpty(productData['packageDimensions'])) {
                var dimensions = JSON.parse(productData['packageDimensions']);
                productData['dimensionsL'] = dimensions['Length'] ? dimensions['Length'].Value : 0;
                productData['dimensionsW'] = dimensions['Width'] ? dimensions['Width'].Value : 0;
                productData['dimensionsH'] = dimensions['Height'] ? dimensions['Height'].Value : 0;
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
        }
        catch (e) { console.log(e); }
    },

    getProductSuppliers: function (grid, rowIndex, colIndex) {
        var me = this, view = me.getView(), store = view.getStore();
        var product = store.getAt(rowIndex);
        view.up('productsPanel').lookupReference('supplierList').getproductsuppliers(product.get('sellerSKU'), product.get('casePackQuantity'));
    },

    viewKit: function (grid, rowIndex, colIndex) {
        var me = this, view = me.getView(), store = view.getStore();
        var product = store.getAt(rowIndex);
        var win = Ext.create('Ext.window.Window', {
            title: 'Kit',
            items: [{
                xtype: 'kit',
                parentProduct: product.getData(),
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

    synchSku: function (grid, rowIndex, colIndex) {
        var me = this, view = me.getView(), store = view.getStore();
        var product = store.getAt(rowIndex);
        commonutil.apiCall(`mws/sync/${product.get('sellerSKU')}`, commonutil.GET, null, view)
            .then((res) => {
                Ext.toast('Updated Successfully');
                //productSuppliersStore.reload();
            })
            .catch((err) => {
                Ext.toast('Enable to delete');
            })
    },

    opneImage: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {

        if (e.getTarget().tagName.toUpperCase() === "IMG") {
            var imageUrl = record.get('imageUrl').split(".");
            imageUrl.splice(imageUrl.length - 2, 1);
            if (imageUrl.length == 0) {
                Ext.Msg.alert("Info", "No image found");
                return false;
            }

            var win = Ext.create('Ext.window.Window', {
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
    },

    addNewsku: function (btn) {
        try {
            var me = this, view = me.getView(), store = view.getStore();


            var productDetailView = Ext.create('AmazSync.view.products.productDetail.productDetail', {
                title: "New SKU",
                newSku: true,
                listeners: {
                    beforeclose: 'beforeclose'
                }
            });
            navigation.addComponent({
                productDetailView,
                directComponent: true,
                tabName: 'New SKU'
            });
        }
        catch (e) { console.log(e); }
    },

});
