Ext.define('AmazSync.view.purchaseOrders.list.PurchaseOrdersGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.purchaseorders-list-purchaseordersgrid',

    init: function () {
        var me = this, view = me.getView(), store = view.getStore();
        me.getViewModel().set('shipmentType', true);
        store.load(function () {
            view.getView().refresh();
        });

    },
    loadShipments: function (radio, newValue, oldValue) {
        var me = this, view = me.getView(), store = view.getStore();
        store.getProxy().setExtraParam('type', newValue);
        store.load(function () {
            view.getView().refresh();
        });
    },

    syncInventoryPlaner: function () {
        var me = this, view = me.getView(), store = view.getStore();
        commonutil.apiCall(`shipment/sync`, commonutil.GET, null, view)
            .then((res) => {
                Ext.toast('Sync Successfully');
                store.load(function () {
                    view.getView().refresh();
                });
            })
            .catch((err) => {
                Ext.toast('Enable to delete');
            })
    },
    updateView: function () {
        var me = this, view = me.getView(), store = view.getStore();
        view.getView().refresh();
    },
    getPOGetails: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        var me = this, view = me.getView();
        if (cellIndex == 1) {
            me.openpoDetails(record.getData());
        }
    },
    openpoDetails: function (data) {
        var tabTitle=`${data['reference']} - ${data['remoteId']}`;
        if(data['is_virtual']){
            tabTitle=data['remoteId'];
        }
        var me = this, view = me.getView(), store = view.getStore();
        var poDetails = Ext.create('AmazSync.view.purchaseOrders.detail.PurchaseOrderDetail', {
            title:tabTitle,
            parentShipmentName: data['reference']
        })
        
        poDetails.getStore().loadData(JSON.parse(data['items']));
        poDetails.getViewModel().set('shipmentName', data['remoteId']);
        poDetails.getViewModel().set('warehouse', data['warehouse']);
        poDetails.getViewModel().set('shipmentId', data['id']);
        poDetails.getViewModel().set('hiddenButtons', data['is_virtual']==1?false:true);
        navigation.addComponent({
            poDetails,
            directComponent: true,
            tabName: data['remoteId']
        });
    },
    openSingleShipmentDetail: function (id) {
        var me = this, view = me.getView(), store = view.getStore();
        commonutil.apiCall('shipment/getvirtualshipmentById', "GET", id, null).then(responce => {
            me.openpoDetails(responce);
        });
    },
    reload: function () {
        var me = this, view = me.getView(), store = view.getStore();
        store.reload();
    },
    
    applyFilter: function (filter) {
        var me = this, view = me.getView(), vm = me.getViewModel();        
        var store = view.getStore();
        store.clearFilter(true);
        var searchFilterValue= filter.getValue().toLowerCase();
        store.filterBy((record) => {
            var searchFilter = record.get('reference') && record.get('reference').toLowerCase().includes(searchFilterValue) || record.get('remoteId') && record.get('remoteId').toLowerCase().includes(searchFilterValue);
            return searchFilter
        });
    },
});
