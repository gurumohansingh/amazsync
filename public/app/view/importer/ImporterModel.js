Ext.define('AmazSync.view.importer.ImporterModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.importer-importer',
    data: {
        name: 'AmazSync',
        currentpanel: 0,
        tableColumns: [],
        csvColumns: [],
        allcsvColumns1: true,
        fileData: null,
        importType: null,
        mappingMessage: "",
        wareHouse: true,
        wareHouseId: null,
        missingLocation: false,
        addMissingSuppliers: true,
        addMissingSuppliersValue: false,
        replaceStock: false,
    },
    formulas: {
        disabledPrevious: {
            bind: '{currentpanel}',
            get: function (current) {
                return current == 0;
            }

        },
        disabledNext: {
            bind: '{currentpanel}',
            get: function (current) {
                console.log('currentpanel', current);
                return current == 2;
            }

        }
    },
    stores: {
        columnMapping: {
            defaultType: 'string',
            fields: [{
                name: 'databaseColumns'
            }, {
                name: 'csvColumns',
                type: 'string',
            }, {
                name: 'allcsvColumns',
                type: 'string'
            }, {
                name: 'csv1',
                type: 'string'
            }, {
                name: 'csv2',
                type: 'string'
            }, {
                name: 'csv3',
                type: 'string'
            }, {
                name: 'csv4',
                type: 'string'
            }, {
                name: 'csv5',
                type: 'string'
            }, {
                name: 'csv6',
                type: 'string'
            }, {
                name: 'csv7',
                type: 'string'
            }, {
                name: 'csv8',
                type: 'string'
            }, {
                name: 'csv9',
                type: 'string'
            }, {
                name: 'csv10',
                type: 'string'
            }, {
                name: 'csv11',
                type: 'string'
            }, {
                name: 'csv12',
                type: 'string'
            }, {
                name: 'csv13',
                type: 'string'
            }, {
                name: 'csv14',
                type: 'string'
            }, {
                name: 'csv15',
                type: 'string'
            }, {
                name: 'csv16',
                type: 'string'
            }, {
                name: 'csv17',
                type: 'string'
            }, {
                name: 'csv18',
                type: 'string'
            }, {
                name: 'csv19',
                type: 'string'
            }, {
                name: 'csv20',
                type: 'string'
            }, {
                name: 'csv21',
                type: 'string'
            }, {
                name: 'csv22',
                type: 'string'
            }],
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json'
                }
            }
        },
        summaryStore: {
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: ''
                }
            }
        }
    }

});
