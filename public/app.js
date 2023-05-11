/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'AmazSync.Application',
    name: 'AmazSync',
    loggedUser: 'Admin',
    requires: [
        // This will automatically load all classes in the AmazSync namespace
        // so that application classes do not need to require each other.
        'AmazSync.*',
        'Ext.window.Toast'
    ],
    // The name of the initial view to create.
    mainView: 'AmazSync.view.user.user'
});
