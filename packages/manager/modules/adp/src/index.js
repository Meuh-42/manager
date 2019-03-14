import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerAdp';


angular.module(moduleName, [
  'ui.router',
  'oc.lazyLoad',
  'ovhManagerCore',
])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('adp.**', {
        url: '/adp',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./adp.component')
            .then(mod => $ocLazyLoad.inject(mod.default || mod));
        },
      });
  });

export default moduleName;
