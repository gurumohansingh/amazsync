class CommonUtil {
  static createPaginationAndSortingQuery(query, params, whereClause) {
    if (!query || !params) return query;

    const { limit, start: offset, sorting } = params || {};

    const sortColumn = this.separateColumn(sorting)

    if (sortColumn) {
      const order = sortColumn.specialChar === '+' ? 'ASC' : 'DESC';

      query += ` ORDER BY ?? ${order}`
      whereClause.push(sortColumn.columnName);
    }

    if (limit) {
      query += ` LIMIT ?`
      whereClause.push(parseInt(limit, 10));
    }

    if (offset) {
      query += ` OFFSET ?`
      whereClause.push(parseInt(offset, 10));
    }

    return query;
  }
  static separateColumn(str) {
    if (!str) return null;

    const regex = /^([+-]?)(\w+)$/;
    const matches = str.match(regex);
    if (matches && matches.length === 3) {
      const specialChar = matches[1] || '+';
      const columnName = matches[2];
      return { specialChar, columnName };
    }
    return null;
  }
}

module.exports = CommonUtil;
