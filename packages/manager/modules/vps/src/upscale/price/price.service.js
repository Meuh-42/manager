import includes from 'lodash/includes';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import values from 'lodash/values';

import TranslateService from '../../../../core/src/translate/translate.service';
import { UNITS } from './price.constants';

export default class PriceService {
  /**
   * @param {Price} price
   * @param {string} language Formatted the OVHcloud way
   */
  static buildPriceToDisplay({ value, unit, currency }, language) {
    const bcp47Language = TranslateService.convertFromOVHToBCP47(language);

    const valueToFormat = unit === UNITS.MICROCENTS ? value / 100000000 : value;

    return Intl.NumberFormat(bcp47Language, {
      style: 'currency',
      currency,
    }).format(valueToFormat);
  }

  static validatePrice(price) {
    if (!isObject(price)) {
      throw new TypeError('Attribute "price" should be of type "object"');
    }

    if (!isNumber(price.value)) {
      throw new TypeError('Attribute "price.value" should be of type "number"');
    }

    if (!includes(values(UNITS), price.unit)) {
      throw new RangeError(
        `Attribute "price.unit" has an invalid value: ${price.unit}`,
      );
    }
  }
}
