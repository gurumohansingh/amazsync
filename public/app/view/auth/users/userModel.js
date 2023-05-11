Ext.define('AmazSync.view.auth.users.userModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.auth-users-user',
    data: {
        name: 'AmazSync',
    },
    stores: {
        allUsers: {
            method: 'GET',
            type: 'ajaxStore',
            proxy: {
                type: 'ajax',
                url: commonutil.getUrl('admn/getallusers'),
                reader: {
                    type: 'json',
                    rootProperty: ''
                }
            }
        },
    }
});
