import { UNITS } from './catalog-price.constants';

export default class CatalogPriceBuilder {
  constructor({ withoutTax, withTax, ovhSubsidiary }) {
    this.price = {
      withoutTax,
      withTax,
    };

    this.ovhSubsidiary = ovhSubsidiary;
  }

  addUnit(unit) {
    if (!UNITS[unit]) {
      throw new RangeError('');
    }

    this.unit = unit;

    return this;
  }

  build() {
    return {
      price: {
        withoutTax: this.price.withoutTax,
        withTax: this.price.withTax,
      },
    };
  }
}
