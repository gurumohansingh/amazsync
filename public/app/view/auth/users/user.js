
Ext.define('AmazSync.view.auth.users.user', {
    extend: 'Ext.grid.Panel',
    xtype: 'users',
    requires: [
        'AmazSync.view.auth.users.userController',
        'AmazSync.view.auth.users.userModel'
    ],

    controller: 'auth-users-user',
    viewModel: {
        type: 'auth-users-user'
    },
    title: 'Application Users',
    bind: {
        store: '{allUsers}'
    },
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    forceFit: true,
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype:'button',
            text: 'Add New User',
            iconCls: 'x-fa fa-plus fontcolorgreen',
            handler: 'addNewUser'
        },{
            xtype:'button',
            text: 'Reload Users',
            iconCls: 'x-fa fa-sync fontcolorgreen',
            handler: 'reloadUser'
        }]
    }],
    columns: [{
        text: 'User Name',
        dataIndex: 'firstname',
        renderer: function (value, metaData, record) {
            return `${value} ${record.get('middlename') ? record.get('middlename') : ""} ${record.get('lastname') ? record.get('lastname') : ""}`;
        }
    }, {
        text: 'User Email',
        dataIndex: 'email'
    }, {
        xtype: 'datecolumn',
        text: 'Create Date',
        dataIndex: 'creationdate',
        format: 'd M, Y g: i a'
    }, {
        text: 'Status',
        dataIndex: 'enable',
        renderer: function (value, metaData, record) {
            return value == 1 ? "Active" : "InActive";
        }
    }, {
        text: 'Roles',
        dataIndex: 'role',

    }, {
        xtype: 'actioncolumn',
        text: 'Edit Role',
        dataIndex: 'role',
        items: [{
            iconCls: 'x-fa fa-edit fontcolorgreen',
            handler: 'editRole',
            tooltip: 'Edit Role'
        }]
    }, {
        xtype: 'actioncolumn',
        text: 'Disable/Enable User',
        dataIndex: 'enable',
        items: [{
            //iconCls: 'x-fa fa-user-slash fontcolorgray',
            handler: 'disableEnable',
            tooltip: 'Disable/Enable',
            getClass: function (v, meta, rec) {
                return v == 0 ? "x-fa fa-user-slash fontcolorgray" : "x-fa fa-user-slash fontcolorgreen"
            }
        }]
    },{
        xtype: 'actioncolumn',
        text: 'Remove User',
        dataIndex: 'enable',
        items: [{
            iconCls: 'x-fa fa-trash fontcolorred',
            handler: 'removeUser',
            tooltip: 'Disable/Enable',
           
        }]
    }]

});
