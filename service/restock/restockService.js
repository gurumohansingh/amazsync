const mysql = require("../mysql"),
    { getRestockFullData, getRestockFullAllData,getRestockSku,getRestocktoGetFee, getRestockFullDataCount } = require("../../util/sqlquery");
const suppliersService  =require("../../service/products/suppliersService");
const CommonUtil = require("../../util/common");
class restockService {
    getRestock(queryParams) {
      return new Promise(async(resolve, reject) => {

        let sql = getRestockFullData;
        const params = [];

        sql = this.perpareRestockFilter(queryParams, params, sql)

        sql = CommonUtil.createPaginationAndSortingQuery(sql, queryParams, params)

        const restock = await mysql.query(sql, params.map(param => param.value || param)).catch(err => reject(err));
        const finalrestock =await this.prepareRestock(restock);
        resolve(finalrestock);
      })
    }

    getRestockCount(queryParams) {
      return new Promise(async(resolve, reject) => {

        let sql = getRestockFullDataCount;
        const params = [];

        sql = this.perpareRestockFilter(queryParams, params, sql)

        const restock = await mysql.query(sql, params.map(param => param.value || param)).catch(err => reject(err));
        const finalrestock =await this.prepareRestock(restock);
        resolve(finalrestock);
      })
    }

    perpareRestockFilter(queryParams, params, sql) {
      const { marketPlace, wareHouse, stockFilter, searchParam, recommendedShipDate } = queryParams;

      if (marketPlace) {
        params.push({ key: 'r1.market_place', value: marketPlace })
      }

      if (searchParam) {
        params.push({ key: 'p1.itemName', value: `%${searchParam}%`, isSearch: true })
        params.push({ key: 'p1.amazonASIN', value: `%${searchParam}%`, isSearch: true })
        params.push({ key: 'p1.sellerSKU', value: `%${searchParam}%`, isSearch: true })
      }

      if (wareHouse) {
        params.push({ key: 'warehouse.id', value: wareHouse })
      }

      if (params.length) {
        const searchParams = params.filter((param) => param.isSearch);
        const nonSearchParams = params.filter((param) => !param.isSearch);
      
        if (searchParams.length) {
          sql +=
            " where " +
            searchParams
              .map((param) => `${param.key} LIKE ?`)
              .join(" OR ");
        }
      
        if (nonSearchParams.length) {
          const operator = searchParams.length ? " AND " : " where ";
          sql +=
            operator +
            nonSearchParams
              .map((param) => `${param.key}=?`)
              .join(" AND ");
        }
      }      

      if (stockFilter) {

        let updatedClause = '';
        if (Number(stockFilter) === 2) updatedClause = ' = 0';
        if (Number(stockFilter) === 1) updatedClause = ' > 0';

        if (updatedClause) sql = sql + `${params.length ? ' AND' : ' where'} invenStk.stock ${updatedClause}`
      }

      if (recommendedShipDate) {
        let updatedClause = '';

        switch(recommendedShipDate) {
          case 'today':
            updatedClause = 'DATE(r1.amz_recommended_order_date) = CURDATE()'
            break;
          case 'next7':
            updatedClause = 'DATE(r1.amz_recommended_order_date) > CURDATE() AND DATE(r1.amz_recommended_order_date) <= CURDATE() + INTERVAL 7 DAY';
            break;
          case 'next14':
            updatedClause = 'DATE(r1.amz_recommended_order_date) > CURDATE() AND DATE(r1.amz_recommended_order_date) <= CURDATE() + INTERVAL 14 DAY';
            break;
          case 'next30':
            updatedClause = 'DATE(r1.amz_recommended_order_date) > CURDATE() AND DATE(r1.amz_recommended_order_date) <= CURDATE() + INTERVAL 30 DAY';
            break;
        }

        if (updatedClause) sql = sql + `${params.length ? ' AND' : ' where'} ${updatedClause}`
      }

      return sql
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
