Ext.define('AmazSync.store.binLocatioStore', {
     extend: 'AmazSync.store.AjaxStore',
     autoLoad: false,
     alias: 'store.binLocatioStore',
     storeId: 'binLocatioStore',
     proxy: {
          type: 'ajax',
          url: commonutil.getUrl('location/getbinlocations'),
          reader: {
               type: 'json',
               rootProperty: ''
          }
     }
});