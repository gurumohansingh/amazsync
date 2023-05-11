Ext.define('AmazSync.view.auth.users.role.RolePanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.auth-users-role-rolepanel',
    init: function () {
        var me = this, vm = me.getViewModel();
        var rolse = me.getView().user.get('role').split(',');
        vm.set('roles', rolse);
        Ext.getStore('rolesStore').load();
    },

    saveRole: function () {
        var me = this;
        vm = me.getViewModel();

        var params = {
            email: me.getView().user.get('email'),
            roles: vm.get('roles')
        };
        commonutil.apiCall('admn/updaterole', "POST", params, me.getView()).then(responce => {
            me.getView().paraentStore.reload();
            Ext.toast('Save Successfully');
            me.getView().close();
        });
    },
    sortValues: function (cmp, newValue, oldValue, eOpts) {
        newValue && newValue.sort()
    }
});
