Ext.define('AmazSync.store.restockStore', {
     extend: 'AmazSync.store.AjaxStore',
     autoLoad: false,
     alias: 'store.restockStore',
     storeId: 'restockStore',
     remoteSort: true,
     remoteFilter: true,
     proxy: {
          type: 'ajax',
          url: commonutil.getUrl('restock'),
          reader: {
               type: 'json',
               rootProperty: 'inventories'
          }
     }
});