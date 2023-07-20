Ext.define('AmazSync.store.purchaseOrderStore', {
     extend: 'AmazSync.store.AjaxStore',
     autoLoad: false,
     alias: 'store.purchaseOrderStore',
     storeId: 'purchaseOrderStore',
     remoteSort: true,
     proxy: {
          type: 'ajax',
          url: commonutil.getUrl('shipment/getpurchaseorder'),
          reader: {
               type: 'json',
               rootProperty: ''
          }
     }
});