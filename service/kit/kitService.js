const mysql = require("../mysql"),
    { getAllKitProducts, addkitproduct, getKitProducts, deleteKitProduct, updateProductKitStatus, updateKitCount, updatekitname, getKitProductsWithLocation } = require("../../util/sqlquery")

class locationService {
    getAllKitProducts(sku) {
        return new Promise((resolve, reject) => {
            mysql.query(getAllKitProducts, sku)
                .then(products => resolve(products))
                .catch(err => reject(err));
        })
    }
    getKitProducts(sku, warehouseId) {
        return new Promise((resolve, reject) => {
            var dynamicQry = getKitProducts, params = sku;

            if (warehouseId != "") {
                dynamicQry = getKitProductsWithLocation;
                params = [warehouseId, sku];
            }
            mysql.query(dynamicQry, params)
                .then(products => resolve(products))
                .catch(err => reject(err));
        })
    }

    addkitproduct(params) {
        return new Promise((resolve, reject) => {
            mysql.query(addkitproduct, params)
                .then((kit) => {
                    this.updateKitStatus(params['parentSku']);
                    resolve(kit)
                })
                .catch(err => reject(err));
        })
    }

    deletekitproduct(params) {
        return new Promise((resolve, reject) => {
            mysql.query(deleteKitProduct, params)
                .then((kit) => {
                    this.updateKitStatus(params[1]);
                    resolve(kit)
                })
                .catch(err => reject(err));
        })
    }

    updatekitcount(params) {
        return new Promise((resolve, reject) => {
            mysql.query(updateKitCount, params)
                .then((kit) => {
                    resolve(kit)
                })
                .catch(err => reject(err));
        })
    }
    updatekitname(params) {
        return new Promise((resolve, reject) => {
            mysql.query(updatekitname, params)
                .then((kit) => {
                    resolve(kit)
                })
                .catch(err => reject(err));
        })
    }
    updateKitStatus(sku) {
        this.getKitProducts(sku)
            .then((kit) => {
                if (kit.length > 0) {
                    mysql.query(updateProductKitStatus, [true, sku]);
                } else {
                    mysql.query(updateProductKitStatus, [false, sku]);
                }
            })
    }
}
module.exports = new locationService;
