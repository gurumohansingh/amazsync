module.exports = {
  login:
    "select role,firstname,password,ID from users where email=? and enable=1",
  updateSetting: "update settings set settings= ? where settinggroup =?",
  addSetting: "INSERT INTO settings SET ?",
  getSetting: "select * from settings where settinggroup =?",
  getProductwhere: `SELECT * from products where amzlive =?`,
  updateProductsLive: "update products set amzlive=0",
  getProduct: `SELECT * from products`,
  getProductByPurchaseOrder: `SELECT p.*
    FROM purchase_orders po
    CROSS JOIN JSON_TABLE(
        po.items,
        "$[*]"
        COLUMNS (
            sku VARCHAR(255) PATH "$.sku"
        )
    ) AS jt
    JOIN products p ON jt.sku = p.sellerSku
    WHERE po.id IN (?)`,
  getProductCount: `SELECT COUNT(*) as totalProducts from products`,
  getProductBySku: `SELECT * from products where sellerSKU=?`,
  getMasterSku: `SELECT sellerSKU from products where ismasterSku=1`,
  getSKU: `SELECT sellerSKU,CONCAT_WS('',sellerSKU,'-', itemName) as name FROM products`,
  addProduct:
    "insert into products(sellerId,user,itemName,sellerSKU,status,itemNote,dateAdded,amazonASIN,productId,productIdType,amzlive) VALUES (?)",
  updateProduct:
    "update products set amzlive=1,itemName=?,status=?,itemNote=?,productId=?,productIdType=? where sellerId=? and sellerSKU=?",
  updateProductDetailsbyId:
    "update products set 	amazonOversized=?, imageUrl=?,imageHeight=?,imageWidth=?,packageDimensions=?,dimensions=?,lastUpdateFromAmazon=CURRENT_TIMESTAMP() where sellerSKU=?",
  updateFNSKU:
    "update products set amazonFNSKU=? where sellerId=? and sellerSKU=?",
  addLastSynch: "insert into lastSyne SET ?",
  selectLastSynch: "SELECT  * FROM `lastSyne` order by id DESC LIMIT 10",
  getSuppliers: "select * from suppliersList",
  getSuppliersCount: "select COUNT(*) as totalSupplier from suppliersList",
  addSuppliers: "INSERT INTO suppliersList SET ?",
  deleteSuppliers: "delete from suppliersList where id=?",
  updateSuppliers: "update suppliersList SET ? where id=?",
  updateSuppliersByName: "update suppliersList SET ? where supplierName=?",
  getSuppliersByName:
    "select supplierName from suppliersList where supplierName=?",
  getSuppliersIdByName: "select id from suppliersList where supplierName=?",
  updateProductUI: "update products SET ? where sellerSKU=?",
  addProductImporter: "INSERT INTO products SET ?",
  productSuppliers:
    "select s.*,sl.supplierName,sl.defaultTax from suppliers s  INNER join suppliersList sl on s.supplierID=sl.id where s.productSKU =?",
  addProductSuppliers: "insert into suppliers SET ?",
  updateProductSuppliers:
    "update suppliers SET ? where productSKU=? and supplierID=?",
  deleteProductSuppliers:
    "delete from suppliers where productSKU=? and supplierID=?",
  getProductSuppliers:
    "select id from suppliers where productSKU=? and supplierID=?",
  getProductSuppliersAll: "select * from suppliers ORDER BY costPerUnit",
  getBinLocations: "SELECT * FROM binlocation WHERE warehouseId=?",
  addBinLocations: "insert into binlocation SET ?",
  getWarehouse: "SELECT * FROM warehouse",
  addWarehouse: "insert into warehouse SET ?",
  updateWarehouse:
    "update warehouse SET name=?, address=?, description=? where id=?",
  deleteWarehouse: "delete from warehouse where id=?",
  deleteBinLocation: "delete from binlocation where id=?",
  addBinLocation: "insert into binlocation SET ?",
  updateBinLocation: "update binlocation SET name=?, description=? where id=?",
  getBinLocationsbyName:
    "SELECT * FROM binlocation WHERE warehouseId=? and name=?",
  validateBilocation:
    "SELECT GROUP_CONCAT(sku) as sellerSKU from inventorystock where warehouseId=? and locationid=? and sku !=?",
  removeproductlocation:
    "delete from inventorystock  where warehouseId=? and locationid=? and sku !=?",
  getAllKitProducts:
    "SELECT imageUrl,sellerSKU,itemName,amazonASIN from products where kit != true and sellerSKU !=? and LOWER(sellerSKU) LIKE ? or LOWER(itemName) like ? or LOWER(amazonASIN) like ?",
  addkitproduct: "INSERT INTO kitProducts SET ?",
  getKitProducts:
    "SELECT p.imageUrl,kt.count,kt.sku as sellerSKU,p.itemName,p.amazonASIN from kitProducts kt inner join products p on kt.sku= p.sellerSKU where kt.parentSku=?",
  getKitProductsWithLocation:
    "SELECT p.imageUrl,kt.count,kt.sku as sellerSKU,p.itemName,p.amazonASIN,location.stock as localCount,location.name as location from kitProducts kt inner join products p on kt.sku= p.sellerSKU  left join(select stock, inventorystock.sku, binlocation.name,masterSKU from inventorystock left JOIN binlocation on inventorystock.locationid = binlocation.id WHERE inventorystock.warehouseId = ?) as location ON location.sku = kt.sku where kt.parentSku = ?",
  updateProductKitStatus: "update products set kit=? where sellerSKU=?",
  deleteKitProduct: "DELETE from  kitProducts where sku=? and parentSku=?",
  updateKitCount: "update kitProducts set count=? where sku=? and parentSku=?",
  updatekitname: "update products set itemNameLocal=? where sellerSKU=?",
  updateInventoryStock:
    "update inventorystock set stock=?,masterSKU=? where sku =? and warehouseId=?",
  updateInventoryStockNoMaster:
    "update inventorystock set stock=? where sku =? and warehouseId=?",
  addInventoryStock: "insert into inventorystock set ?",
  getInventoryStock:
    "select * from inventorystock where sku =? and warehouseId=?",
  updateInventoryStockBySku:
    "update inventorystock set stock=?,locationid=? where sku =? and warehouseId=?",
  localInventory:
    "select p1.*,t1.binlocationname,t1.warehousename, t1.warehouseId,t1.locationid,t1.stock from (SELECT p.*,bin.name as binlocationname,wh.name as warehousename, stock.warehouseId,stock.locationid,stock.stock from products p LEFT JOIN inventorystock stock on p.sellerSKU=stock.sku LEFT JOIN binlocation bin on stock.locationid=bin.id LEFT JOIN warehouse wh on stock.warehouseId=wh.id WHERE stock.warehouseId=?)t1 right JOIN products p1 on p1.sellerSKU = t1.sellerSKU",
  localInventoryCount:
    "select COUNT(*) as totalLocation from (SELECT p.*,bin.name as binlocationname,wh.name as warehousename, stock.warehouseId,stock.locationid,stock.stock from products p LEFT JOIN inventorystock stock on p.sellerSKU=stock.sku LEFT JOIN binlocation bin on stock.locationid=bin.id LEFT JOIN warehouse wh on stock.warehouseId=wh.id WHERE stock.warehouseId=?)t1 right JOIN products p1 on p1.sellerSKU = t1.sellerSKU",
  updateInventoryLocation:
    "update inventorystock set  locationid=? where sku =? and warehouseId=?",
  removeLocationbyWarehouse:
    "update inventorystock set locationid=null where warehouseId=? and locationid=?",
  updateInventoryStockEmpty:
    "update inventorystock set stock=0 where id not in(?) and warehouseId=?",
  allUsers:
    "select ID ,email,role,firstname,middlename,lastname,creationdate,enable from users",
  enableDisableUser: "update users SET enable =? where ID=?",
  deleteUser: "DELETE from  users where ID=?",
  getRoles: "select * from roles",
  updateRoles: "update users set  role=? where email=?",
  savePurchaseOrder: "insert into purchase_orders set ?",
  getPurchaseOrder:
    "SELECT id,is_virtual,reference,remoteId,reference2,details,status,Vendor,source_warehouse_display_name,source,warehouse_display_name,total_ordered,currency,sent_date,created_date,created_by,expected_date,payment_date,shipment_date,received_date,shipping_handling,email_sent,shipment_method,payment_terms,full_total,total,total_ordered,total_received,total_sent,total_remaining,notes,last_modified,replenishment_type,automation_reference,source_of_creation,removed,items FROM purchase_orders",
  getPurchaseOrderCount:
    "SELECT COUNT(*) as totalOrders FROM purchase_orders where is_virtual <1 || is_virtual is null",
  getVirtualPurchaseOrder:
    "SELECT id,is_virtual,reference,remoteId,reference2,details,status,Vendor,warehouse,source_warehouse_display_name,source,warehouse_display_name,total_ordered,currency,sent_date,created_date,created_by,expected_date,payment_date,shipment_date,received_date,shipping_handling,email_sent,shipment_method,payment_terms,full_total,total,total_ordered,total_received,total_sent,total_remaining,notes,last_modified,replenishment_type,automation_reference,source_of_creation,removed,items FROM purchase_orders",
  getVirtualPurchaseOrderCount:
    "SELECT COUNT(*) as totalOrders FROM purchase_orders where is_virtual =?",
  getVirtualShipmentById:
    "SELECT id,is_virtual,reference,warehouse,remoteId,reference2,details,status,Vendor,source_warehouse_display_name,source,warehouse_display_name,total_ordered,currency,sent_date,created_date,created_by,expected_date,payment_date,shipment_date,received_date,shipping_handling,email_sent,shipment_method,payment_terms,full_total,total,total_ordered,total_received,total_sent,total_remaining,notes,last_modified,replenishment_type,automation_reference,source_of_creation,removed,items FROM purchase_orders where is_virtual =1 and id=? ORDER by last_modified DESC",
  deletePurchaseOrder: "DELETE  FROM purchase_orders where is_virtual is null",
  updateVirtualShipmentById: "UPDATE purchase_orders set items=? WHERE id=?",
  removeVirtualShipmentById:
    "UPDATE purchase_orders set is_virtual=2,status=? WHERE id=?",
  updateShipmenStatus: "UPDATE purchase_orders set status=? WHERE remoteId=?",
  getShipmentByShipmentId:
    "select  status from purchase_orders WHERE remoteId=?",
  getShipmentByName: "select  id from purchase_orders WHERE LOWER(reference)=?",

  getTableColumns: "SHOW COLUMNS FROM ??",

  addRestock: "insert into restock SET ?",
  updateRestock: "update restock SET ? where amz_sku=? and market_place=?",
  deleteRestock: "delete restock where azm_sku=? and market_place=?",
  getRestockData: "select * from restock",
  getRestockFullData: `select r1.*, bl.name as locationname,warehouse.name as warehousename,invenStk.stock,p1.masterSKU,p1.casePackQuantity,p1.amazonASIN,p1.amazonFNSKU, p1.imageUrl,p1.imageHeight,p1.imageWidth,p1.sellerSKU,p1.itemName,p1.itemNameLocal,p1.kit,p1.reshippingCost,p1.prepMaterialCost,p1.prepLaborCost from restock r1
                            left join products p1 on r1.amz_sku = p1.sellerSKU
                            left JOIN inventorystock invenStk on invenStk.sku = r1.amz_sku
                            left JOIN binlocation bl on invenStk.locationid = bl.id
                            left JOIN warehouse  on warehouse.id = invenStk.warehouseId`,
  getRestockFullDataCount: `select count(*) as totalInventories from restock r1
                            left join products p1 on r1.amz_sku = p1.sellerSKU
                            left JOIN inventorystock invenStk on invenStk.sku = r1.amz_sku
                            left JOIN binlocation bl on invenStk.locationid = bl.id
                            left JOIN warehouse  on warehouse.id = invenStk.warehouseId`,

  getRestockSku: `select market_place,amz_sku,amz_current_price from restock left JOIN products on restock.amz_sku=products.sellerSKU where products.status='Active'`,
  getRestocktoGetFee: `select market_place,amz_sku,amz_current_price from restock left JOIN products on restock.amz_sku=products.sellerSKU where restock.amz_fee_estimate is null`,
  addHistory:
    "insert into audit(type,update_by,old_value,new_value) values(?,?,?,?)",
  getAllHistory:
    "select * from audit where date between ? and ? and type = ? and (old_value like ? or  new_value like ?)",
  getProfit: `SELECT sup.*,imageUrl,imageHeight,imageWidth,sellerSKU,reshippingCost,prepMaterialCost,prepLaborCost,amz_current_price,amz_units_ordered7,amz_avg_selling_price7,amz_avg_profit7,amz_total_sell_amt7,amz_units_ordered30,amz_avg_selling_price30,amz_avg_profit30,amz_total_sell_amt30,amz_units_ordered90,amz_avg_selling_price90,amz_avg_profit90,amz_total_sell_amt90,amz_fee_estimate FROM products left join restock on products.sellerSKU=restock.amz_sku left join (SELECT MIN(costPerUnit) as costPerUnit ,productSKU,inboundShippingCost FROM suppliers group by productSKU) as sup on products.sellerSKU =sup.productSKU`,
  getProfitCount: `SELECT count(*) as totalProfits FROM products left join restock on products.sellerSKU=restock.amz_sku left join (SELECT MIN(costPerUnit) as costPerUnit ,productSKU,inboundShippingCost FROM suppliers group by productSKU) as sup on products.sellerSKU =sup.productSKU`,
  insertFilterPresets: `insert into filterPresets(userId, filterQuery, tabName, presetName) values(?)`,
  getUserByID: `Select * from users where ID = ?`,
  getFilterByTabName:
    "SELECT * FROM filterPresets WHERE tabName = ? AND userId = ?",
  getFilterByPresetName:
    "SELECT * FROM filterPresets WHERE tabName = ? AND userId = ? AND presetName = ? LIMIT 0, 1",
  getFillerQueryById:
    "SELECT filterQuery FROM filterPresets WHERE id = ? AND userId = ? LIMIT 0, 1",
};
