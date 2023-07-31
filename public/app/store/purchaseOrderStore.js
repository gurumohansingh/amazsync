Ext.define('AmazSync.store.purchaseOrderStore', {
     extend: 'AmazSync.store.AjaxStore',
     autoLoad: false,
     alias: 'store.purchaseOrderStore',
     storeId: 'purchaseOrderStore',
     pageSize: 100,
     remoteSort:true,
     remoteFilter : true,
     proxy: {
          type: 'ajax',
          url: commonutil.getUrl('shipment/getpurchaseorder'),
          reader: {
               type: 'json',
               rootProperty: ''
          }
     }
});