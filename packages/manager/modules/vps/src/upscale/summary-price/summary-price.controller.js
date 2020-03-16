import includes from 'lodash/includes';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import values from 'lodash/values';
import { PAYMENT_TYPES } from './summary-price.constants';
import PriceService from '../price/price.service';

export default class {
  $onInit() {
    this.validateLanguage();
    PriceService.validatePrice(this.price);
    this.validatePaymentType();

    // the variables used in the view
    this.v = {
      price: PriceService.buildPriceToDisplay(this.price, this.language),
    };
  }

  validateLanguage() {
    if (!isString(this.language)) {
      throw new TypeError('Attribute "language" should be of type "string"');
    }
  }

  validatePaymentType() {
    if (!isObject(this.paymentType)) {
      throw new TypeError('Attribute "paymentType" should be of type "object"');
    }

    if (!includes(values(PAYMENT_TYPES), this.paymentType.value)) {
      throw new RangeError(
        `Attribute "paymentType.value" has an invalid value: ${this.paymentType.value}`,
      );
    }

    if (
      this.paymentType.value === PAYMENT_TYPES.UPFRONT &&
      !isNumber(this.paymentType.monthNumber)
    ) {
      throw new TypeError(
        'Attribute "paymentType.monthNumber" should be of type "number"',
      );
    }
  }
}
