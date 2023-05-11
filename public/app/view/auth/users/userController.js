Ext.define('AmazSync.view.auth.users.userController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.auth-users-user',
    init: function () {
        var me = this;
        vm = me.getViewModel();
        vm.getStore('allUsers').load();
    },
    reloadUser: function () {
        var me = this;
        vm = me.getViewModel();
        
        vm.getStore('allUsers').reload();
    },
    disableEnable: function (grid, rowIndex, colIndex) {
        var me = this;
        vm = me.getViewModel();
        var rec = grid.getStore().getAt(rowIndex);
        var params = {
            Id: rec.get('ID'),
            status: rec.get('enable') == 1 ? 0 : 1
        };
        commonutil.apiCall('admn/enabledisableuser', "POST", params, grid).then(responce => {
            vm.getStore('allUsers').reload();
        });
    },
    editRole: function (grid, rowIndex, colIndex) {
        var me = this;
        vm = me.getViewModel();
        var rec = grid.getStore().getAt(rowIndex);

        Ext.create('AmazSync.view.auth.users.role.RolePanel', {
            user: rec,
            title: `Edit Role for ${rec.get('email')}`,
            paraentStore: grid.getStore()
        }).show();
    },
    addNewUser:function(btn){
        var me = this;
        
        var win=Ext.create('Ext.window.Window',{
            items:[{
                xtype:'newUser'
            }]
        })
        win.show()
    },
    removeUser: function (grid, rowIndex, colIndex) {
            var me = this;
            vm = me.getViewModel();
            var rec = grid.getStore().getAt(rowIndex);
            var params = {
                Id: rec.get('ID')
            };
            Ext.MessageBox.show({
                title: 'Delete User',
                msg: `Are you sure you want to delete <b>${rec.get('email')} </b>?`,
                buttons: Ext.MessageBox.OKCANCEL,
                icon: Ext.MessageBox.WARNING,
                fn: function(btn){
                    if(btn == 'ok'){
                        commonutil.apiCall('admn/deleteUser', "DELETE", params, grid).then(responce => {
                            vm.getStore('allUsers').reload();
                        });
                    } else {
                        return;
                    }
                }
            });
           
        },
    
});
