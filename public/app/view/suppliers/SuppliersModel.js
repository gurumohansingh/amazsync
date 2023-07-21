Ext.define('AmazSync.view.suppliers.SuppliersModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.suppliers-suppliers',
    data: {
        name: 'AmazSync'
    },

    stores: {
        suppierStore: {
            autoLoad: true,
            remoteSort: true,
            fields: [{
                name: 'totalPackcost', type: 'number',
                convert: function (v, rec) {
                    if (Ext.isEmpty(rec.get('costPerUnit')) || Ext.isEmpty(rec.get('casePackQuantity'))) {
                        return null
                    }
                    return rec.get('costPerUnit') * rec.get('casePackQuantity');
                }
            }],
            method: 'GET',
            type: 'ajaxStore',
            proxy: {
                type: 'ajax',
                url: commonutil.getUrl('supplier'),
                reader: {
                    type: 'json',
                    rootProperty: 'users'
                }
            }
        },
        paymentTermsStore: {
            autoLoad: true,
            sort: {
                property: 'value',
                direction: 'desc'
            },
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: 'users'
                }
            },
            data: [{ value: 'CHECK' }, { value: 'CC' }, { value: 'ACH' }, { value: 'NET15' }, { value: 'NET30' }, { value: 'NET45' }, { value: 'NET60' }, { value: 'NET90' }]
        }
    }

});
