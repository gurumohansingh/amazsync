const mysql = require("../mysql"),
    { getAllKitProducts, addkitproduct, getKitProducts, deleteKitProduct, updateProductKitStatus } = require("../../util/sqlquery")

class locationService {
    getAllKitProducts(sku) {
        return new Promise((resolve, reject) => {
            mysql.query(getAllKitProducts, sku)
                .then(products => resolve(products))
                .catch(err => reject(err));
        })
    }
    getKitProducts(sku) {
        return new Promise((resolve, reject) => {
            mysql.query(getKitProducts, sku)
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
