/**
 * Application entry point.
 *
 * This file includes `import`'s for all the components/directives used
 * by the HTML page and the controller to provide the configuration.
 */

import 'gmf/controllers/iframe_api.scss';
import angular from 'angular';
import gmfControllersAbstractAPIController, {AbstractAPIController}
  from 'gmf/controllers/AbstractAPIController.js';
import demoBase from '../demomodule.js';
import EPSG2056 from '@geoblocks/proj/src/EPSG_2056.js';
import EPSG21781 from '@geoblocks/proj/src/EPSG_21781.js';

if (!window.requestAnimationFrame) {
  alert('Your browser is not supported, please update it or use another one. You will be redirected.\n\n'
    + 'Votre navigateur n\'est pas supporté, veuillez le mettre à jour ou en utiliser un autre. '
    + 'Vous allez être redirigé.\n\n'
    + 'Ihr Browser wird nicht unterstützt, bitte aktualisieren Sie ihn oder verwenden Sie einen anderen. '
    + 'Sie werden weitergeleitet.');
  window.location.href = 'https://geomapfish.org/';
}


/**
 * @private
 */
class Controller extends AbstractAPIController {
  /**
   * @param {angular.IScope} $scope Scope.
   * @param {angular.auto.IInjectorService} $injector Main injector.
   * @ngInject
   */
  constructor($scope, $injector) {
    super({
      srid: 21781,
      mapViewConfig: {
        center: [632464, 185457],
        zoom: 3,
        resolutions: [250, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05]
      }
    }, $scope, $injector);

    this.EPSG2056 = EPSG2056;
    this.EPSG21781 = EPSG21781;
  }
}

/**
 * @hidden
 */
const module = angular.module('Appiframe_api', [
  demoBase.name,
  gmfControllersAbstractAPIController.name,
]);

module.controller('IframeAPIController', Controller);

export default module;
