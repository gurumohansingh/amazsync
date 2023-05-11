
Ext.define('AmazSync.view.importer.Summary', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.importSummary',
    layout: 'fit',
    title: 'Import Summary',
    titleAlign: 'center',
    scrollable: true,
    sortableColumns: false,
    columnLines: true,
    rowLines: true,
    forceFit: true,
    bind: {
        store: '{summaryStore}'
    },
    columns: [{
        text: 'Message',
        dataIndex: 'error',

    }, {
        text: 'Type',
        dataIndex: 'type',
    }]
});
