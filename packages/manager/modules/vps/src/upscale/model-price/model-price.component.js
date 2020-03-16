import controller from './model-price.controller';
import template from './model-price.html';

/**
 * Examples:
 * <vps-upgrade-model-price price="{ value: 32.30, unit: 'microcents', currency: 'EUR' }" language="'fr_FR'"></vps-upgrade-model-price>
 * <vps-upgrade-model-price price="{ value: 32.30, unit: 'cents', currency: 'USD' }" language="'fr_CA'"></vps-upgrade-model-price>
 * <vps-upgrade-model-price price="{ value: 32.30, unit: 'cents', currency: 'EUR' }" language="'en_US'"></vps-upgrade-model-price>
 */
export default {
  bindings: {
    /**
     * string
     * formatted the OVHcloud way
     */
    language: '<',
    /**
     * Price
     */
    price: '<',
  },
  controller,
  template,
};
