class Format {
  /**
   * Transforms a string into sentence case.
   * @param {string} string - The string to humanize.
   * @return {string} - A humanized string.
   */
  static humanize(string) {
    const result = string.replace(/([A-Z])/g, ' $1').toLowerCase().trim().split(' ');

    // Remove the "is" prefix from boolean properties.
    if (result[0] === 'is') {
      result.shift();
    }

    return result.join(' ').charAt(0).toUpperCase() + result.join(' ').slice(1);
  }

  /**
   * Converts a string into a hyphenated string.
   * @param {string} string - The string to hyphenize.
   * @return {string} - A hyphenized string.
   */
  static hyphenize(string) {
    return string.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
  }

  /**
   * Transforms a hyphenated string into title-case. Removes the terra prefix.
   * Example: terra-button-group -> Button Group.
   * @param {string} string - The string to titleize.
   * @param {string} delimiter - The delimiter to insert between words.
   * @return {string} - A titleized string.
   */
  static titleize(string, delimiter = '') {
    const title = string.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(delimiter);
    return title.replace('Terra', '').trim();
  }
}

module.exports = Format;
