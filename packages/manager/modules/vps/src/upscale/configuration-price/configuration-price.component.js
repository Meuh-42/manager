import controller from './configuration-price.controller';
import template from './configuration-price.html';

/**
 * Examples:
 * <vps-upgrade-configuration-price price="{ value: 32.30, unit: 'microcents', currency: 'EUR' }" language="'fr_FR'"></vps-upgrade-configuration-price>
 * <vps-upgrade-configuration-price price="{ value: 32.30, unit: 'cents', currency: 'USD' }" language="'fr_CA'"></vps-upgrade-configuration-price>
 * <vps-upgrade-configuration-price price="{ value: 32.30, unit: 'cents', currency: 'EUR' }" language="'en_US'"></vps-upgrade-configuration-price>
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
