import template from './products.html';

export default {
  bindings: {
    products: '<',
    onProductSelect: '&',
  },
  template,
};
