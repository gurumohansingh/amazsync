
Ext.define('AmazSync.view.user.user', {
    extend: 'Ext.container.Viewport',
    requires: [
        'AmazSync.view.user.userController',
        'AmazSync.view.user.userModel',
        'AmazSync.view.user.login.login',
        'AmazSync.view.user.register.newUser'
    ],
    controller: 'user-user',
    viewModel: {
        type: 'user-user'
    },
    layout:'center',
    items: [{
        xtype: 'login',
        reference:'login'
    }, {
        xtype: 'newUser',
        reference:'newUser',
        hidden:true,
        listeners:{
            showRegister:'showRegister',
            hideRegister:'hideRegister'
        }
    }]
});
