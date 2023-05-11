Ext.define('AmazSync.view.profit.ProfitViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.profit-profitview',
    data: {
        name: 'AmazSync'
    },
    stores: {
        profitStore: {
            autoLoad: false,
            fields: [{
                name: 'profit', type: 'number',
                convert: function (v, rec) {
                    
                   var profit=rec.get('amz_current_price')-(+rec.get('costPerUnit')+ +rec.get('inboundShippingCost')+ +rec.get('reshippingCost')+ +rec.get('prepMaterialCost')+ +rec.get('prepLaborCost'))-rec.get('amz_fee_estimate')
                   return Ext.util.Format.number(profit,"0,00.00")
                }
            },{
                name: 'roi', type: 'number',
                convert: function (v, rec) {
                    
                    var profit=rec.get('amz_current_price')-(+rec.get('costPerUnit')+ +rec.get('inboundShippingCost')+ +rec.get('reshippingCost')+ +rec.get('prepMaterialCost')+ +rec.get('prepLaborCost'))-rec.get('amz_fee_estimate')
                   var cost=  +rec.get('costPerUnit') + +rec.get('inboundShippingCost')+ +rec.get('reshippingCost')+ +rec.get('prepMaterialCost')+ +rec.get('prepLaborCost')
                   return Ext.util.Format.number((profit/cost)*100,"0,00.00")
                }
            },{
                name: 'cost', type: 'number',
                convert: function (v, rec) {
                    
                   var cost= +rec.get('costPerUnit')+ +rec.get('inboundShippingCost')+ +rec.get('reshippingCost')+ +rec.get('prepMaterialCost')+ +rec.get('prepLaborCost')
                   return Ext.util.Format.number( cost,"0,00.00")
                }
            }],
            method: 'GET',
            type: 'ajaxStore',
            proxy: {
                type: 'ajax',
                url: commonutil.getUrl('profit/getprofit'),
                reader: {
                    type: 'json',
                    rootProperty: 'users'
                }
            }
        },
    }
});
