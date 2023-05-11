
Ext.define('AmazSync.view.inventory.list.InventoryList', {
    extend: 'Ext.grid.Panel',
    xtype: 'inventoryList',
    requires: [
        'AmazSync.view.inventory.list.InventoryListController',
        'AmazSync.view.inventory.list.InventoryListModel'
    ],

    controller: 'inventory-list-inventorylist',
    viewModel: {
        type: 'inventory-list-inventorylist'
    },
    cls: 'productlistgrid',
    reference: 'inventoryList',
    store: 'inventoryProductListStore',
    padding: 5,
    rowLines: false,
    titlePosition: 2,
    rowLines: false,
    selModel: 'cellmodel',
    listeners: {
        rowclick: 'opneImage'
    },
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1,
        listeners: {
            beforeedit(editor, context, eOpts) {
                var role = context.column.role;
                if (!Ext.isEmpty(context.record.get('masterSku')) && context.column.dataIndex == "stock") {
                    return false;
                }
                return !editor.view.up('grid').getViewModel().get(role);
            }
        }
    },
    viewConfig: {
        enableTextSelection: true,
        emptyText: '<span class="emptytext">No product found</span>',
        textAlight: 'center',
        preserveScrollOnRefresh: true,
        preserveScrollOnReload: true
    },
    titlePosition: 0,
    tools: [
        {
            xtype: 'label',
            bind: {
                html: '<span>Total Products: {totalCount}</span>',
            }
        }],
    columns: {
        defaults: {
            align: 'center',
            width: 'auto'
        },
        items: [{
            xtype: 'actioncolumn',
            text: 'Edit',
            width: 50,
            bind: {
                hidden: '{roleProductEdit}'
            },
            items: [{
                iconCls: 'x-fa fa-edit fontcolorgreen',
                handler: 'editProduct',
                tooltip: 'Edit Product',

            }]
        },
        {
            text: 'Image',
            xtype: 'templatecolumn',
            align: 'center',
            width: 100,
            tpl: `<img src="{imageUrl}" alt="No" style="height:{imageHeight}px;width:{imageWidth}px"/>`
        },
        {
            text: 'Title',
            tooltip: 'Title',
            dataIndex: 'itemNameLocal',
            width: 300,
            tdCls: 'linebreak',
            align: 'left',
            filter: {
                type: 'string'
            }
        }, {

            text: 'Kit',
            tooltip: 'Kit',
            sortable: true,
            dataIndex: 'kit',
            width: 50,
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
        }, {
            text: 'Amazon SKU',
            tooltip: 'Amazon SKU',
            dataIndex: 'sellerSKU',
            width: 200,
            tdCls: 'linebreak',
            enableTextSelection: true,
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Status',
            tooltip: 'Status',
            dataIndex: 'status',
            width: 100,
            filter: {
                type: 'list'
            }
        }, {
            text: 'Warehouse ',
            tooltip: 'Warehouse',
            dataIndex: 'warehousename',
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Bin Location',
            tooltip: 'Bin Location',
            dataIndex: 'binlocationname',
            filter: {
                type: 'string'
            },
            role: 'roleInventoryEditLocation',
            editor: {
                xtype: 'combo',
                displayField: 'name',
                valueField: 'name',
                forceSelection: true,
                typeAhead: true,
                typeAheadDelay: 100,
                minChars: 1,
                queryMode: 'local',
                lastQuery: '',
                listeners: {
                    change: 'updateBinlocation'
                },
                bind: {
                    store: '{binLocationStore}'

                }
            }
        }, {
            text: 'Stock',
            tooltip: 'Stock',
            dataIndex: 'stock',
            role: 'roleInventoryEditStock',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {

                if (Ext.isEmpty(record.get('masterSku'))) {
                    return value;
                }
                else {
                    var record = store.queryRecords('sellerSKU', record.get('masterSku'));
                    if (record.length > 0) {
                        return record[0].get('stock')
                    }
                }
            },
            editor: {
                xtype: 'numberfield',
                name: 'stock',
                role: 'roleInventoryEditStock',
                listeners: {
                    blur: 'updateInventoryStock'
                }
            },
            width: 50,
            filter: {
                type: 'number'
            }
        },
        {
            text: 'Master SKU',
            dataIndex: 'masterSku',
            role: 'roleInventoryEditStock',
            width: 120,
            // editor: {
            //     xtype: 'combo',
            //     displayField: 'sellerSKU',
            //     valueField: 'sellerSKU',
            //     forceSelection: true,
            //     store: 'masterSkuStore',
            //     role: 'roleInventoryEditStock',
            //     width: 120,
            //     reference: 'masterSKUCombo',
            //     typeAhead: false,
            //     listeners: {
            //         change: 'updateMasterSKU',
            //         afterrender: function (cmp) {
            //             cmp.inputEl.set({
            //                 autocomplete: 'on'
            //             });
            //         }
            //     }
            // },
        },
        {
            text: 'Is Part SKU Only',
            tooltip: 'Is Part SKU Only',
            dataIndex: '',
        },
        {
            text: 'UPC',
            tooltip: 'UPC',
            dataIndex: 'productId',
            width: 100,
            filter: {
                type: 'string'
            },
            renderer: function (value, metaData, record) {
                var productTypeId = record.get('productIdType');
                if (productTypeId == 3) {
                    return value
                }
            }
        },
        {
            text: 'EAN',
            tooltip: 'EAN',
            dataIndex: 'productId',
            width: 100,
            filter: {
                type: 'string'
            },
            renderer: function (value, metaData, record) {
                var productTypeId = record.get('productIdType');
                if (productTypeId == 4) {
                    return value
                }
            }
        },
        {
            text: 'Case Pack UPC',
            tooltip: 'Case Pack UPC',
            dataIndex: ''
        },
        // {
        //     text: 'Package Weight<br><span class="fontcolorgreen">Unit</span>',
        //     dataIndex: 'dimensions',
        //     renderer: function (value) {
        //         try {
        //             if (!Ext.isEmpty(value)) {
        //                 var weight = JSON.parse(value).Weight;
        //                 return weight ? `${Ext.util.Format.number(weight.Value, "0.00")}<br><span class="fontcolorgreen">${weight.Units}</span>` : '';
        //             }
        //         }
        //         catch (err) { console.log(err); }
        //     }
        // },
        // {
        //     text: 'Amazon Package Weight<br><span class="fontcolorgreen">Unit</span>',
        //     dataIndex: 'packageDimensions',
        //     renderer: function (value) {
        //         try {
        //             if (!Ext.isEmpty(value)) {
        //                 var weight = JSON.parse(value).Weight;
        //                 return weight ? `${Ext.util.Format.number(weight.Value, "0.00")}<br><span class="fontcolorgreen">${weight.Units}</span>` : '';
        //             }
        //         }
        //         catch (err) { console.log(err); }
        //     }
        // },
        // {
        //     text: 'Dimensions (Amazon)LxWxH<br><span class="fontcolorgreen">Unit</span>',
        //     dataIndex: 'packageDimensions',
        //     renderer: function (value) {
        //         try {
        //             if (!Ext.isEmpty(value)) {
        //                 var x = '<span class="fontcolorgreen"> x </span>'
        //                 var dimensions = JSON.parse(value);
        //                 return `${Ext.util.Format.number(dimensions.Length.Value, "0.00")}${x}${Ext.util.Format.number(dimensions.Width.Value, "0.00")}${x}${Ext.util.Format.number(dimensions.Height.Value, "0.00")}<br><span class="fontcolorgreen">${dimensions.Height.Units}</span>`
        //             }
        //         }
        //         catch (err) { console.log(err); }
        //     }
        // },
        {
            text: 'Date Added',
            tooltip: 'Date Added',
            xtype: 'datecolumn',
            dataIndex: 'dateAdded',
            filter: {
                type: 'date'
            }
        },
        {
            text: 'Amazon ASIN (Amazon)',
            tooltip: 'Amazon ASIN (Amazon)',
            dataIndex: 'amazonASIN',
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Amazon Oversized (Amazon)',
            tooltip: 'Amazon Oversized (Amazon)',
            dataIndex: 'amazonOversized'
        },
        {
            text: 'Hazmat (Amazon)',
            tooltip: 'Hazmat (Amazon)',
            dataIndex: 'hazmat'
        },

        {
            text: 'Notes',
            tooltip: 'Notes',
            dataIndex: 'itemNote',
            width: 200,
            tdCls: 'linebreak',
            align: 'left',
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Amazon FNSKU (Amazon)',
            tooltip: 'Amazon FNSKU (Amazon)',
            dataIndex: 'amazonFNSKU',
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Last Update from Amazon',
            tooltip: 'Last Update from Amazon',
            dataIndex: '',
            filter: {
                type: 'date'
            }
        },
        {
            text: 'Amazon Prep Instructions',
            tooltip: 'Amazon Prep Instructions',
            dataIndex: '',
            filter: {
                type: 'string'
            }
        },

        {
            text: 'Expiration Date Required? (Amazon)',
            tooltip: 'Expiration Date Required? (Amazon)',
            dataIndex: '',
            filter: {
                type: 'date'
            }
        },
        {
            text: 'Reshipping Cost',
            tooltip: 'Reshipping Cost',
            dataIndex: ''
        },
        {
            text: 'Prep Material Cost',
            tooltip: 'Prep Material Cost',
            dataIndex: ''
        },
        {
            text: 'Prep Labor Cost',
            tooltip: 'Prep Labor Cost',
            dataIndex: ''
        },
        {
            text: 'Tag',
            tooltip: 'Tag',
            dataIndex: 'tag',
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Amazon S&L',
            tooltip: 'Amazon S&L',
            dataIndex: ''
        },

        {
            text: 'Target Days In Warehouse',
            tooltip: 'Target Days In Warehouse',
            dataIndex: 'targetDaysInWarehouse'
        },
        {
            text: 'Target Days In Amazon',
            tooltip: 'Target Days In Amazon',
            dataIndex: 'targetDaysInAmazon'
        },
        {
            xtype: 'datecolumn',
            text: 'Time Stamp',
            tooltip: 'Time Stamp',
            dataIndex: 'timeStamp'
        },
        {
            text: 'Update By',
            tooltip: 'Update By',
            dataIndex: 'user'
        }
        ]
    }
});
