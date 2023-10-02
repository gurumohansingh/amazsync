const {
  getProduct,
  getSuppliers,
  getRestockFullData,
  getProfit,
  localInventory,
  getPurchaseOrder,
  getVirtualPurchaseOrder,
} = require("./sqlquery");
const mysql = require("../service/mysql");
const log = require("../service/log");

class CommonUtil {
  static createPaginationAndSortingQuery(query, params, whereClause) {
    if (!query || !params) return query;

    const { limit, start: offset, sorting } = params || {};

    const sortColumn = this.separateColumn(sorting);

    if (sortColumn) {
      const order = sortColumn.specialChar === "+" ? "ASC" : "DESC";

      query += ` ORDER BY ?? ${order}`;
      whereClause.push(sortColumn.columnName);
    }

    if (limit) {
      query += ` LIMIT ?`;
      whereClause.push(parseInt(limit, 10));
    }

    if (offset) {
      query += ` OFFSET ?`;
      whereClause.push(parseInt(offset, 10));
    }

    return query;
  }

  static separateColumn(str) {
    if (!str) return null;

    const regex = /^([+-]?)(\w+)$/;
    const matches = str.match(regex);
    if (matches && matches.length === 3) {
      const specialChar = matches[1] || "+";
      const columnName = matches[2];
      return { specialChar, columnName };
    }
    return null;
  }

  static convertQueryToMySqlQuery({ tabName, filterQuery, queryType }) {
    let baseQuery = this.getBaseQuery(tabName, queryType);

    baseQuery = baseQuery.replace(/\n\s*/g, " ");

    // Replace the operators and functions with their SQL equivalents
    let sqlString = filterQuery
      .replace(/ ne /g, "<>")
      .replace(/ eq /g, "=")
      .replace(/ lt /g, "<")
      .replace(/ le /g, "<=")
      .replace(/ gt /g, ">")
      .replace(/ ge /g, ">=")
      .replace(/startswith\(tolower\(([^)]*)\),'([^']*)'\)/g, "$1 LIKE '$2%'")
      .replace(/endswith\(tolower\(([^)]*)\),'([^']*)'\)/g, "$1 LIKE '%$2'")
      .replace(/substringof\('([^']*)',tolower\(([^)]*)\)\)/g, "$2 LIKE '%$1%'")
      .replace(/\bnot\b/gi, "NOT")
      .replace(/(\d+)([a-zA-Z]+)/g, "$1")
      .replace(/ and /g, " AND ")
      .replace(/ or /g, " OR ")
      .replace(/= null/g, "IS NULL")
      .replace(/<> null/g, "IS NOT NULL");
    if (
      tabName === "inventory" ||
      tabName === "profit" ||
      tabName === "restock"
    ) {
      // convert baseQuery to subquery for the custom filters to work correctly.
      return `SELECT * FROM (${baseQuery}) AS subquery WHERE ${sqlString}`;
    } else {
      return `${baseQuery} WHERE ${sqlString}`;
    }
  }

  static getBaseQuery(tab, type) {
    if (tab === "product") {
      return getProduct;
    } else if (tab === "suppliers") {
      return getSuppliers;
    } else if (tab === "restock") {
      return getRestockFullData;
    } else if (tab === "profit") {
      return getProfit;
    } else if (tab === "inventory") {
      return localInventory;
    } else if (tab === "shipment") {
      if (!type || type == 0) {
        return getPurchaseOrder;
      } else {
        return getVirtualPurchaseOrder;
      }
    }
  }
  //Function to execute queries in batches.
  static async queryBatcher(batchSize, data) {
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      log.info("Query Batch:", i, i + batchSize);
      await batch.forEach(async ({ query, params }) => {
        try {
          await mysql.query(query, [...params]);
        } catch (err) {
          throw err;
        }
      });
    }
  }
  //Function to resolve promises.
  static async promiseResolver(promises) {
    try {
      const responses = await Promise.all(promises);
      return responses;
    } catch (error) {
      log.error("promiseResolver error:", error);
      throw error;
    }
  }
}

module.exports = CommonUtil;
