
Ext.define('AmazSync.view.utility.LastSyncGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.lastSyncGrid',
    title: 'Last 10 Sync History',
    titleAlign: 'center',
    forceFit: true,
    tools: [{
        xtype: 'button',
        text: 'Reload',
        iconCls: 'x-fa fa-sync fontcolorgreen',
        tooltip: 'Refresh',
        handler: 'reloadLastSync',
        margin: '0 0 0 10px'
    }],
    bind: {
        store: '{lastSynchStore}'
    },
    columns: [{
        text: 'Execute By',
        dataIndex: 'username'
    }, {
        text: 'Type',
        dataIndex: 'type'
    }, {
        xtype: 'datecolumn',
        text: 'Start Time',
        dataIndex: 'start_time',
        format: 'm/d/Y g: i a'
    }, {
        xtype: 'datecolumn',
        text: 'End Time',
        dataIndex: 'end_time',
        format: 'm/d/Y g: i a'
    }, {
        text: 'Staus',
        dataIndex: 'status'
    }]
});
