module.exports = {
    login: "select user from users where username= {}",
    updateSetting: 'update settings set settings= ? where username=? and settinggroup =?',
    addSetting: 'INSERT INTO settings SET ?',
    getSetting: 'select * from settings where username=? and settinggroup =?',
    getProduct: `SELECT * from products where user=?`,
    getSKU: `SELECT sellerSKU,CONCAT_WS('',sellerSKU,'-', itemName) as name FROM products where user=?`,
    addProduct: 'insert into products(sellerId,user,itemName,sellerSKU,status,itemNote,dateAdded,amazonASIN,productId,productIdType) VALUES ?',
    updateProduct: 'update products set itemName=?,status=?,itemNote=?,productId=?,productIdType=? where sellerId=? and sellerSKU=?',
    updateProductDetailsbyId: 'update products set 	amazonOversized=?, imageUrl=?,imageHeight=?,imageWidth=?,packageDimensions=?,dimensions=? where sellerSKU=?',
    updateFNSKU: 'update products set amazonFNSKU=? where sellerId=? and sellerSKU=?',
    addLastSynch: 'insert into lastSyne SET ?',
    selectLastSynch: 'SELECT timespan FROM `lastSyne` WHERE username=? and sellerId=? order by timespan DESC LIMIT 1',
    getSuppliers: 'select * from suppliersList where user=?',
    addSuppliers: 'INSERT INTO suppliersList SET ?',
    deleteSuppliers: 'delete from suppliersList where id=? and user=?',
    updateSuppliers: 'update suppliersList SET ? where id=? and user=?',
    updateProductUI: 'update products SET ? where user=? and sellerSKU=?',
    productSuppliers: 'select s.*,sl.supplierName,sl.defaultTax from suppliers s  INNER join suppliersList sl on s.supplierID=sl.id where s.user=? and s.productSKU =?',
    addProductSuppliers: 'insert into suppliers SET ?',
    updateProductSuppliers: 'update suppliers SET ? where user=? and productSKU=? and supplierID=?',
    deleteProductSuppliers: 'delete from suppliers where user=? and productSKU=? and supplierID=?',
    getBinLocations: 'SELECT * FROM binlocation WHERE warehouseId=?',
    addBinLocations: 'insert into binlocation SET ?',
    getWarehouse: 'SELECT * FROM warehouse',
    addWarehouse: 'insert into warehouse SET ?',
    updateWarehouse: 'update warehouse SET name=?, address=?, description=? where id=?',
    deleteWarehouse: 'delete from warehouse where id=?',
    deleteBinLocation: 'delete from binlocation where id=?',
    addBinLocation: 'insert into binlocation SET ?',
    updateBinLocation: 'update binlocation SET name=?, description=? where id=?',
    validateBilocation: 'SELECT GROUP_CONCAT(sellerSKU) as sellerSKU from products where warehouse=? and location=? and sellerSKU !=?',
    removeproductlocation: 'delete from products where warehouse=? and location=? and sellerSKU !=?',
    getAllKitProducts: 'SELECT imageUrl,sellerSKU,itemName,amazonASIN from products where kit != true and sellerSKU !=?',
    addkitproduct: 'INSERT INTO kitProducts SET ?',
    getKitProducts: 'SELECT p.imageUrl,kt.sku as sellerSKU,p.itemName,p.amazonASIN from kitProducts kt inner join products p on kt.sku= p.sellerSKU where kt.parentSku=?',
    updateProductKitStatus: 'update products set kit=? where sellerSKU=?',
    deleteKitProduct: 'DELETE from  kitProducts where sku=? and parentSku=?'

}