Ext.define('AmazSync.view.audit.AuditViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.audit-auditview',

    fetchHistoryData: function () {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var grid = me.lookupReference('auditGrid');
        var fromDate = view.lookupReference('fromDate').getValue(),
            toDate = view.lookupReference('toDate').getValue(),
            type = view.lookupReference('type').getValue(),
            searchFilter = view.lookupReference('searchFilter').getValue(),
            store = vm.getStore('historyStore');
        if (Ext.isEmpty(fromDate) || Ext.isEmpty(toDate) || Ext.isEmpty(type)) {
            Ext.toast("Please select from date, to date and Type")
            return false;
        }
        toDate.setHours(23);
        toDate.setMinutes(59);
        store.getProxy().setExtraParams({ fromDate: fromDate, toDate: toDate, type: type, searchFilter: searchFilter });
        store.removeAll();
        store.clearFilter();
        grid.reconfigure(store, []);
        store.load((records) => me.prepareData(records, grid, store));
        view.lookupReference('chageOnly').setValue(null);
    },

    prepareData: function (data, grid, store) {
        try {
            var gridColumn = [{
                xtype: 'datecolumn',
                text: 'Date',
                format: 'm/d/Y g: i a',
                dataIndex: 'date'
            }, {
                text: 'Sync Type',
                dataIndex: 'type'
            }];
            var columnsList = [];
            data.forEach((record) => {

                var oldValue = JSON.parse(record.get('old_value'));
                var newValue = JSON.parse(record.get('new_value'));
                record.set('oldValue', oldValue);
                record.set('newValue', newValue);
                var oldKeys = oldValue ? Object.keys(oldValue) : [];
                var newKeys = newValue ? Object.keys(newValue) : [];
                columnsList = [...new Set([...columnsList, ...oldKeys, ...newKeys])]
            });

            columnsList.forEach(column => {
                gridColumn.push({
                    text: column,
                    columns: [{
                        text: 'Old Value',
                        renderer: function (value, metaData, record) {
                            if (record.get('newValue')[column] != record.get('oldValue')[column]) {
                                metaData.style = "background-color:#FFCCCB;";
                                record.set('isequal', true)
                            }
                            return record.get('oldValue')[column]
                        }
                    }, {
                        text: 'New Value',
                        renderer: function (value, metaData, record) {
                            if (record.get('newValue')[column] != record.get('oldValue')[column]) {
                                metaData.style = "background-color:#FFCCCB;";
                                record.set('isequal', true)
                            }
                            return record.get('newValue')[column]
                        }
                    }]
                })
            });
            grid.reconfigure(store, gridColumn);

        }
        catch (err) { }
    },

    filterHistoryData: function () {
        var me = this, view = me.getView(), vm = me.getViewModel();
        var newValue = view.lookupReference('chageOnly').getValue(),
            store = vm.getStore('historyStore');
        store.clearFilter();
        console.log(newValue);
        if (newValue) {
            store.filter('isequal', true)
        }

    }

});
