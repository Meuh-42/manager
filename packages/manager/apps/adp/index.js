import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line
import '@ovh-ux/manager-adp';

import angular from 'angular';

angular.module('adpApp', ['ovhManagerAdp']);
