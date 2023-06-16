const CommonUtil = require("../../util/common");
const mysql = require("../mysql"),
    { getBinLocations, getWarehouse, addWarehouse, updateWarehouse, deleteWarehouse, addBinLocation, updateBinLocation,
        deleteBinLocation, validateBilocation, removeproductlocation, updateInventoryLocation, updateInventoryStock, addInventoryStock, 
        updateInventoryStockNoMaster,getInventoryStock, localInventory, localInventoryCount } = require("../../util/sqlquery");
const csv = require('csvtojson');
class locationService {
    getbinlocations(warehouseId) {
        return new Promise((resolve, reject) => {
            mysql.query(getBinLocations, warehouseId)
                .then(locations => resolve(locations))
                .catch(err => reject(err));
        })
    }

    updatebinlocations(binLocation) {
        return new Promise((resolve, reject) => {
            mysql.query(updateBinLocation, binLocation)
                .then(binLocation => resolve("Update"))
                .catch(err => reject(err));
        })
    }

    addbinlocations(binlocation) {
        return new Promise((resolve, reject) => {
            mysql.query(addBinLocation, binlocation)
                .then(products => resolve(products))
                .catch(err => reject(err));
        })
    }

    deletebinlocations(id) {
        return new Promise((resolve, reject) => {
            mysql.query(deleteBinLocation, id)
                .then(location => resolve(location))
                .catch(err => reject(err));
        })
    }

    getwarehouses() {
        return new Promise((resolve, reject) => {
            mysql.query(getWarehouse, null)
                .then(warehouses => resolve(warehouses))
                .catch(err => reject(err));
        })
    }

    updatewarehouse(params) {
        return new Promise((resolve, reject) => {
            mysql.query(updateWarehouse, params)
                .then(products => resolve(products))
                .catch(err => reject(err));
        })
    }

    deletewarehouse(params) {
        return new Promise((resolve, reject) => {
            mysql.query(deleteWarehouse, params)
                .then(Warehouse => resolve("Warehouse deleted successfully"))
                .catch(err => reject(err));
        })
    }

    addwarehouse(params) {
        return new Promise((resolve, reject) => {
            mysql.query(addWarehouse, params)
                .then(warehouse => resolve(warehouse))
                .catch(err => reject(err));
        })
    }

    validateBilocation(params) {
        return new Promise((resolve, reject) => {
            mysql.query(validateBilocation, params)
                .then(skulist => resolve(skulist))
                .catch(err => reject(err));
        })
    }

    removeproductlocation(params) {
        return new Promise((resolve, reject) => {
            mysql.query(removeproductlocation, params)
                .then(skulist => resolve(skulist))
                .catch(err => reject(err));
        })
    }
    updateInventoryLocation(params) {
        return new Promise((resolve, reject) => {
            mysql.query(updateInventoryLocation, params)
                .then(skulist => resolve(skulist))
                .catch(err => reject(err));
        })
    }
    addInventoryLocation(params) {
        return new Promise((resolve, reject) => {
            mysql.query(addInventoryStock, params)
                .then(skulist => resolve(skulist))
                .catch(err => reject(err));
        })
    }
    getlocalinventory(params) {
      return new Promise((resolve, reject) => {
        let localInventoryQuery = localInventory;
        const { warehouseId, searchParam, stockFilter, locationFilter } = params || {}

        let whereParams = []

        if (warehouseId) {
          whereParams.push(warehouseId)
        }

        if (searchParam) {
          localInventoryQuery = localInventoryQuery + " where p1.itemName LIKE ?"
          whereParams.push(`%${searchParam}%`);
        }

        if (stockFilter) {
          let whereClause = ' AND'
          if (!localInventoryQuery.includes('where')) whereClause = ' where'

          let updatedClause = '';
          if (Number(stockFilter) === 2) updatedClause = ' = 0';
          if (Number(stockFilter) === 1) updatedClause = ' > 0';
          
          if (updatedClause) localInventoryQuery = localInventoryQuery + `${whereClause} t1.stock ${updatedClause}`
        }

        if (locationFilter) {
          let whereClause = ' AND'
          if (!localInventoryQuery.includes('where')) whereClause = ' where'

          let updatedClause = '';
          if (Number(locationFilter) === 2) updatedClause = ' is null';
          if (Number(locationFilter) === 1) updatedClause = ' is not null';
          
          if (updatedClause) localInventoryQuery = localInventoryQuery + `${whereClause} t1.binlocationname ${updatedClause}`
        }

        localInventoryQuery = CommonUtil.createPaginationAndSortingQuery(localInventoryQuery, params, whereParams)
        
        mysql.query(localInventoryQuery, whereParams)
          .then(list => resolve(list))
          .catch(err => reject(err));
      })
    }
    getLocalInventoryCount(params) {
      return new Promise((resolve, reject) => {
        let localInventoryQuery = localInventoryCount;
        const { warehouseId, searchParam, stockFilter, locationFilter } = params || {}

        let whereParams = []

        if (warehouseId) {
          whereParams.push(warehouseId)
        }

        if (searchParam) {
          localInventoryQuery = localInventoryQuery + " where p1.itemName LIKE ?"
          whereParams.push(`%${searchParam}%`);
        }
        
        if (stockFilter) {
          let whereClause = ' AND'
          if (!localInventoryQuery.includes('where')) whereClause = ' where'

          let updatedClause = '';
          if (Number(stockFilter) === 2) updatedClause = ' = 0';
          if (Number(stockFilter) === 1) updatedClause = ' > 0';
          
          if (updatedClause) localInventoryQuery = localInventoryQuery + `${whereClause} t1.stock ${updatedClause}`
        }

        if (locationFilter) {
          let whereClause = ' AND'
          if (!localInventoryQuery.includes('where')) whereClause = ' where'

          let updatedClause = '';
          if (Number(locationFilter) === 2) updatedClause = ' is null';
          if (Number(locationFilter) === 1) updatedClause = ' is not null';
          
          if (updatedClause) localInventoryQuery = localInventoryQuery + `${whereClause} t1.binlocationname ${updatedClause}`
        }

        mysql.query(localInventoryQuery, whereParams)
          .then(list => resolve(list))
          .catch(err => reject(err));
      })
    }
    getInventoryStock(params) {
        return new Promise((resolve, reject) => {
            mysql.query(getInventoryStock, params)
                .then(list => resolve(list))
                .catch(err => reject(err));
        })
    }
    updateInventoryStock(params) {
        return new Promise((resolve, reject) => {
            mysql.query(updateInventoryStock, params)
                .then(skulist => resolve(skulist))
                .catch(err => reject(err));
        })
    }
    updateInventoryStockNoMaster(params) {
        return new Promise((resolve, reject) => {
            mysql.query(updateInventoryStockNoMaster, params)
                .then(skulist => resolve(skulist))
                .catch(err => reject(err));
        })
    }
    addInventoryStock(params) {
        return new Promise((resolve, reject) => {
            mysql.query(addInventoryStock, params)
                .then(skulist => resolve(skulist))
                .catch(err => reject(err));
        })
    }

    addBulkLocation(warehouseId, csvData) {
        return new Promise((resolve, reject) => {
            var allReq = [];
            csv().fromString(csvData)
                .then((jsonData) => {
                    jsonData.forEach((item) => {
                        var params = { name: item.name, description: item.description, warehouseId: warehouseId }
                        allReq.push(mysql.query(addBinLocation, params));
                    })
                    Promise.all(allReq)
                        .then((result) => {
                            resolve(result)
                        })
                        .catch(error => { reject(error) })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}
module.exports = new locationService;
