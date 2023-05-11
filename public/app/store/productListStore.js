Ext.define('AmazSync.store.productList', {
     extend: 'AmazSync.store.AjaxStore',
     autoLoad: false,
     alias: 'store.productList',
     storeId: 'productList',
     proxy: {
          type: 'ajax',
          url: commonutil.getUrl('products/getallproduct'),
          reader: {
               type: 'json',
               rootProperty: 'users'
          }
     }
});