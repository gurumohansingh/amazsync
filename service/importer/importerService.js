const mysql = require("../mysql"),
    { getTableColumns, getProductBySku, updateProductUI, addProductImporter, getSuppliersByName, addSuppliers,
        updateSuppliersByName, addBinLocation, getBinLocationsbyName, addInventoryStock, getInventoryStock,
        updateInventoryStockBySku, getSuppliers, addProductSuppliers, updateProductSuppliers, getProductSuppliers,
        getSuppliersIdByName, updateInventoryStockEmpty, removeLocationbyWarehouse } = require("../../util/sqlquery");

const sellerSettings = require('../settings/sellerSettings');
class importerService {
    getColumList(tableName, user) {
        return new Promise((resolve, reject) => {
            mysql.query(getTableColumns, tableName)
                .then(columns => resolve(columns))
                .catch(err => reject(err));
        })
    }
    async import(request, username) {

        const tableName = request['tableName'],
            fileData = JSON.parse(request['fileData']),
            columns = JSON.parse(request['columnMapping']);
        var jsonData = await this.jsonData(fileData, columns, username);
        var config = await sellerSettings.getSellerId(username);
        var response = [];
        if (tableName == "products") {
            response = await this.processProducts(jsonData, config.SellerId);
        }
        else if (tableName == "inventorystock") {
            if (!request['wareHouse']) {
                return "Please select warehouse"
            }
            response = await this.processInventory(jsonData, request['wareHouse'], request['missingLocation'], request['replaceStock']);
        }
        else if (tableName == "suppliersList") {
            response = await this.processSupplier(jsonData);
        }
        else if (tableName == "suppliers") {
            response = await this.processSupplierSKU(jsonData, request['addMissingSuppliersValue']);
        }
        return new Promise((resolve, reject) => {
            resolve(response)
        })
    }

    jsonData(data, column, username) {
        return new Promise((resolve, reject) => {
            var colMapping = {}, jsonData = [];
            data.forEach(async (item) => {
                var data = {};
                Object.keys(column).forEach(key => {
                    if (column[key]) {
                        data[key] = item[column[key]]
                    }
                })
                data['user'] = username;
                jsonData.push(data);
            });
            resolve(jsonData);
        })
    }

