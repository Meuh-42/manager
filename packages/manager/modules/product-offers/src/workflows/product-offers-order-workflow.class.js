import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';

import Workflow from './product-offers-workflow.class';

import { CATALOG_ITEM_TYPE_NAMES } from './product-offers-workflow.constants';

/**
 * Workflow Class to handle option order
 */
export default class OrderWorkflow extends Workflow {
  /**
   * @param {Object} $translate      AngularJS provider
   * @param {Object} workflowOptions Specific options for this workflow,
   *  must contains the following values:
   *  - {catalog}: Catalog to use from GET '/order/catalog/public/{productName}',
   *  - {catalogItemTypeName}: Item type of which we want catalog information,
   *   as the catalog contains 'addons' and 'plans' where product information
   *  can be found.
   *  - {productName}: The product name to use, to add items for item order.
   *  e.g.: 'webHosting',
   *  - {serviceNameToAddProduct}: Service name of which we will add product/addon.
   *  If set, the order will consist to add option to an existing service.
   *  If null, the order concerns an new product.
   *  - {onBeforePricingGetPlancode}: Method called to get the product/addon plan
   *  code, which will be called after configuration phase, and before pricing
   *  step. Plan code example : webHosting, cloudDB.
   *  - {onGetConfiguration}:
   *  Method to get configuration items that will be added to the order
   *  cart, called when fetching checkout information.
   *  The configuration key list must follow catalog product required
   *  configuration.
   *  This can be found through, GET /order/catalog/public/{productName},
   *  in plans > planItem > configurations.
   *  Example for cloudDB (GET /order/catalog/public/cloudDB, with FR
   *  subsidiary):
   *  configurations = [
   *    {
   *      isCustom: false,
   *      values: [ "gra1" ],
   *      name: "dc",
   *      isMandatory: true
   *    },
   *    {
   *      name: "engine"
   *      values: [
   *        "redis_3.2"
   *        "redis_4.0"
   *        ...
   *      ],
   *      isCustom: false,
   *      isMandatory: true
   *    }
   *  ]
   *  Here, the configuration label will be the 'name' property value,
   *  and the configuration value, one of the 'values' list.
   *  Returned value must be of the following format:
   *  [
   *    {
   *      label: configurationLabel (ex: 'legacy_domain'),
   *      value: configurationValue (ex: 'www.ovhcloud.com'),
   *    }
   *  ];
   * @param {Object} WucOrderCartService Service to handle order cart
   */
  /* @ngInject */
  constructor($q, $translate, workflowOptions, WucOrderCartService) {
    super($q, $translate, workflowOptions);
    this.WucOrderCartService = WucOrderCartService;

    if (!this.catalog) {
      throw new Error('ovhProductOffers-OrderWorkflow requires a catalog');
    }
  }

  /**
   * Get the pricings from the catalog, which match the plan code, which is get
   * by linked method 'onBeforePricingGetPlancode'.
   * @return {Promise} Promise of the catalog pricings
   */
  getPricings() {
    this.pricing = null;
    this.planCode = this.onBeforePricingGetPlancode();

    if (!this.planCode) {
      throw new Error('ovhProductOffers-OrderWorkflow: Invalid plan code');
    }

    if (
      !Object.values(CATALOG_ITEM_TYPE_NAMES).includes(this.catalogItemTypeName)
    ) {
      throw new Error(
        'ovhProductOffers-OrderWorkflow: Invalid catalog item type name',
      );
    }

    const catalogPricings = get(
      this.catalog[this.catalogItemTypeName].find(
        ({ planCode }) => planCode === this.planCode,
      ),
      'pricings',
    );

    if (!catalogPricings) {
      throw new Error(
        `ovhProductOffers-OrderWorkflow: No pricing found for ${this.planCode}`,
      );
    }

    this.pricings = this.computePricing(catalogPricings);

    if (this.hasUniquePricing()) {
      this.currentIndex += 1;
      [this.pricing] = this.pricings;
    }
  }

  /**
   * Creates a new cart, and assign it for option order.
   * @return {Promise} Promise of the created cart
   */
  createNewCart() {
    return this.WucOrderCartService.createNewCart(this.user.ovhSubsidiary).then(
      (cart) => {
        this.cartId = cart.cartId;
        return this.WucOrderCartService.assignCart(this.cartId);
      },
    );
  }

  /**
   * Get the information for option order validation
   * Will tell to upper scope the loading state of the workflow.
   * @return {Promise}
   */
  getValidationInformation() {
    this.updateLoadingStatus('getOfferValidationInformation');
    const pricing = this.pricing || this.pricings[0];

    const configuration = isFunction(this.onGetConfiguration)
      ? this.onGetConfiguration()
      : [];

    const checkoutInformations = {
      product: {
        duration: pricing.getDurationISOFormat(),
        planCode: this.planCode,
        pricingMode: pricing.mode,
        quantity: 1,
      },
      configuration,
    };

    const serviceName = this.serviceNameToAddProduct;

    return this.$q
      .when()
      .then(() => this.createNewCart())
      .then(() =>
        isString(serviceName) && !isEmpty(serviceName)
          ? this.WucOrderCartService.addProductServiceOptionToCart(
              this.cartId,
              this.productName,
              serviceName,
              checkoutInformations.product,
            )
          : this.WucOrderCartService.addProductToCart(
              this.cartId,
              this.productName,
              checkoutInformations.product,
            ),
      )
      .then(({ itemId }) =>
        this.$q.all(
          checkoutInformations.configuration.map(({ label, value }) =>
            this.WucOrderCartService.addConfigurationItem(
              this.cartId,
              itemId,
              label,
              value,
            ),
          ),
        ),
      )
      .then(() => this.WucOrderCartService.getCheckoutInformations(this.cartId))
      .then(({ contracts, prices }) => {
        this.contracts = contracts;
        this.prices = prices;
      })
      .catch((error) =>
        !this.onError || this.onError({ error }) === false
          ? this.$q.reject(error)
          : null,
      )
      .finally(() => {
        this.updateLoadingStatus('getOfferValidationInformation');
      });
  }

  /**
   * Validate the offer
   * Will tell to upper scope the loading state of the workflow.
   * @return {Promise} Promise of the validated detach offer
   */
  validateOffer() {
    this.updateLoadingStatus('validateOffer');

    const autoPayWithPreferredPaymentMethod = !!this.defaultPaymentMethod;
    const checkoutParameters = {
      autoPayWithPreferredPaymentMethod: this.isFreePricing()
        ? true
        : autoPayWithPreferredPaymentMethod,
      waiveRetractationPeriod: false,
    };

    return this.$q
      .when()
      .then(() =>
        this.WucOrderCartService.checkoutCart(this.cartId, checkoutParameters),
      )
      .then((checkout) => {
        const validatedOrder = {
          ...checkout,
          autoPayWithPreferredPaymentMethod,
        };

        if (autoPayWithPreferredPaymentMethod) {
          validatedOrder.paymentMethodLabel = this.defaultPaymentMethod.label;
        }

        this.onSuccess({
          checkout: validatedOrder,
        });
      })
      .catch((error) =>
        !this.onError || this.onError({ error }) === false
          ? this.$q.reject(error)
          : null,
      )
      .finally(() => {
        this.updateLoadingStatus('validateOffer');
      });
  }
}
