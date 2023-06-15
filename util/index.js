class UtilHandler {
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

module.exports = UtilHandler