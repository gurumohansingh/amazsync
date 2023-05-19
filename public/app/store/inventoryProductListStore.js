Ext.define('AmazSync.store.inventoryProductListStore', {
     extend: 'AmazSync.store.AjaxStore',
     autoLoad: false,
     alias: 'store.inventoryProductListStore',
     storeId: 'inventoryProductListStore',
     pageSize: 25,
     proxy: {
          type: 'ajax',
          url: commonutil.getUrl('location/getlocalinventory'),
          reader: {
               type: 'json',
               rootProperty: ''
          }
     },
     // sorters: [{
     //      property: 'binlocationname',
     //      direction: 'DESC'
     // }]
});