Ext.define('AmazSync.view.importer.ImporterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.importer-importer',
    loadPrevoius: function () {
        var me = this, vm = me.getViewModel(), view = me.getView();
        var currentTab = vm.get('currentpanel');
        if (currentTab == 0) {
            return false;
        }
        else {
            vm.set('currentpanel', --currentTab);
        }
        view.setActiveItem(currentTab);
    },
    loadNext: function () {
        var me = this, vm = me.getViewModel(), view = me.getView();
        var currentTab = vm.get('currentpanel');
        if (currentTab == 2) {
            return false;
        }
        else {
            vm.set('currentpanel', ++currentTab);
        }

        view.setActiveItem(currentTab);
    },
    loadColumns: function (combobox, newValue, oldValue, eOpts) {
        var me = this, vm = me.getViewModel(), view = me.getView();
        if (newValue == 'products')
            vm.set('mappingMessage', ' Mapping - Main database colum is sellerSKU. It will update and add the record base on sellerSKU colomn.')
        if (newValue == 'inventorystock') {
            vm.set('wareHouse', false);
            vm.set('mappingMessage', ' Mapping - Main database colum is warehouseId,locationid and sku. It will update and add the record base on warehouseId,locationid and sku colomn. Select wareHouse from List.')
        }
        else {
            vm.set('wareHouse', true);
        }

        if (newValue == 'suppliers') {
            vm.set('addMissingSuppliers', false);
            vm.set('mappingMessage', ' Mapping - Main database colum is supplierID/name. It will update and add the record base on supplierID/Name colomn.')
        }
        else {
            vm.set('addMissingSuppliers', true);
        }
        if (newValue == 'suppliersList')
            vm.set('mappingMessage', ' Mapping - Main database colum is supplierName. It will update and add the record base on supplierName colomn.')
        commonutil.apiCall('importer/getcolumslist', "GET", { tableName: newValue }, this.getView())
            .then(responce => {
                const jsonResponce = JSON.parse(responce);
                vm.set('tableColumns', jsonResponce['tableColumns'])
            });
    },
    getFileHeader: function (btn) {
        var me = this, vm = me.getViewModel(), view = me.getView();
        const form = btn.up('form');
        commonutil.formCall('file/getfileHeader', commonutil.GET, form, null, view, true)
            .then((apiResponse) => {
                const jsonResponce = JSON.parse(apiResponse);
                vm.set('csvColumns', jsonResponce['csvColumns']);
                vm.set('fileData', jsonResponce['fileData']);
                me.calculateColumns();
                me.loadNext();
            })
    },

    calculateColumns: function () {

        var me = this, vm = me.getViewModel(), view = me.getView();
        var grid = view.lookupReference('columnMappingGrid');
        var allcsvColumns1 = 0;
        var colIndex = 0;
        var gridColumns = [{
            text: '<span style="align="center;">Database Columns</span>',
            dataIndex: 'databaseColumns',
            width: 250,
            locked: true,
            renderer: function (value, metaData, record) {
                metaData.style = "background-color:#ff6666;";
                return value;
            }

        }, {
            text: 'CSV Columns',
            dataIndex: 'csvColumns',
            type: 'string',
            width: 250,
            locked: true,
            renderer: function (value, metaData, record) {
                metaData.style = "background-color:#4dff4d;";
                return value;
            }
        }, {
            text: 'Uploaded CSV',
            dataIndex: 'allcsvColumns',
            type: 'string',
            width: 250, renderer: function (value, metaData, record) {
                metaData.style = "background-color:#ffc966;";
                return value
            }

        }];
        view.setLoading(true);
        const tableColumns = vm.get('tableColumns');
        const csvColumns = vm.get('csvColumns');
        var data = [];
        tableColumns.forEach((column) => {
            data.push({
                databaseColumns: column,
                csvColumns: "",
                allcsvColumns: ""
            })

        });
        view.setLoading(false);
        var store = vm.getStore('columnMapping');
        store.loadData(data);
        var dbColumnCount = store.getCount();
        var id = 0;
        csvColumns.forEach((csvcolName) => {
            var record = store.findRecord('databaseColumns', csvcolName);
            if (record) {
                record.set('csvColumns', csvcolName);
            }

            else {
                if (dbColumnCount < id + 1) {
                    if (id % dbColumnCount == 0) {
                        allcsvColumns1 = 0
                        colIndex++;
                        gridColumns.push({
                            text: 'Uploaded CSV' + colIndex,
                            dataIndex: 'csv' + colIndex,
                            type: 'string',
                            width: 250,
                            renderer: function (value, metaData, record) {
                                metaData.style = "background-color:#ffc966;";
                                return value
                            }
                        });
                    }
                    store.getAt(allcsvColumns1).set('csv' + colIndex, csvcolName);
                    allcsvColumns1++;
                } else {
                    store.getAt(id).set('allcsvColumns', csvcolName)
                }
                id++;
            }
        })
        grid.reconfigure(store, gridColumns);
        grid.getView().refresh();
    },

    startImport: function (btn) {
        var me = this, vm = me.getViewModel(), view = me.getView();
        let columns = {};
        const store = vm.getStore('columnMapping');
        const summaryStore = vm.getStore('summaryStore');
        store.each(async (record) => {
            var tabcol = record.get('databaseColumns'), csvCol = record.get('csvColumns')
            columns[tabcol] = csvCol
        })

        commonutil.apiCall('importer/import', "POST", { tableName: vm.get('importType'), missingLocation: vm.get('missingLocation') ? 1 : 0, replaceStock: vm.get('replaceStock') ? 1 : 0, addMissingSuppliersValue: vm.get('addMissingSuppliersValue') ? 1 : 0, wareHouse: vm.get('wareHouseId'), columnMapping: JSON.stringify(columns), fileData: JSON.stringify(vm.get('fileData')) }, this.getView())
            .then(responce => {
                const jsonResponce = JSON.parse(responce);
                summaryStore.loadData(jsonResponce);
                me.loadNext();
            });
    },
});
