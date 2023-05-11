Ext.define('AmazSync.view.user.login.loginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.user-login-login',
    init: function () {
        var me = this, vm = me.getViewModel(), view = me.getView(), form = view.getForm();

        view.setHidden(true);
        var token = tokenStorage.retrieve();
        if (Ext.isEmpty(token)) {
            view.setHidden(false);
            view.setLoading(false)
            return false;
        }
        view.setLoading(true)
        Ext.Ajax.request({
            url: commonutil.getUrl("users/validateToken"),
            headers: {
                "authorization": token
            },
            success: function (response) {
                
                view.setLoading(false);
                var responseText = JSON.parse(response.responseText);
                view.destroy();
                var mainview = Ext.create('AmazSync.view.main.Main');
                me.setRoles(responseText.userRoles, mainview.getViewModel());
                mainview.getViewModel().set('userName', responseText.userName);
            },
            failure: function (response) {
                view.setLoading(false)
                view.setHidden(false);
            }
        })
    },

    showRegister: function () {
        var vm = this.getViewModel();
        vm.set('hideResiter', false);
        vm.set('hideLogin', true);
    },
    login: function (btn) {
        var me = this, vm = me.getViewModel(), view = me.getView(), form = view.getForm();
        if (form.isValid()) {
            view.setLoading(true);
            Ext.Ajax.request({
                url: commonutil.getUrl("users/login"),
                params: form.getValues(),
                success: function (response) {
                    view.setLoading(false);
                    var res = JSON.parse(response.responseText);
                    if (Ext.isEmpty(res.token)) {
                        vm.set("error", "Something wrong. Please contact to Admin");
                        return false
                    }
                    tokenStorage.save(res.token);
                    view.destroy();
                    Ext.Ajax.on('beforerequest', function (conn, options) {
                        if (options.headers) {
                            options.headers['Authorization'] = tokenStorage.retrieve() ? tokenStorage.retrieve() : "";
                        }
                        else {
                            options['headers'] = {};
                            options.headers['Authorization'] = tokenStorage.retrieve() ? tokenStorage.retrieve() : "";
                        }

                    });
                    var mainview = Ext.create('AmazSync.view.main.Main');
                    me.setRoles(res.userRoles, mainview.getViewModel());
                    mainview.getViewModel().set('userName', res.userName);
                },
                failure: function (response) {
                    view.setLoading(false);
                    vm.set("error", response.responseText);
                }
            });
        } else {

        }
    },
    setRoles: function (userRoles, vm) {

        var roles = userRoles ? userRoles.split(',') : "";
        roles.forEach(item => {
            var key = `role${item.replaceAll(' ', '')}`
            vm.set(key, false);
        })
    }
});
