const mysql = require("../mysql"),
    { getRestockFullData, getRestockFullAllData,getRestockSku,getRestocktoGetFee } = require("../../util/sqlquery");
const suppliersService  =require("../../service/products/suppliersService");
class restockService {
    getRestock(wareHouse, marketPlace) {
        return new Promise(async(resolve, reject) => {
            var sql = getRestockFullData;
            var params = [marketPlace, wareHouse];
            if (wareHouse == "" || wareHouse == null) {
                var sql = getRestockFullAllData;
                var params = [marketPlace];
            }
            var restock= await mysql.query(sql, params);
             var finalrestock =await this.prepareRestock(restock);
             resolve(finalrestock);
        })
    }
    async prepareRestock(restock){
        var productSuppliers= await suppliersService.getAllProdcutSupplier();
        restock.forEach(element => {
            var supplier =productSuppliers.find((productSupplier)=>{
                return element.sellerSKU==productSupplier.productSKU
            })
            var supplierCost=0;
            var amzFee=0;
            if(supplier){
                supplierCost=supplier.costPerUnit? +supplier.costPerUnit:0+supplier.inboundShippingCost? +supplier.inboundShippingCost:0;
                
            }
            amzFee= element.amz_fee_estimate?element.amz_fee_estimate:0
            element["cost_per_unit"]= (+element.reshippingCost + +element.prepMaterialCost + +element.prepLaborCost +supplierCost).toFixed(2);
            element["profit"]= (element.amz_current_price - amzFee - element["cost_per_unit"]).toFixed(2);
            element["productRoi"]=(element["profit"]/element["cost_per_unit"]).toFixed(2)
            element["amz_avg_profit7"]= (element["profit"]*element["amz_units_ordered7"]).toFixed(2)
            element["amz_avg_profit30"]= (element["profit"]*element["amz_units_ordered30"]).toFixed(2)
            element["amz_avg_profit90"]= (element["profit"]*element["amz_units_ordered90"]).toFixed(2)

            element["productRoi7"]=((element['amz_avg_selling_price7'] - amzFee - element["cost_per_unit"])/element["cost_per_unit"]).toFixed(2)
            element["productRoi30"]=((element['amz_avg_selling_price30'] - amzFee - element["cost_per_unit"])/element["cost_per_unit"]).toFixed(2)
            element["productRoi90"]=((element['amz_avg_selling_price90'] - amzFee - element["cost_per_unit"])/element["cost_per_unit"]).toFixed(2)
        });
        return restock;
       
    }
    getAllRestock() {
        return new Promise((resolve, reject) => {           
            mysql.query(getRestockSku, null)
                .then(restock => resolve(restock))
                .catch(err => reject(err));
        })
    }

    getRestocktoGetFee() {
        return new Promise((resolve, reject) => {           
            mysql.query(getRestocktoGetFee, null)
                .then(restock => resolve(restock))
                .catch(err => reject(err));
        })
    }
}
module.exports = new restockService;
