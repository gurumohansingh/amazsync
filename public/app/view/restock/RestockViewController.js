Ext.define('AmazSync.view.restock.RestockViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.restock-restockview',

    setRecentWarehouse: function () {

        var me = this, view = me.getView(), vm = me.getViewModel();
        Ext.getStore('warehouseStore').load();
        vm.set('defaultWarehouse', localStorage.getItem('sellerskuLastWareHouse'));
    },
    loadRestock: function (combo, newValue) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var marketPlace = view.lookupReference('marketPlace').getValue(),
            wareHouse = view.lookupReference('warehouse').getValue(),
            restockStore = Ext.getStore('restockStore');
        if (!Ext.isEmpty(marketPlace)) {
            restockStore.getProxy().setExtraParams({ wareHouse: wareHouse, marketPlace: marketPlace });
            restockStore.load((records) => {
                vm.set('totalCount', records.length);
                me.applyFilter();
            });
        }
    },

    opneImage: function (grid, record, element, rowIndex, e, eOpts) {

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

    applyFilter: function (radio, newValue) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var stockFilter = view.lookupReference('stockFilter').getValue()['stock'],
            searchFilterValue = view.lookupReference('searchFilter').getValue().toLowerCase().trim(),
            recommendedShipDate = view.lookupReference('recommendedShipDateOption').getValue()['recommendedShipDate'];
        var store = Ext.getStore('restockStore');
        store.clearFilter(true);
        /*var stockFilterCondition = true, searchFilter = true, recommendedShipDateFilter = true;
        store.filterBy((record) => {

            if (stockFilter == 1) {
                stockFilterCondition = record.get('stock') > 0
                if (!Ext.isEmpty(record.get('masterSKU'))) {
                    var masterRecord = store.queryRecords('sellerSKU', record.get('masterSKU'));
                    if (masterRecord.length > 0) {
                        stockFilterCondition = masterRecord[0].get('stock') > 0
                    }
                }
            }
            
            if (stockFilter == 2) {
                stockFilterCondition = record.get('stock') == 0 || Ext.isEmpty(record.get('stock'))
                if (!Ext.isEmpty(record.get('masterSKU'))) {
                    var masterRecord = store.queryRecords('sellerSKU', record.get('masterSKU'));
                    if (masterRecord.length > 0) {
                        stockFilterCondition = masterRecord[0].get('stock') == 0 || Ext.isEmpty(masterRecord[0].get('stock'));
                    }
                }
            }

            if (recommendedShipDate != "All" && !Ext.isEmpty(record.get('amz_recommended_order_date'))) {

                var recDate = new Date(record.get('amz_recommended_order_date'));
                var today = new Date();

                if (recommendedShipDate == "today") {
                    recommendedShipDateFilter = (Ext.Date.diff(today, recDate, 'd') <= 0);
                }

                if (recommendedShipDate == "next7") {
                    recommendedShipDateFilter = (Ext.Date.diff(today, recDate, 'd') <= 7);
                }

                if (recommendedShipDate == "next14") {
                    recommendedShipDateFilter = (Ext.Date.diff(today, recDate, 'd') <= 14);
                }

                if (recommendedShipDate == "next30") {
                    recommendedShipDateFilter = (Ext.Date.diff(today, recDate, 'd') <= 30);
                }

            }
            if (recommendedShipDate != "All" && Ext.isEmpty(record.get('amz_recommended_order_date'))) {
                recommendedShipDateFilter = false;
            }

            if (searchFilterValue.trim() == "") {
                searchFilter = true;
            }
            else {
                searchFilter = record.get('itemName') && record.get('itemName').toLowerCase().includes(searchFilterValue) || record.get('sellerSKU') && record.get('sellerSKU').toLowerCase().includes(searchFilterValue) || record.get('amazonASIN') && record.get('amazonASIN').toLowerCase().includes(searchFilterValue);
            }
            return stockFilterCondition && searchFilter && recommendedShipDateFilter;
        });*/
        if(newValue && typeof newValue !== 'object')
            store.getProxy().setExtraParam('searchParam', newValue.trim());
        else
        store.getProxy().setExtraParam('searchParam', null);
        store.load({
            params: {
                page: 1,
                start: 0,
                limit: 25                
            }
        });
        vm.set('totalCount', store.getCount())
    },

    onRecordSelect: function (grid, record, index, eOpts) {
        if (Ext.isEmpty(record.get('qty_to_send_amz'))) {
            var currectStock = record.get('stock');
            if (currectStock > record.get('amz_recommended_order_qty')) {
                record.set('qty_to_send_amz', record.get('amz_recommended_order_qty'));
            }
            else {
                record.set('qty_to_send_amz', currectStock);
            }
        }
    },
    onRecordDeSelect: function (grid, record, index, eOpts) {
        record.set('qty_to_send_amz', null);
    },

    fetchDataWithoutWareHouse: function (combo) {

        combo.setValue(null);
        this.loadRestock();
    },

    validateSendQty: function (editor, context, eOpts) {

        //if (context.record.get('masterSKU')) {
        var store = context.store;
        var masterSKU = context.record.get('masterSKU');
        var sellerSKU = context.record.get('amz_sku');
        var masterSkuRecord = store.queryRecords('amz_sku', masterSKU);

        var availableStock = masterSkuRecord.length > 0 ? masterSkuRecord[0].get('stock') : context.record.get('stock');

        var qtyToSend = 0;// context.value;


        if (masterSKU) {
            var masterSku = store.queryRecords('masterSKU', masterSKU);
            masterSku.forEach(rec => {
                qtyToSend += rec.get('qty_to_send_amz');
            });
            var mastreRecord = store.queryRecords('amz_sku', masterSKU)
            if (mastreRecord.length > 0) {
                qtyToSend += mastreRecord[0].get('qty_to_send_amz');
            }
        }
        else {
            var selfmasterSku = store.queryRecords('masterSKU', sellerSKU);
            selfmasterSku.forEach(rec => {
                qtyToSend += rec.get('qty_to_send_amz');
            });
            qtyToSend += context.value
        }
        if (qtyToSend > availableStock) {
            Ext.toast(`Inventory stock ${availableStock} of master/sku ${sellerSKU}  is less than entered quantity`);
            context.cancel = true;
            context.record.set('qty_to_send_amz', 0);
            return false;
        }
        if (context.value > 0) {
            var selected = context.grid.getSelection();
            selected.push(context.record);
            context.grid.setSelection(selected);
        }
    },

    createShipment: function (button) {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var restockStore = Ext.getStore('restockStore');
        var selectedRecord = button.up('grid').getSelectionModel().getSelected();
        var marketPlace = view.lookupReference('marketPlace').getValue(),
            wareHouse = view.lookupReference('warehouse').getValue();
        if (selectedRecord.length == 0) {
            Ext.toast('Please select atleast one product')
        } else {
            var win = Ext.create('AmazSync.view.virtualShipments.VirtualShipmentsView', {
                title: 'Virtual Shipments',
                listeners: {
                    close: () => {
                        restockStore.reload();
                    }
                }
            })
            win.fireEvent('addVirtualshipments', selectedRecord.items, marketPlace, wareHouse);
            win.show();
        }
    }
});
