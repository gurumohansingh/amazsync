/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('AmazSync.view.main.Main', {
    extend: 'Ext.container.Viewport',
    xtype: 'app-main',
    requires: [
        'Ext.window.MessageBox',
        'AmazSync.view.main.centerPanel.centerPanel',
        'AmazSync.view.main.MainController',
        'AmazSync.view.main.MainModel',
        'AmazSync.view.header.header'
    ],
    controller: 'main',
    viewModel: 'main',
    layout: 'border',
    items: [{
        xtype: 'headerToolBar',
        region: 'north',
        resizable: false,
    },
    {
        xtype: 'centerPanel',
        region: 'center',
        resizable: false,
    },{
        xtype:'panel',
        region: 'south',
        height:30,
        layout:{
            type:'hbox',
            pack:'center',
        },
        items: [{
            xtype:'component',
            margin: '2px 2px 2px 2px',
            html:'<a href="/Terms.htm" target="_blank" rel="noopener noreferrer">Terms</a>',
            
        },{
            xtype:'component',
            margin: '2px 2px 2px 10px',
            html:'<a href="/Privacy_Policy.htm" target="_blank" rel="noopener noreferrer">Privacy</a>'
        }]
    }]
});
