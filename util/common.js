class CommonUtil {
  static createPaginationAndSortingQuery(query, params, whereClause) {
    if (!query || !params) return query;

    const { limit, start: offset, sorting } = params || {};

    const sortColumn = this.separateColumn(sorting);

    if (sortColumn) {
      const order = sortColumn.specialChar === "+" ? "ASC" : "DESC";

      query = query + ` ORDER BY ?? ${order}`;
      whereClause.push(sortColumn.columnName);
    }

    if (limit) {
      query = query + ` LIMIT ?`;
      whereClause.push(parseInt(limit, 10));
    }

    if (offset) {
      query = query + ` OFFSET ?`;
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
  static convertQueryToMySqlQuery(tableName, inputQuery) {
    // Replace the operators and functions with their SQL equivalents
    let sqlString = inputQuery
      .replace(/ ne /g, "<>")
      .replace(/ eq /g, "=")
      .replace(/ lt /g, "<")
      .replace(/ le /g, "<=")
      .replace(/ gt /g, ">")
      .replace(/ ge /g, ">=")
      .replace(/startswith\(tolower\(([^)]*)\),'([^']*)'\)/g, "$1 LIKE '$2%'")
      .replace(/substringof\('([^']*)',tolower\(([^)]*)\)\)/g, "$2 LIKE '%$1%'")
      .replace(/\(endswith\(tolower\(([^)]*)\),'([^']*)'\)\)/g, "$1 LIKE '%$2'")
      .replace(/(\d+)([a-zA-Z]+)/g, "$1")
      .replace(/\bnot\b/gi, "NOT")
      .replace(/ and /g, " AND ")
      .replace(/ or /g, " OR ")
      .replace(/= null/g, "IS NULL")
      .replace(/<> null/g, "IS NOT NULL");

    return `SELECT * FROM ${tableName} WHERE ${sqlString}`;
  }
}

module.exports = CommonUtil;
