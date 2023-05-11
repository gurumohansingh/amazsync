
Ext.define('AmazSync.view.util.tokenStorage',{
    singleton: true,
    storageKey: 'json-web-token',
    alternateClassName:'tokenStorage',
    clear: function () {
        localStorage.removeItem(this.storageKey);
    },

    retrieve: function() {
        return localStorage.getItem(this.storageKey);
    },

    save: function (token) {
        localStorage.setItem(this.storageKey, token);
    }
});
