import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import angular from 'angular';
import ovhManagerOtb from '@ovh-ux/manager-overthebox';

angular.module('overtheboxApp', [ovhManagerOtb]);
