
Ext.define('AmazSync.view.restock.list.RestockGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.restockGrid',
    scrollable: true,
    titlePosition: 2,
    store: 'restockStore',
    listeners: {
        rowclick: 'opneImage'
    },
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true
    },
    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1,
        listeners: {
            edit : 'validateSendQty'
        }
    }, {
        ptype: 'gridfilters'
    }],
    selModel: {
        selType: 'checkboxmodel',
        headerText: 'All',
        checkOnly: true,
        listeners: {
            deselect: 'onRecordDeSelect',
            select: 'onRecordSelect'
        }
    },
    viewConfig: {
        emptyText: 'There is no restock data found',
        enableTextSelection: true
    },
    tools: [{
        xtype: 'button',
        text: 'Reload',
        iconCls: 'x-fa fa-sync fontcolorgreen',
        tooltip: 'Refresh',
        handler: 'loadRestock',
        margin: '0 0 0 10px'
    }, {
        xtype: 'button',
        text: 'Create Shipment',
        iconCls: 'x-fa fa-cart-plus fontcolorgreen',
        tooltip: 'Create Shipment',
        handler: 'createShipment',
        margin: '0 0 0 10px'
    },
    {
        xtype: 'label',
        bind: {
            html: '<span>Total Products: {totalCount}</span>',
        }
    }],
    preventHeaders: true,
    columns: [
        {
            text: 'Image',
            xtype: 'templatecolumn',
            align: 'center',
            width: 100,
            tooltip: 'Click on image to view large size',
            tpl: `<a href="javascript:void(0)"><img src="{imageUrl}" alt="No" style="height:{imageHeight}px;width:{imageWidth}px"/></a>`,

        },
        {

            text: 'Qty to Send',
            tooltip: 'Qty to Send Amazon',
            dataIndex: 'qty_to_send_amz',
            width: 100,
            enableTextSelection: true,
            filter: {
                type: 'number'
            },
            filter: {
                type: 'number'
            },
            editor: {
                field: {
                    xtype: 'numberfield',
                    listeners: {

                    }
                }
            }
        },
        {
            text: 'Amazon SKU',
            tooltip: 'Amazon SKU',
            dataIndex: 'amz_sku',
            width: 200,
            tdCls: 'linebreak',
            enableTextSelection: true,
            filter: {
                type: 'string'
            }
        },
        {
            xtype: 'templatecolumn',
            text: 'Amazon ASIN',
            tooltip: 'Amazon ASIN',
            dataIndex: 'amazonASIN',
            width: 180,
            filter: {
                type: 'string'
            },
            tpl: '<a href="https://www.amazon.com/dp/{amazonASIN}" target="_blank">{amazonASIN}<a/>'
        },
        {
            text: 'Title',
            dataIndex: 'itemNameLocal',
            tooltip: 'Title',
            width: 300,
            tdCls: 'linebreak',
            align: 'left',
            filter: {
                type: 'string'
            }
        },
        {

            text: 'Kit',
            tooltip: 'Kit',
            sortable: true,
            dataIndex: 'kit',
            width: 50,
            filter: {
                type: 'boolean'
            },
            bind: {
                hidden: '{roleProductViewKit}'
            },
            renderer: function (value, metaData) {
                if (value)
                    return '<span class="x-fa fa-eye fontcolorgreen cursorpointer" target="openKit"/>';
                else
                    return '<span class="x-fa fa-plus fontcolorgreen cursorpointer" target="openKit"/>';
            }
            // items: [{
            //     handler: 'viewKit',
            //     tooltip: 'View/Edit Kit',
            //     getClass: function (v, meta, rec) {
            //         if (rec.get('kit') == true)
            //             return 'x-fa fa-eye fontcolorgreen';
            //         else
            //             return 'x-fa fa-plus fontcolorgreen';
            //     }
            // }]
        },
        {
            text: 'Warehouse',
            tooltip: 'Warehouse',
            dataIndex: 'warehousename',
            width: 100,
            filter: {
                type: 'list'
            }
        },
        {
            text: 'Bin Location',
            tooltip: 'Bin Location',
            dataIndex: 'locationname',
            width: 120,
            filter: {
                type: 'string'
            },
        }, {
            text: 'Case Pack Quantity',
            tooltip: 'casePackQuantity',
            dataIndex: 'casePackQuantity',
            width: 100,
            filter: {
                type: 'number'
            },
        },
        {
            text: 'Stock',
            tooltip: 'Stock',
            dataIndex: 'stock',
            width: 100,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {

                if (Ext.isEmpty(record.get('masterSKU'))) {
                    return value;
                }
                else {
                    var record = store.queryRecords('sellerSKU', record.get('masterSKU'));
                    if (record.length > 0) {
                        return record[0].get('stock')
                    }
                }
            },
            filter: {
                type: 'number'
            },

        }, {
            text: 'Master SKU',
            tooltip: 'Master SKU',
            dataIndex: 'masterSKU',
            width: 100,
            filter: {
                type: 'string'
            },
        }, {
            text: 'AMZ Current Price',
            tooltip: 'AMZ Current Price',
            dataIndex: 'amz_current_price',
            width: 180,
            filter: {
                type: 'number'
            },
        }, {
            text: 'AMZ Fees',
            tooltip: 'AMZ Estimated Fees',
            dataIndex: 'amz_fee_estimate',
            width: 180,
            filter: {
                type: 'number'
            },
        },
        {
            text: 'API Error',
            tooltip: 'Error',
            dataIndex: 'update_reason',
            width: 180,
            hidden:true,
        },
        
        {
            text: 'Product Cost',
            tooltip: 'Supplier Cost Per Unit + Inbound Shipping Cost + Reshipping Cost + Prep Material Cost + Prep Labor Cost',
            dataIndex: 'cost_per_unit',
            width: 180,
            filter: {
                type: 'number'
            },
        },
        {
            text: 'Profit',
            tooltip: 'profit',
            dataIndex: 'profit',
            width: 180,
            filter: {
                type: 'number'
            },
            renderer:function(value) {
                return "$"+value
            },
        },
        {
            text: 'ROI',
            tooltip: 'ROI',
            dataIndex: 'productRoi',
            width: 180,
            filter: {
                type: 'number'
            },
            renderer:function(value) {
                return value+"%"
            },
        }, {
            text: 'Last 7 Days',
            columns: [{
                text: 'AMZ Units Ordered',
                tooltip: 'AMZ Units Ordered(Last 7 Days)',
                dataIndex: 'amz_units_ordered7',
                width: 180,
                filter: {
                    type: 'number'
                },
            }, {
                text: 'AMZ Avg Selling Price',
                tooltip: 'AMZ Avg Selling Price (Last 7 Days)',
                dataIndex: 'amz_avg_selling_price7',
                width: 180,
                filter: {
                    type: 'number'
                },
            }, {
                text: 'AMZ Avg Profit',
                tooltip: 'AMZ Avg Profit (Last 7 Days)',
                dataIndex: 'amz_avg_profit7',
                width: 180,
                filter: {
                    type: 'number'
                },
            },
            {
                text: 'ROI',
                tooltip: 'ROI (Last 7 Days)',
                dataIndex: 'productRoi7',
                width: 180,
                renderer:function(value) {
                    return value+"%"
                },
                filter: {
                    type: 'number'
                },
            }, {
                text: 'AMZ Total Sold',
                tooltip: 'AMZ Total Sold(Last 7 Days)',
                dataIndex: 'amz_total_sell_amt7',
                width: 180,
                filter: {
                    type: 'number'
                },
            }]
        }, {
            text: 'Last 30 Days',
            columns: [{
                text: 'AMZ Units Ordered',
                tooltip: 'AMZ Units Ordered (Last 30 Days)',
                dataIndex: 'amz_units_ordered30',
                width: 180,
                filter: {
                    type: 'number'
                },
            }, {
                text: 'AMZ Avg Selling Price',
                tooltip: 'AMZ Avg Selling Price (Last 30 Days)',
                dataIndex: 'amz_avg_selling_price30',
                width: 180,
                filter: {
                    type: 'number'
                },
            }, {
                text: 'AMZ Avg Profit',
                tooltip: 'AMZ Avg Profit (Last 30 Days)',
                dataIndex: 'amz_avg_profit30',
                width: 180,
                filter: {
                    type: 'number'
                },
            }, {
                text: 'ROI',
                tooltip: 'ROI (Last 30 Days)',
                dataIndex: 'productRoi30',
                width: 180,
                renderer:function(value) {
                    return value+"%"
                },
                filter: {
                    type: 'number'
                },
            }, {
                text: 'AMZ Total Sold',
                tooltip: 'AMZ Total Sold (Last 30 Days)',
                dataIndex: 'amz_total_sell_amt30',
                width: 180,
                filter: {
                    type: 'number'
                },
            }]
        }, {
            text: 'Last 90 Days',
            columns: [{
                text: 'AMZ Units Ordered',
                tooltip: 'AMZ Units Ordered (Last 90 Days)',
                dataIndex: 'amz_units_ordered90',
                width: 180,
                filter: {
                    type: 'number'
                },
            }, {
                text: 'AMZ Avg Selling Price',
                tooltip: 'AMZ Avg Selling Price (Last 90 Days)',
                dataIndex: 'amz_avg_selling_price90',
                width: 180,
                filter: {
                    type: 'number'
                },
            }, {
                text: 'AMZ Avg Profit',
                dataIndex: 'amz_avg_profit90',
                width: 180,
                filter: {
                    type: 'number'
                },
            }, {
                text: 'ROI',
                tooltip: 'ROI (Last 90 Days)',
                dataIndex: 'productRoi90',
                renderer:function(value) {
                    return value+"%"
                },
                width: 180,
                filter: {
                    type: 'number'
                },
            }, {
                text: 'AMZ Total Sold',
                tooltip: 'AMZ Total Sold (Last 90 Days)',
                dataIndex: 'amz_total_sell_amt90',
                width: 180,
                filter: {
                    type: 'number'
                },
            }]
        }, {
            text: 'Total Days of AMZ Supply',
            tooltip: 'Total Days of AMZ Supply',
            dataIndex: 'amz_total_days_of_amz_supply',
            width: 180,
            filter: {
                type: 'number'
            },
        }, {
            text: 'Recommended Ship Qty',
            tooltip: 'Recommended Ship Qty',
            dataIndex: 'amz_recommended_order_qty',
            width: 180,
            filter: {
                type: 'number'
            },
        }, {
            xtype: 'datecolumn',
            text: 'Recommended Ship Date',
            tooltip: 'Recommended Ship Date',
            dataIndex: 'amz_recommended_order_date',
            width: 180,
            //format: 'd M, Y g: i a',
            filter: {
                type: 'date'
            },
        }, {
            text: 'Amazon FNSKU',
            tooltip: 'Amazon FNSKU',
            dataIndex: 'amazonFNSKU',
            width: 180,
            filter: {
                type: 'string'
            },
        }, {
            text: 'Amazon Category',
            tooltip: 'Amazon Category',
            dataIndex: 'amazon_category',
            width: 180,
            filter: {
                type: 'list'
            },
        }]

});
