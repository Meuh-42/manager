import angular from 'angular';
import 'angular-translate';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import './index.scss';

import component from './component';

const moduleName = 'ovhManagerVpsDashboardTileConfiguration';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    ngOvhTranslateAsyncLoader,
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
