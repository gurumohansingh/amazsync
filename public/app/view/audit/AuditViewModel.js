Ext.define('AmazSync.view.audit.AuditViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.audit-auditview',
    data: {
        name: 'AmazSync'
    },
    stores: {
        historyStore: {
            autoLoad: false,
            method: 'GET',
            type: 'ajaxStore',
            proxy: {
                type: 'ajax',
                url: commonutil.getUrl('history'),
                reader: {
                    type: 'json',
                    rootProperty: ''
                }
            },
        },
        typeStore: {
            autoLoad: true,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: ''
                }
            },
            data: [{
                type: 'Products', name: 'Products'
            }, {
                type: 'Restock', name: 'Restock'
            }]
        }
    }
});
