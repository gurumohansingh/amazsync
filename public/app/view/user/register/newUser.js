
Ext.define('AmazSync.view.user.register.newUser',{
    extend: 'Ext.form.Panel',
    alias:'widget.newUser',
    requires: [
        'AmazSync.view.user.register.newUserController',
        'AmazSync.view.user.register.newUserModel'
    ],

    controller: 'user-register-newuser',
    viewModel: {
        type: 'user-register-newuser'
    },
    cls:'formborder',
    bind:{
        hidden:'{hideResiter}'
    },
    padding: 20,
    border:false,
    buttonAlign:'center',
    items:[{
        xtype: 'component',
        html: '<b>Seller SKU is an Inventory Warehouse Management <br>System for Amazon Sellers.</b>'
    },{
        xtype:'textfield',
        fieldLabel:'Email as user name',
        vtype:'email',
        allowBlank:false,
        name:'email'
    },{
        xtype:'textfield',
        fieldLabel:'First Name',
        allowBlank:false,
        name:'firstname'
    },{
        xtype:'textfield',
        fieldLabel:'Middle Name',
        name:'middlename'
    },{
        xtype:'textfield',
        fieldLabel:'Last Name',
        name:'lastname'
    },{
        xtype:'textfield',
        fieldLabel:'Password',
        inputType:'password',
        allowBlank:false,
        name:'password'
    },{
        xtype:'textfield',
        inputType:'password',
        fieldLabel:'Confirm Password',
        allowBlank:false,
        name:'confirmPassword'
    },{
        xtype:'component',
        bind:{
            html:'{error}',
        },
        cls:'error'
    }],
    buttons:[{
        text:'Submit',
        formBind:true,
        handler:'addNewUser'
    }], 
   
});
