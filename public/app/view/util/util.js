
Ext.define('AmazSync.view.util', {
    singleton: true,
    alternateClassName: 'commonutil',
    userRoles: null,
    getUrl: function (url) {
        //var apiHost = "http://localhost:3000/"
        var apiHost = window.location.href;
        return apiHost.concat(url);
    },
    POST: 'POST',
    GET: "GET",
    DELETE: 'DELETE',
    PUT: 'PUT',
    apiCall: function (url, type, params, view) {
        console.log("params", params);
        view && view.setLoading(true);
        return new Promise((resolve, reject) => {
            Ext.Ajax.request({
                url: commonutil.getUrl(url),
                method: type,
                timeout: 600000,
                headers: {
                    Authorization: tokenStorage.retrieve()
                },
                params: params,
                success: function (response) {
                    view && view.setLoading(false);
                    resolve(response.responseText);
                },
                failure: function (response) {
                    view && view.setLoading(false);
                    reject(response);
                }
            })
        })
    },

    formCall: function (url, type, form, params = {}, files, view, standardSubmit) {
        return new Promise((resolve, reject) => {
            params = !params ? {} : params;
            if (Ext.isEmpty(form)) {
                form = Ext.create('Ext.form.Panel');
            }
            params['Authorization'] = tokenStorage.retrieve();
            form.submit({
                standardSubmit: standardSubmit,
                url: commonutil.getUrl(url),
                method: type,
                params: params,
                failure: function (response, e, opt) {
                    if (e.response.responseText == "Unauthorized") {
                        Ext.Msg.alert("Error", "You are not authorized. Please singout and login again")
                        reject("Operation failed");
                    }
                    if (e.response.status == 200 || e.response.status == 400) {
                        resolve(e.response.responseText);
                    } else {
                        Ext.Msg.alert("Error", "You are not authorized. Please singout and login again")
                        reject("Operation failed");
                    }
                }

            });
        })
    },
    roleValidate: function (role) {
        var roles = this.userRoles ? this.userRoles.split(',') : "";
        return !roles.includes(role);
    }

});
