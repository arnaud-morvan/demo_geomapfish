/**
 * Application entry point.
 *
 * This file includes `import`'s for all the components/directives used
 * by the HTML page and the controller to provide the configuration.
 */

import './sass/desktop_alt.scss';
import 'gmf/controllers/desktop.scss';
import './sass/vars_desktop_alt.scss';

import angular from 'angular';
import gmfControllersAbstractDesktopController, {AbstractDesktopController}
  from 'gmf/controllers/AbstractDesktopController.js';
import demoBase from '../demomodule.js';
import gmfImportModule from 'gmf/import/module.js';
import gmfFloorModule from 'gmf/floor/module.js';
import ngeoGooglestreetviewModule from 'ngeo/googlestreetview/module.js';
import ngeoRoutingModule from 'ngeo/routing/module.js';
import EPSG2056 from '@geoblocks/proj/src/EPSG_2056.js';
import EPSG21781 from '@geoblocks/proj/src/EPSG_21781.js';
import ngeoStatemanagerWfsPermalink from 'ngeo/statemanager/WfsPermalink.js';
import {Circle, Fill, Stroke, Style} from 'ol/style.js';

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
class Controller extends AbstractDesktopController {
  /**
   * @param {angular.IScope} $scope Scope.
   * @param {angular.auto.IInjectorService} $injector Main injector.
   * @param {Array<Object<string, string>>} demoFloors Floor dimension values and labels.
   * @ngInject
   */
  constructor($scope, $injector, demoFloors) {
    super({
      srid: 21781,
      mapViewConfig: {
        center: [632464, 185457],
        zoom: 3,
        resolutions: [250, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05]
      }
    }, $scope, $injector);

    /**
     * @type {Array<Object<string, string>>}
     */
    this.floors = demoFloors;

    /**
     * @type {Object<string, string>}
     */
    this.dimensions = {};

    if (this.dimensions.FLOOR == undefined) {
      this.dimensions.FLOOR = '*';
    }

    /**
     * @type {Array<string>}
     */
    this.searchCoordinatesProjections = [EPSG21781, EPSG2056, 'EPSG:4326'];

    /**
     * @type {number}
     */
    this.searchDelay = 500;

    /**
     * @type {boolean}
     */
    this.showInfobar = true;

    /**
     * @type {number[]}
     */
    this.scaleSelectorValues = [250000, 100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 250, 100, 50];

    /**
     * @type {string[]}
     */
    this.elevationLayers = ['srtm-partial'];

    /**
     * @type {Object<string, import('gmf/mobile/measure/pointComponent.js').LayerConfig>}
     */
    this.elevationLayersConfig = {};

    /**
     * @type {Object<string, import('gmf/profile/component.js').ProfileLineConfiguration>}
     */
    this.profileLinesconfiguration = {
      'srtm-partial': {}
    };

    /**
     * @type {Array<import('gmf/map/mousepositionComponent.js').MousePositionProjection>}
     */
    this.mousePositionProjections = [{
      code: 'EPSG:2056',
      label: 'CH1903+ / LV95',
      filter: 'ngeoNumberCoordinates::{x}, {y} m'
    }, {
      code: 'EPSG:21781',
      label: 'CH1903 / LV03',
      filter: 'ngeoNumberCoordinates::{x}, {y} m'
    }, {
      code: 'EPSG:4326',
      label: 'WGS84',
      filter: 'ngeoDMSCoordinates:2'
    }];

    /**
     * @type {GridMergeTabs}
     */
    this.gridMergeTabs = {
      'OSM_time_merged': ['osm_time', 'osm_time2'],
      'transport (merged)': ['fuel', 'parking'],
      'Learning [merged]': ['information', 'bus_stop']
    };

    const radius = 5;
    const fill = new Fill({color: [255, 255, 255, 0.6]});
    const stroke = new Stroke({color: [255, 0, 0, 1], width: 2});
    const image = new Circle({fill, radius, stroke});
    const defaultSearchStyle = new Style({
      fill,
      image,
      stroke
    });

    /**
     * @type {Object<string, ol.style.Style>} Map of styles for search overlay.
     * @export
     */
    this.searchStyles = {
      'default': defaultSearchStyle
    };

    // Allow angular-gettext-tools to collect the strings to translate
    /** @type {angular.gettext.gettextCatalog} */
    const gettextCatalog = $injector.get('gettextCatalog');
    gettextCatalog.getString('OSM_time_merged');
    gettextCatalog.getString('OSM_time (merged)');
    gettextCatalog.getString('Learning [merged]');
    gettextCatalog.getString('Add a theme');
    gettextCatalog.getString('Add a sub theme');
    gettextCatalog.getString('Add a layer');

    /**
     * @type {string}
     */
    this.bgOpacityOptions = 'orthophoto';
  }

  /**
   * @param {JQueryEventObject} event keydown event.
   */
  onKeydown(event) {
    if (event && event.ctrlKey && event.key === 'p') {
      this.printPanelActive = true;
      event.preventDefault();
    }
  }
}

/**
 * @hidden
 */
const module = angular.module('Appdesktop_alt', [
  demoBase.name,
  gmfControllersAbstractDesktopController.name,
  gmfImportModule.name,
  gmfFloorModule.name,
  ngeoRoutingModule.name,
  ngeoGooglestreetviewModule.name,
  ngeoStatemanagerWfsPermalink.name,
]);

module.controller('AlternativeDesktopController', Controller);

export default module;
