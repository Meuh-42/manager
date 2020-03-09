import controller from './load-balancer.controller';
import template from './load-balancer.html';

export default {
  bindings: {
    guideUrl: '<',
    loadBalancers: '<',
    projectId: '<',
  },
  controller,
  template,
};
