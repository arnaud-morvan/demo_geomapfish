<%
from json import dumps
%>
Ext.onReady(function() {
    // Ext global settings
    Ext.BLANK_IMAGE_URL = "${request.static_url('demo:static/lib/cgxp/ext/Ext/resources/images/default/s.gif') | n}";
    Ext.QuickTips.init();

    // OpenLayers global settings
    OpenLayers.Number.thousandsSeparator = ' ';
    OpenLayers.DOTS_PER_INCH = 96;
    OpenLayers.ProxyHost = "${request.route_url('ogcproxy') | n}?url=";
    OpenLayers.ImgPath = "${request.static_url('demo:static/lib/cgxp/core/src/theme/img/ol/') | n}";
    OpenLayers.Lang.setCode("${lang}");

    // GeoExt global settings
    GeoExt.Lang.set("${lang}");

<% bounds = user.role.bounds if user else None %>
% if bounds:
    var INITIAL_EXTENT = ${dumps(bounds)};
% else:
    var INITIAL_EXTENT = [420000, 30000, 900000, 350000];
% endif
    var RESTRICTED_EXTENT = [420000, 30000, 900000, 350000];

    // Themes definitions
    var THEMES = {
        "local": ${themes | n}
    % if external_themes:
        , "external": ${external_themes | n}
    % endif
    };

    // Server errors (if any)
    var serverError = ${serverError | n};

    // Used to transmit event through the application
    var EVENTS = new Ext.util.Observable();

    var WMTS_OPTIONS = {
        url: ${tiles_url | n},
        getURL: function() {
            var url = OpenLayers.Layer.WMTS.prototype.getURL.apply(this, arguments);
            return url + "?${'&'.join(['%s=%s' % p for p in version_params.items()]) | n}";
        },
        displayInLayerSwitcher: false,
        requestEncoding: 'REST',
        buffer: 0,
        transitionEffect: "resize",
        visibility: false,
        style: 'default',
        dimensions: ['TIME'],
        params: {
            'time': '2014'
        },
        matrixSet: 'swissgrid',
        maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
        projection: new OpenLayers.Projection("EPSG:21781"),
        units: "m",
        formatSuffix: 'png',
        serverResolutions: [1000,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5,0.25,0.1,0.05]
    };

    app = new gxp.Viewer({

        // viewer config
        portalConfig: {
            layout: 'border',
            items: [
                'app-map',
            {
                id: 'left-panel',
                region: 'west',
                width: 300,
                layout: "vbox",
                layoutConfig: {
                    align: "stretch"
                }
            }]
        },

        // tools
        tools: [{
            ptype: 'cgxp_editing',
            layerTreeId: 'layertree',
            layersURL: "${request.route_url('layers_root') | n}",
            metadataParams: ${dumps(version_role_params) | n}
        },
        {
            ptype: 'cgxp_themeselector',
            outputTarget: 'left-panel',
            outputConfig: {
                layout: 'fit',
                style: 'padding: 3px 0 3px 3px;'
            },
            layerTreeId: 'layertree',
            themes: THEMES
        },
        {
            ptype: "cgxp_themefinder",
            outputTarget: "left-panel",
            layerTreeId: "layertree",
            themes: THEMES,
            outputConfig: {
                layout: "fit",
                style: "padding: 3px;"
            }
        },
        {
            ptype: "cgxp_layertree",
            id: "layertree",
            events: EVENTS,
            outputConfig: {
                header: false,
                flex: 1,
                layout: 'fit',
                autoScroll: true,
                themes: THEMES,
                wmsURL: '${request.route_url('mapserverproxy') | n}'
            },
            outputTarget: 'left-panel'
        },
        {
            ptype: "cgxp_permalink",
            id: "permalink",
            actionTarget: "map.tbar",
            shortenerCreateURL: "${request.route_url('shortener_create') | n}"
        },
        {
            ptype: "cgxp_menushortcut",
            type: '->'
        },
        {
            ptype: "cgxp_login",
            actionTarget: "map.tbar",
            events: EVENTS,
    % if user:
            username: "${user.username}",
    % endif
            loginURL: "${request.route_url('login') | n}",
            logoutURL: "${request.route_url('logout') | n}"
        },
        {
            ptype: "cgxp_mapopacityslider",
            defaultBaseLayerRef: "${functionality['default_basemap'][0] | n}",
            permalinkId: "permalink"
        }],

        // layer sources
        sources: {
            "olsource": {
                ptype: "gxp_olsource"
            }
        },

        // map and layers
        map: {
            id: "app-map", // id needed to reference map in portalConfig above
            stateId: "map",
            xtype: 'cgxp_mappanel',
            projection: "EPSG:21781",
            units: "m",
            projectionCodes: [21781, 4326],
            extent: INITIAL_EXTENT,
            maxExtent: RESTRICTED_EXTENT,
            restrictedExtent: RESTRICTED_EXTENT,
            stateId: "map",
            resolutions: [1000,500,250,100,50,20,10,5,2.5,1,0.5,0.25,0.1,0.05],
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.KeyboardDefaults(),
                new OpenLayers.Control.PanZoomBar({panIcons: false}),
                new OpenLayers.Control.ArgParser(),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.ScaleLine({
                    geodesic: true,
                    bottomInUnits: false,
                    bottomOutUnits: false
                }),
                new OpenLayers.Control.MousePosition({numDigits: 0})
            ],
            layers: [{
                source: "olsource",
                type: "OpenLayers.Layer.WMTS",
                args: [Ext.applyIf({
                    name: OpenLayers.i18n('ortho'),
                    mapserverLayers: 'ortho',
                    ref: 'ortho',
                    layer: 'ortho',
                    formatSuffix: 'jpeg',
                    opacity: 0
                }, WMTS_OPTIONS)]
            },
            {
                source: "olsource",
                type: "OpenLayers.Layer.WMTS",
                group: 'background',
                args: [Ext.applyIf({
                    name: OpenLayers.i18n('plan'),
                    mapserverLayers: 'plan',
                    ref: 'plan',
                    layer: 'plan',
                    group: 'background'
                }, WMTS_OPTIONS)]
            },
            {
                source: "olsource",
                type: "OpenLayers.Layer",
                group: 'background',
                args: [OpenLayers.i18n('blank'), {
                    displayInLayerSwitcher: false,
                    ref: 'blank',
                    group: 'background'
                }]
            }],
            items: []
        }
    });

    app.on('ready', function() {
        // remove loading message
        Ext.get('loading').remove();
        Ext.fly('loading-mask').fadeOut({
            remove: true
        });

        if (serverError.length > 0) {
            cgxp.tools.openWindow({
                html: serverError.join('<br />')
            }, OpenLayers.i18n("Error notice"), 600, 500);
        }
    }, app);
});
