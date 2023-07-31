Ext.define('AmazSync.store.suppierStore', {
     extend: 'AmazSync.store.AjaxStore',
     autoLoad: true,
     alias: 'store.suppierStore',
     storeId: 'suppierStore',
     pageSize: 100,
     remoteFilter : true,
     buffered: true,
     proxy: {
          type: 'ajax',
          url: commonutil.getUrl('supplier'),
          reader: {
               type: 'json',
               rootProperty: 'suppliers',
               totalProperty:'total'
          }
     }
});