Ext.define('AmazSync.store.rolesStore', {
     extend: 'AmazSync.store.AjaxStore',
     autoLoad: false,
     alias: 'store.rolesStore',
     storeId: 'rolesStore',
     //fields: [{ type: 'string', name: 'name' }],
     proxy: {
          type: 'ajax',
          url: commonutil.getUrl('admn/getroles'),
          reader: {
               type: 'json',
               rootProperty: ''
          }
     },
     sorters: {
          property: 'name',
          direction: 'ASC'
     }
});