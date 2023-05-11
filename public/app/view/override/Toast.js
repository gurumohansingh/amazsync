Ext.define('AmazSync.view.override.Toast' , { 
    override:'Ext.window.Toast',
    autoCloseDelay:2000,
    floating : true,
    iconCls:'x-fa fa-warning_black',
    style:{
        'background-color': '#faebd7'
    }
 });