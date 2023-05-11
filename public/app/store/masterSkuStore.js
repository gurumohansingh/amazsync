Ext.define('AmazSync.store.masterSkuStore', {
     extend: 'AmazSync.store.AjaxStore',
     autoLoad: false,
     alias: 'store.masterSkuStore',
     storeId: 'masterSkuStore',
     //fields: [{ type: 'string', name: 'name' }],
     proxy: {
          type: 'ajax',
          url: commonutil.getUrl('products/getmastersku'),
          reader: {
               type: 'json',
               rootProperty: ''
          }
     },
     sorters: {
          property: 'masterSKU',
          direction: 'ASC'
     }
});