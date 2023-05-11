
Ext.define('AmazSync.view.importer.Mapping', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.columnMapping',
    layout: 'fit',
    scrollable: true,
    enableColumnHide: false,
    sortableColumns: true,
    columnLines: true,
    rowLines: true,
    width: '98%',
    bodyPadding: 10,
    reference: 'columnMappingGrid',
    items: [{
        xtype: 'button',
        text: 'Save'
    }],
    bind: {
        store: '{columnMapping}'
    },
    listeners: {
        cellmouseup(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            return false;
        }
    },
    viewConfig: {
        plugins: {
            celldragdrop: {
                // remove text from source cell and replace with value of emptyText
                applyEmptyText: true,
                dropBackgroundColor: 'green',
                noDropBackgroundColor: 'red',
                enforceType: true
            }
        }
    },
    columns: [],
    buttonAlign: 'center',
    buttons: [{
        text: 'Submit',
        handler: 'startImport'
    }]
});
