# -*- coding: utf-8 -*-

import distutils.core
from pyramid.config import Configurator
from c2cgeoportal_geoportal import locale_negotiator, add_interface, INTERFACE_TYPE_NGEO
from c2cgeoportal_geoportal.lib.authentication import create_authentication
from demo_geoportal.resources import Root


def main(global_config, **settings):
    """
    This function returns a Pyramid WSGI application.
    """
    del global_config  # Unused

    config = Configurator(
        root_factory=Root, settings=settings,
        locale_negotiator=locale_negotiator,
        authentication_policy=create_authentication(settings)
    )

    # Workaround to not have the error: distutils.errors.DistutilsArgError: no commands supplied
    distutils.core._setup_stop_after = 'config'
    config.include('c2cgeoportal_geoportal')
    distutils.core._setup_stop_after = None

    config.add_translation_dirs('demo_geoportal:locale/')

    # Scan view decorator for adding routes
    config.scan()

    # Add the interfaces
    for interface in config.get_settings().get("interfaces", []):
        add_interface(
            config,
            interface['name'],
            interface.get('type', INTERFACE_TYPE_NGEO),
            default=interface.get('default', False)
        )

    return config.make_wsgi_app()
