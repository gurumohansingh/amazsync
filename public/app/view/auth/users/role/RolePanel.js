
Ext.define('AmazSync.view.auth.users.role.RolePanel', {
    extend: 'Ext.window.Window',

    requires: [
        'AmazSync.view.auth.users.role.RolePanelController',
        'AmazSync.view.auth.users.role.RolePanelModel',
        'AmazSync.store.rolesStore'
    ],

    controller: 'auth-users-role-rolepanel',
    viewModel: {
        type: 'auth-users-role-rolepanel'
    },
    constrain: true,
    modal: true,
    buttonAlign: 'center',
    items: [{
        xtype: 'itemselector',
        buttons: ['add', 'remove'],
        store: 'rolesStore',
        displayField: 'name',
        scrollable: true,
        height: 200,
        width: 800,
        valueField: 'name',
        bind: {
            value: '{roles}'
        },
        msgTarget: 'side',
        fromTitle: 'Availabe Roles',
        toTitle: 'Selected Roles',
        listeners: {
            change: 'sortValues'
        }
    }
    ],
    buttons: [{
        xtype: 'button',
        text: 'Save',
        handler: 'saveRole',
        align: 'center',
    }]
});
