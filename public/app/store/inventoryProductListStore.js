Ext.define('AmazSync.store.inventoryProductListStore', {
     extend: 'AmazSync.store.AjaxStore',
     autoLoad: false,
     alias: 'store.inventoryProductListStore',
     storeId: 'inventoryProductListStore',
     pageSize: 100,
     remoteSort:true,
     remoteFilter : true, 
     remoteSort: true,
     proxy: {
          type: 'ajax',
          url: commonutil.getUrl('location/getlocalinventory'),
          reader: {
               type: 'json',
               rootProperty: 'locations',
               totalProperty:'total'
          }
     },
});