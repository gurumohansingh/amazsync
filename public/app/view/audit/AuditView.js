
Ext.define('AmazSync.view.audit.AuditView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.auditView',
    requires: [
        'AmazSync.view.audit.AuditViewController',
        'AmazSync.view.audit.AuditViewModel'
    ],

    controller: 'audit-auditview',
    viewModel: {
        type: 'audit-auditview'
    },
    layout: 'border',
    items: [{
        xtype: 'panel',
        width: '100%',
        region: 'north',
        layout: {
            type: 'hbox',
            pack: 'center',
        },
        items: [{
            xtype: 'datefield',
            fieldLabel: 'From',
            format: 'm/d/Y',
            labelAlign: 'left',
            value: new Date(),
            reference: 'fromDate',
            listeners: {
                change: 'fetchHistoryData'
            }
        }, {
            xtype: 'datefield',
            fieldLabel: 'To',
            format: 'm/d/Y',
            labelAlign: 'left',
            value: new Date(),
            reference: 'toDate',
            listeners: {
                change: 'fetchHistoryData'
            }
        }, {
            xtype: 'combo',
            fieldLabel: 'Sync Type',
            labelAlign: 'left',
            forceSelection: true,
            valueField: 'type',
            reference: 'type',
            displayField: 'name',
            bind: {
                store: '{typeStore}'
            },
            listeners: {
                change: 'fetchHistoryData'
            }
        }, {
            xtype: 'textfield',
            fieldLabel: 'Search By',
            labelAlign: 'left',
            name: 'sreachBy',
            reference: 'searchFilter',
            triggers: {
                clear: {
                    cls: 'x-form-clear-trigger',
                    handler: function () {
                        this.setValue(null);
                    }
                }
            },
            listeners: {
                change: {
                    fn: 'fetchHistoryData',
                    buffer: 1000,
                }

            }
        },
        {
            xtype: 'checkbox',
            fieldLabel: 'Changed Only',
            reference: 'chageOnly',
            inputValue: true,
            labelAlign: 'left',
            listeners: {
                change: 'filterHistoryData'
            }
        }
        ]
    }, {
        xtype: 'auditViewGrid',
        region: 'center'
    }]

});
