
Ext.define('AmazSync.view.audit.AuditViewGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.auditViewGrid',
    bind: {
        store: '{historyStore}'
    },
    viewConfig: {
        emptyText: 'No history found'
    },
    reference: 'auditGrid',
    columns: []
});
