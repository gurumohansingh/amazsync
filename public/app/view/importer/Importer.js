
Ext.define('AmazSync.view.importer.Importer', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.importer',
    cls: 'importer',
    requires: [
        'AmazSync.view.importer.ImporterController',
        'AmazSync.view.importer.ImporterModel',
        'AmazSync.view.importer.Summary',
        'AmazSync.view.importer.Mapping',
        'AmazSync.view.importer.ImporterType',
        'Ext.ux.CellDragDrop'
    ],

    controller: 'importer-importer',
    viewModel: {
        type: 'importer-importer'
    },
    cls: 'importer',
    layout: 'card',
    vertical: true,
    height: '100%',
    width: '100%',
    items: [
        {
            xtype: 'importerType',
            title: 'Import Type',
            titleAlign: 'center'

        },
        {
            xtype: 'panel',
            bind: {
                title: '<span style="color:red">{mappingMessage}<span>',
            },
            layout: {
                type: 'hbox',
                pack: 'center',
            },
            height: '100%',
            width: '100%',
            items: [{
                xtype: 'columnMapping',
                titleAlign: 'center',
                width: '100%',
                height: '100%',

            }]

        },
        {
            xtype: 'importSummary',
            title: 'Import Summary',
            titleAlign: 'center'
        }
    ],
    buttonAlign: 'center',
    buttons: [{
        text: '<< Back',
        margin: '0 50px  0 0',
        handler: 'loadPrevoius',
        bind: {
            disabled: '{disabledPrevious}'
        }
    }, {
        text: 'Next >>',
        margin: '0 0 0 50px',
        handler: 'loadNext',
        bind: {
            disabled: '{disabledNext}'
        }
    }]

});
