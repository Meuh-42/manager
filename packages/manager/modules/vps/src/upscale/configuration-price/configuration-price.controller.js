import isString from 'lodash/isString';
import PriceService from '../price/price.service';

export default class {
  $onInit() {
    this.validateLanguage();
    PriceService.validatePrice(this.price);

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
}
