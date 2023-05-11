
Ext.define('AmazSync.view.user.login.login', {
    extend: 'Ext.form.Panel',
    alias: 'widget.login',
    requires: [
        'AmazSync.view.user.login.loginController',
        'AmazSync.view.user.login.loginModel',
        'AmazSync.view.util'
    ],
    controller: 'user-login-login',
    viewModel: {
        type: 'user-login-login'
    },
    bind: {
        hidden: '{hideLogin}'
    },
    
    cls: 'formborder',
    layout: 'vbox',
    height: 350,
    padding: 20,
    margin: 5,
    buttonAlign: 'center',
    border: false,
    listeners: {
        // afterrender:function(form){
        //     form.setLoading("Authenticating");
        // }
    },
    items: [{
        xtype: 'component',
        html: '<b>Seller SKU is an Inventory Warehouse Management <br>System for Amazon Sellers.</b>'
    },{
        xtype: 'component',
        html: '<h1>Sign-In</h1>'
    }, {
        xtype: 'textfield',
        fieldLabel: 'Email or mobile phone number',
        allowBlank: false,
        name: 'user'
    },
    {
        xtype: 'textfield',
        fieldLabel: 'Password',
        inputType: 'password',
        allowBlank: false,
        name: 'password'
    }, {
        xtype: 'component',
        cls: 'error',
        bind: {
            html: '{error}'
        }
    }],
    buttons: [
        {
            text: 'Login',
            handler: 'login',
            iconCls: 'x-fa fa-user'
        }],
        dockedItems: [{
            xtype: 'panel',
            dock: 'bottom', 
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
