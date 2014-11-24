# -*- coding: utf-8 -*-

from pyramid.config import Configurator
from c2cgeoportal import locale_negotiator, add_interface, INTERFACE_TYPE_SENCHA_TOUCH
from c2cgeoportal.resources import FAModels
from c2cgeoportal.lib.authentication import create_authentication
from demo.resources import Root


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(
        root_factory=Root, settings=settings,
        locale_negotiator=locale_negotiator,
        authentication_policy=create_authentication(settings)
    )

    config.add_settings({'srid': 3857})

    config.include('c2cgeoportal')

    config.add_translation_dirs('demo:locale/')

    from pyramid.settings import asbool
    if asbool(config.get_settings().get('enable_admin_interface')):
        config.formalchemy_admin(
            'admin', package='demo',
            view='fa.jquery.pyramid.ModelView', factory=FAModels
        )

    config.add_route('checker_all', '/checker_all')

    # scan view decorator for adding routes
    config.scan()

    # add the main static view
    config.add_static_view(
        'proj', 'demo:static',
        cache_max_age=int(config.get_settings()["default_max_age"])
    )

    add_interface(config)
    add_interface(config, 'edit')
    add_interface(config, 'routing')
    add_interface(config, 'mobile', INTERFACE_TYPE_SENCHA_TOUCH)

    return config.make_wsgi_app()