    async processProducts(data, sellerId) {
        var response = [];
        try {
            for (let i = 0; i < data.length; i++) {
                data[i]['sellerId'] = sellerId
                if (data[i]['sellerSKU']) {
                    const sku = await mysql.query(getProductBySku, data[i]['sellerSKU']);
                    if (data[i]['isActiveLocal'] && data[i]['isActiveLocal'].toLowerCase() == "active") {
                        data[i]['isActiveLocal'] = 1
                    }
                    if (data[i]['isPartSKUOnly'] && data[i]['isPartSKUOnly'].toLowerCase() == "active") {
                        data[i]['isPartSKUOnly'] = 1
                    }

                    if (sku.length > 0) {
                        response.push({ error: `Row number ${i} is existing and updated successfully`, type: 'Updated' });
                        const sellersku = data[i]['sellerSKU'];
                        delete data[i]['sellerSKU'];
                        await mysql.query(updateProductUI, [data[i], sellersku]);
                    }
                    else {
                        await mysql.query(addProductImporter, data[i]);
                        response.push({ error: `Row number ${i} is not found so added new product`, type: 'Added' });
                    }

                }
                else {
                    response.push({ error: `Row number ${i} dont have SKU So unable to process`, type: 'Failed' });
                }

            }
            return response;
        }
        catch (err) {
            console.log(err);
        }
    }
    async processSupplier(data) {
        var response = [];
        try {
            for (let i = 0; i < data.length; i++) {
                if (data[i]['supplierName']) {
                    const supplier = await mysql.query(getSuppliersByName, data[i]['supplierName']);
                    if (data[i]['exclusiveAgreement']) {
                        data[i]['exclusiveAgreement'] = data[i]['exclusiveAgreement'].toLowerCase() == "YES" ? 1 : 0;
                    }
                    if (supplier.length > 0) {
                        response.push({ error: `Row number ${i} is existing and updated successfully`, type: 'Updated' });
                        const supplierName = data[i]['supplierName'];
                        delete data[i]['supplierName'];
                        await mysql.query(updateSuppliersByName, [data[i], supplierName]);
                    }
                    else {
                        await mysql.query(addSuppliers, data[i]);
                        response.push({ error: `Row number ${i} is not found so added new supplier`, type: 'Added' });
                    }

                }
                else {
                    response.push({ error: `Row number ${i} dont have supplierName So unable to process`, type: 'Failed' });
                }

            }
            return response;
        }
        catch (err) {
            console.log(err);
        }
    }
    async processInventory(data, wareHouse, addMissingLocation, replaceStock) {
        var response = [];
        var locationIdList = [];
        try {
            for (let i = 0; i < data.length; i++) {
                if (data[i]['sku']) {
                    var params = { warehouseId: wareHouse, sku: data[i]['sku'], stock: data[i]['stock'] };
                    if (data[i]['locationid'] && addMissingLocation == 1) {
                        var location = await mysql.query(getBinLocationsbyName, [wareHouse, data[i]['locationid']]);
                        if (location.length < 1) {
                            location = await mysql.query(addBinLocation, { warehouseId: wareHouse, name: data[i]['locationid'] });
                            params["locationid"] = location.insertId;
                        }
                        else {
                            params["locationid"] = location[0].id;
                        }

                    }

                    var stock = await mysql.query(getInventoryStock, [data[i]['sku'], wareHouse]);
                    if (stock.length > 0) {

                        if (replaceStock == 0) {
                            data[i]['stock'] = parseInt(data[i]['stock']) + parseInt(stock[0].stock);
                        }
                        //set location null where sku=newsku, warehouseId=params warehouseid
                        if (params["locationid"]) {
                            await mysql.query(removeLocationbyWarehouse, [wareHouse, params["locationid"]]);
                        }
                        response.push({ error: `Row number ${i} SKU:${data[i]['sku']} is existing and updated stock is ${data[i]['stock']}`, type: 'Updated' });
                        await mysql.query(updateInventoryStockBySku, [data[i]['stock'], params["locationid"] || null, data[i]['sku'], wareHouse]);
                        locationIdList.push(stock[0].id);
                    }
                    else {
                        var newInventory = await mysql.query(addInventoryStock, params);
                        locationIdList.push(newInventory.insertId);
                        response.push({ error: `Row number ${i} SKU:${data[i]['sku']} is not found so added new inventory stock ${data[i]['stock']}`, type: 'Added' });
                    }
                }
                else {
                    response.push({ error: `Row number ${i} dont have SKU So unable to process`, type: 'Failed' });
                }

            }
            await mysql.query(updateInventoryStockEmpty, [locationIdList, wareHouse]);
            return response;
        }
        catch (err) {
            console.log(err);
        }
    }
    async processSupplierSKU(data, addMissingSuppliersValue) {
        var response = [];
        try {

            for (let i = 0; i < data.length; i++) {
                if (data[i]['supplierID'] == "" || data[i]['productSKU'] == "") {
                    response.push({ error: `Row number ${i} dont have productSKU or supplierID/Name, So unable to process`, type: 'Failed' });

                }
                else {
                    var supplierName = data[i]['supplierID'];
                    var supplierId = await mysql.query(getSuppliersIdByName, supplierName);
                    if (addMissingSuppliersValue != 1 && supplierId.length == 0) {
                        response.push({ error: `Row number ${i} supplierName: ${supplierName} reject as suppliers not found in system.`, type: 'Failed' });
                        supplierId = null;
                    }
                    else if (addMissingSuppliersValue == 1 && supplierId.length == 0) {
                        var newSupplier = await mysql.query(addSuppliers, { supplierName: supplierName });
                        supplierId = newSupplier.insertId;
                    }
                    else if (supplierId.length > 0) {
                        supplierId = supplierId[0]['id'];
                    }
                    else {
                        supplierId = null;
                    }
                    if (supplierId) {
                        //addProductSuppliers, updateProductSuppliers,getProductSuppliers
                        var checkExisting = await mysql.query(getProductSuppliers, [data[i]['productSKU'], supplierId]);
                        data[i]['alwaysPurchaseInCase'] = data[i]['alwaysPurchaseInCase'].toUpperCase() == "YES" ? 1 : 0;
                        if (checkExisting.length > 0) {
                            var productSKU = data[i]['productSKU'];
                            delete data[i]['productSKU'];
                            delete data[i]['supplierID'];
                            await mysql.query(updateProductSuppliers, [data[i], productSKU, supplierId]);
                            response.push({ error: `Row number ${i} is existing and updated successfully`, type: 'Updated' });
                        }
                        else {
                            data[i]['supplierID'] = supplierId
                            await mysql.query(addProductSuppliers, data[i]);
                            response.push({ error: `Row number ${i} is not found so added new sku supplier`, type: 'Added' });
                        }
                    }
                }

            }
            return response;
        }
        catch (err) {
            console.log(err);
        }
    }

}
module.exports = new importerService;
