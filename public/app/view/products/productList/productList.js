
Ext.define('AmazSync.view.products.productList.productList', {
    extend: 'Ext.grid.Panel',
    xtype: 'productList',
    requires: [
        'AmazSync.view.products.productList.productListController',
        'AmazSync.view.products.productList.productListModel',
        'AmazSync.store.productList',
        'Ext.toolbar.Toolbar',
        'Ext.grid.filters.Filters'
    ],

    controller: 'products-productlist-productlist',
    enableTextSelection :true,
    viewModel: {
        type: 'products-productlist-productlist'
    },
    cls: 'productlistgrid',
    reference: 'productList',
    store: 'productList',
    plugins: 'gridfilters',
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true
    },
    tools: [{
        xtype: 'button',
        text: 'Add New Product',
        iconCls: 'x-fa fa-plus fontcolorgreen',
        tooltip: 'Add new product for forecast',
        handler: 'addNewsku',
        margin: '0 0 0 10px'
    }, {
        xtype: 'button',
        text: 'Reload',
        iconCls: 'x-fa fa-sync fontcolorgreen',
        tooltip: 'Refresh',
        title: 'Sync',
        handler: 'syncProducts',
        margin: '0 0 0 10px'
    },
    {
        xtype: 'button',
        iconCls: 'x-fa fa-arrow-down fontcolorgreen',
        margin: '0 0 0 30px',
        text: 'Sync New AMZ',
        tooltip: 'Sync New AMZ will fetch only newly added sku on amazon',
        handler: 'nanoUpdateInventory',
        bind: {
            hidden: '{roleSyncInventoryView}'
        }
    },
    {
        xtype: 'label',
        bind: {
            html: '<span>Total Products: {totalCount}</span>',
        }
    }],
    titlePosition: 3,
    padding: 5,
    rowLines: false,
    viewConfig: {
        enableTextSelection: true,
        emptyText: '<span class="emptytext">No product found</span>',
        textAlight: 'center'
    },
    listeners: {
        cellclick: 'opneImage'
    },
    columns: {
        defaults: {
            align: 'center',
            width: 'auto'
        },
        items: [
            {
                xtype: 'actioncolumn',
                text: 'Edit',
                width: 50,
                bind: {
                    hidden: '{roleProductEdit}'
                },
                items: [{
                    iconCls: 'x-fa fa-edit fontcolorgreen',
                    handler: 'editProduct',
                    tooltip: 'Edit Product'

                }]
            },
            {
                xtype: 'actioncolumn',
                text: 'Refresh',
                width: 70,
                dataIndex: 'isPartSKUOnly',
                bind: {
                    hidden: '{roleProductSingleSync}'
                },
                items: [{
                    iconCls: 'x-fa fa-sync fontcolorgreen',
                    handler: 'syncProduct',
                    tooltip: 'Sync from Amazon',
                    handler: 'synchSku',
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        return record.get('isPartSKUOnly') == 0 ? false : true
                    }
                }]
            },
            {
                xtype: 'actioncolumn',
                text: 'Supplier',
                width: 60,
                bind: {
                    hidden: '{roleProductViewSupplier}'
                },
                items: [{
                    iconCls: 'x-fa fa-dolly fontcolorgreen',
                    handler: 'getProductSuppliers',
                    tooltip: 'View/Edit Suppliers',
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        return Ext.isEmpty(record.get('masterSku')) ? false : true
                    }

                }]
            },
            {
                text: 'Image',
                xtype: 'templatecolumn',
                align: 'center',
                width: 100,
                tooltip: 'Click on image to view large size',
                tpl: `<a href="javascript:void(0)"><img src="{imageUrl}" alt="No" style="height:{imageHeight}px;width:{imageWidth}px"/></a>`,

            },
            {
                text: 'Title',
                dataIndex: 'itemNameLocal',
                tooltip: 'Title',
                width: 300,
                tdCls: 'linebreak',
                align: 'left',
                enableTextSelection:true,
                filter: {
                    type: 'string'
                }
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
            },
            {
                text: 'Status',
                tooltip: 'Status',
                dataIndex: 'status',
                width: 100,
                filter: {
                    type: 'list'
                }
            },
            {
                text: 'Country Of Origin',
                tooltip: 'Country Of Origin',
                dataIndex: 'countryofOriginLocal',
                width: 120,
            },
            {
                text: 'HTC Code',
                tooltip: 'HTC Code',
                dataIndex: 'htcCodeLocal',
                width: 100,
            },
            {
                text: 'Is Part SKU Only',
                tooltip: 'Is Part SKU Only',
                dataIndex: 'isPartSKUOnly',
                renderer: function (value, metaData, record) {
                    return value == 0 ? 'No' : 'Yes';
                }
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
            }, {
                text: 'Case Pack Quantity',
                tooltip: 'Case Pack Quantity:',
                dataIndex: 'casePackQuantity'
            },
            {
                text: 'Case Pack UPC',
                tooltip: 'Case Pack UPC',
                dataIndex: 'casePackUPC'
            },
            {
                text: 'Is Master SKU',
                tooltip: 'Is Master SKU',
                dataIndex: 'ismasterSku',
                renderer: function (value, metaData, record) {
                    return value == 1 ? 'Yes' : 'No';
                }
            }, {
                text: 'Master SKU',
                tooltip: 'Master SKU',
                dataIndex: 'masterSku',
                width: 200
            },
            {
                text: 'Package Weight<br><span class="fontcolorgreen">Unit</span>',
                tooltip: 'Package Weight',
                dataIndex: 'dimensions',
                renderer: function (value) {
                    try {
                        if (!Ext.isEmpty(value)) {
                            var weight = JSON.parse(value).Weight;
                            return weight ? `${Ext.util.Format.number(weight.Value, "0.00")}<br><span class="fontcolorgreen">${weight.Units}</span>` : '';
                        }
                    }
                    catch (err) { console.log(err); }
                }
            },
            {
                text: 'Amazon Package Weight<br><span class="fontcolorgreen">Unit</span>',
                tooltip: 'Amazon Package Weight',
                dataIndex: 'packageDimensions',
                renderer: function (value) {
                    try {
                        if (!Ext.isEmpty(value)) {
                            var weight = JSON.parse(value).Weight;
                            return weight ? `${Ext.util.Format.number(weight.Value, "0.00")}<br><span class="fontcolorgreen">${weight.Units}</span>` : '';
                        }
                    }
                    catch (err) { console.log(err); }
                }
            },
            {
                text: 'Dimensions (Amazon)LxWxH<br><span class="fontcolorgreen">Unit</span>',
                tooltip: 'Dimensions (Amazon)LxWxH',
                dataIndex: 'packageDimensions',
                renderer: function (value) {
                    try {
                        if (!Ext.isEmpty(value)) {
                            var x = '<span class="fontcolorgreen"> x </span>'
                            var dimensions = JSON.parse(value);
                            return `${Ext.util.Format.number(dimensions.Length.Value, "0.00")}${x}${Ext.util.Format.number(dimensions.Width.Value, "0.00")}${x}${Ext.util.Format.number(dimensions.Height.Value, "0.00")}<br><span class="fontcolorgreen">${dimensions.Height.Units}</span>`
                        }
                    }
                    catch (err) { console.log(err); }
                }
            }, {
                text: 'Date Added',
                tooltip: 'Date Added',
                xtype: 'datecolumn',
                dataIndex: 'dateAdded',
                filter: {
                    type: 'date'
                },
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
                dataIndex: ''
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
            // {
            //     text: 'Suppliers',
            //     dataIndex: 'suppliers',
            //     renderer: function (value) {
            //         if (!Ext.isEmpty(value)) {
            //             var suppliers = value.split(',');
            //             var link = '';
            //             suppliers.forEach(element => {
            //                 link = link.concat(`<a href=#>${element.split('|')[0]}</a>`, '</br>')
            //             });
            //             return link;
            //         }
            //     }
            // },
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
                dataIndex: '',
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
