const CommonUtil = require("../../util/common");
const mysql = require("../mysql"),
  { getProfit, getProfitCount } = require("../../util/sqlquery");

class profitService {
  getProfit(queryParams) {
    return new Promise((resolve, reject) => {
      const { marketPlace, searchParam } = queryParams;

      let sql = getProfit;
      let params = []

      if (marketPlace) {
        params.push({ key: 'restock.market_place', value: marketPlace })
      }

      if (searchParam) {
        params.push({ key: 'products.itemName', value: `%${searchParam}%`, isSearch: true })
      }

      if (params.length) {
        sql +=
          " where " +
          params
            .map((param) =>
              param.isSearch ? `${param.key} LIKE ?` : `${param.key}=?`
            )
            .join(" AND ");
      }

      sql = CommonUtil.createPaginationAndSortingQuery(sql, queryParams, params)

      mysql
        .query(sql, params.map(param => param.value || param))
        .then((profit) => resolve(profit))
        .catch((err) => reject(err));
    });
  }
  getProfitCountQuery(queryParams) {
    return new Promise((resolve, reject) => {
      const { marketPlace, searchParam } = queryParams;

      let sql = getProfitCount;
      let params = []

      if (marketPlace) {
        params.push({ key: 'restock.market_place', value: marketPlace })
      }

      if (searchParam) {
        params.push({ key: 'products.itemName', value: `%${searchParam}%`, isSearch: true })
      }

      if (params.length) {
        sql +=
          " where " +
          params
            .map((param) =>
              param.isSearch ? `${param.key} LIKE ?` : `${param.key}=?`
            )
            .join(" AND ");
      }

      mysql
        .query(sql, params.map(param => param.value || param))
        .then((profit) => resolve(profit))
        .catch((err) => reject(err));
    });
  }
  
}
module.exports = new profitService();
