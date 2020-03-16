export default class Price {
  /**
   * @param {string} currency
   * @param {UNITS} unit
   * @param {number} value the price expressed in the "unit" for the "currency"
   */
  constructor({ currency, unit, value }) {
    this.currency = currency;
    this.unit = unit;
    this.value = value;
  }
}
