
Ext.define('AmazSync.view.products.kit.Kit', {
    extend: 'Ext.panel.Panel',
    xtype: 'kit',
    requires: [
        'AmazSync.view.products.kit.KitController',
        'AmazSync.view.products.kit.KitModel'
    ],

    controller: 'products-kit-kit',
    viewModel: {
        type: 'products-kit-kit'
    },

    buttonAlign: 'center',
    margin: 2,
    border: false,
    scrollable: true,
    layout: {
        type: 'vbox',
        pack: 'start'
    },
    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            width: '100%',
            margin: 10,
            items: [{

                xtype: 'image',
                align: 'center',
                reference: 'image',
                width: 100,
                maxWidth: 100,
                maxHeight: 80,
                src: `<img src="{imageUrl}" alt="No Image" style="height:{imageHeight}px;width:{imageWidth}px"/>`
            },
            {
                xtype: 'displayfield',
                fieldLabel: 'SKU',
                reference: 'sku'
            },
            {
                xtype: 'container',
                layout: {
                    type: 'vbox',
                    pack: 'center',
                },
                margin: '0 0 0 20px',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Product Name',
                    reference: 'itemNameLocal',
                    width: 600,
                }, {
                    xtype: 'label',
                    margin: '-5px 0 0 105px',
                    width: 600,
                    componentCls: 'fontcolorAmz',
                    reference: 'productName'
                }]
            }, {
                xtype: 'button',
                text: 'Update Kit Name',
                handler: 'updateKitName',
            }]
        },
        {
            xtype: 'grid',
            width: '100%',
            height: 300,
            flex: 1,
            title: 'Kit Products',
            cls: 'contentcenter',
            reference: 'productskitGrid',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            forceFit: true,
            viewConfig: {
                emptyText: '<span class="emptytext">No kit product found.</span>',
            },
            bind: {
                store: '{productskitStore}'
            },
            listeners: {
                rowclick: 'opneImage'
            },
            columns: [{
                text: 'Image',
                align: 'center',
                xtype: 'templatecolumn',
                align: 'center',
                width: 100,
                tpl: `<img src="{imageUrl}" alt="No" style="height:{imageHeight}px;width:{imageWidth}px"/>`
            }, {
                text: 'SKU',
                align: 'center',
                dataIndex: 'sellerSKU',
                flex: 1,
            }, {
                text: 'ASIN',
                align: 'center',
                dataIndex: 'amazonASIN',
                flex: 0.5,
            }, {
                text: 'Product Name',
                align: 'center',
                dataIndex: 'itemName',
                flex: 2,
            }, {
                text: 'Qty In Kit',
                dataIndex: 'count',
                width: 100,
                editor: {
                    xtype: 'numberfield',
                    listeners: {
                        blur: 'updateCount'
                    }
                },
            }, {
                text: 'Local Stock',
                align: 'center',
                dataIndex: 'localCount',
                width: 100
            }, {
                text: 'Location',
                align: 'center',
                dataIndex: 'location',
                width: 100
            }, {
                xtype: "actioncolumn",
                align: 'center',
                align: "center",
                width: 50,
                items: [
                    {
                        tooltip: 'Remove From Kit',
                        iconCls: 'x-fa fa-trash fontcolorred',
                        handler: 'removeProductFromKit',

                    },
                ]
            }]
        },
        {
            xtype: "textfield",
            fieldLabel: 'Search By SKU, Name, ASIN',
            width: 400,
            enableKeyEvents: true,
            triggers: {
                clear: {
                    cls: 'x-form-clear-trigger',
                    handler: function () {
                        this.reset();
                    }
                }
            },
            listeners: {
                change: 'applyFilter'
            }

        },
        {
            xtype: 'grid',
            margin: '10px 0 0 0',
            width: '100%',
            splitter: true,
            height: 250,
            scrollable: true,
            cls: 'contentcenter',
            title: 'All Products',
            reference: 'allProductskitGrid',
            forceFit: true,
            viewConfig: {
                emptyText: '<span class="emptytext">No product found. Search By SKU, Name, ASIN.</span>',
            },
            bind: {
                store: '{allProductskitStore}'
            },
            listeners: {
                rowclick: 'opneImage'
            },
            columns: [{
                text: 'Image',
                xtype: 'templatecolumn',
                align: 'center',
                width: 100,
                tpl: `<img src="{imageUrl}" alt="No" style="height:{imageHeight}px;width:{imageWidth}px"/>`
            }, {
                text: 'SKU',
                dataIndex: 'sellerSKU',
                align: 'center',
                flex: 1,
            }, {
                text: 'ASIN',
                dataIndex: 'amazonASIN',
                align: 'center',
                flex: 0.5,
            }, {
                text: 'Product Name',
                dataIndex: 'itemName',
                align: 'center',
                flex: 2,
            }, {
                xtype: "actioncolumn",
                align: "center",
                align: 'center',
                width: 50,
                items: [
                    {
                        tooltip: 'Add In Kit',
                        iconCls: 'x-fa fa-plus-circle fontcolorgreen',
                        handler: 'addProductInKit'
                    },
                ]
            }]
        }]
});
