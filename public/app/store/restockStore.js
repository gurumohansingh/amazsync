Ext.define('AmazSync.store.restockStore', {
     extend: 'AmazSync.store.AjaxStore',
     autoLoad: false,
     alias: 'store.restockStore',
     storeId: 'restockStore',
    
     proxy: {
          type: 'ajax',
          url: commonutil.getUrl('restock'),
          reader: {
               type: 'json',
               rootProperty: ''
          }
     }
});