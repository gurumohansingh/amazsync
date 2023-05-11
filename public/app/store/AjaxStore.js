Ext.define('AmazSync.store.AjaxStore', {
     extend: 'Ext.data.Store',
     alias: 'store.ajaxStore',
     timeout: 1,
     proxy: {
          type: 'ajax',
          timeout: 60000,
          headers: {
               Authorization: tokenStorage.retrieve()
          },
          reader: {
               type: 'json',
               rootProperty: ''
          }
     }
});