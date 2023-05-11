
Ext.define('AmazSync.view.profit.ProfitView',{
    extend: 'Ext.grid.Panel',
    alias:'widget.profitView',
    requires: [
        'AmazSync.view.profit.ProfitViewController',
        'AmazSync.view.profit.ProfitViewModel'
    ],

    controller: 'profit-profitview',
    viewModel: {
        type: 'profit-profitview'
    },
    bind:{
        store:'{profitStore}'
    },
    viewConfig: {
        enableTextSelection: true,
        emptyText: '<span class="emptytext">No product found</span>',
        textAlight: 'center'
    },
    tbar:[{
        xtype: 'combo',
        fieldLabel: 'Market Place',
        displayField: 'name',
        valueField: 'value',
        queryMode: 'local',
        labelAlign: 'left',
        margin: '15px 0 0 0',       
        forceSelection: true,
        reference: 'marketPlace',
        store: {
            data: [{ name: 'USA', value: 'US' }, { name: 'Canada', value: 'CA' }]
        },
        listeners: {
            change: 'loadRestock',
            afterrender: 'setDefaultMarketPlace'
        },
    },{
        xtype:'textfield',
        margin:'0 0 0 30px',
        emptyText:'Search by SKU',
        listeners:{
            change:{
                fn:'searchBySku',
                delay:250
            }
        }
    }],
    columns:[{
        text:'SKU',
        dataIndex: 'sellerSKU',
        width:200
    },{
        text: 'Current Price Per Unit',
        dataIndex: 'amz_current_price',
    }, {
        text: 'Image',
        xtype: 'templatecolumn',
        align: 'center',
        width: 100,
        tpl: `<img src="{imageUrl}" alt="No" style="height:{imageHeight}px;width:{imageWidth}px"/>`
    },{
        text: 'Cost',
        dataIndex: 'cost',
    },{
        text:'Amz Fees',
        dataIndex: 'amz_fee_estimate',
    },{
        text:'Profit($)',
        dataIndex: 'profit',
    },{
        text:'ROI %',
        dataIndex: 'roi',
    },{
        text: 'Last 7 Days',
        
        columns: [{
            text: 'Total Sell Amount',
            dataIndex: 'amz_total_sell_amt7',
            width: 200,
        },{
            text: 'Total Qty Sold',
            dataIndex: 'amz_units_ordered7',
            width: 200,
        }
    ]
    },{
        text: 'Last 30 Days',
        columns: [{
            text: 'Total Sell Amount',
            dataIndex: 'amz_total_sell_amt30',
            width: 200,
        },{
            text: 'Total Qty Sold',
            dataIndex: 'amz_units_ordered30',
            width: 200,
        }]
    },{
        text: 'Last 90 Days',
        columns: [{
            text: 'Total Sell Amount',
            dataIndex: 'amz_total_sell_amt90',
            width: 200,
        },{
            text: 'Total Qty Sold',
            dataIndex: 'amz_units_ordered30',
            width: 200,
        }]
    }]
});
