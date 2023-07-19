Ext.define('AmazSync.store.suppierStore', {
     extend: 'AmazSync.store.AjaxStore',
     autoLoad: true,
     alias: 'store.suppierStore',
     storeId: 'suppierStore',
     remoteSort: true,
     remoteFilter: true,
     proxy: {
          type: 'ajax',
          url: commonutil.getUrl('supplier'),
          reader: {
               type: 'json',
               rootProperty: ''
          }
     }
});