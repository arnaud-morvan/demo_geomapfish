FROM camptocamp/geomapfish-build:2.5 as builder

ENV LANGUAGES="en fr de"
ENV VARS_FILE=vars.yaml
ENV CONFIG_VARS sqlalchemy.url sqlalchemy.pool_recycle sqlalchemy.pool_size sqlalchemy.max_overflow \
    sqlalchemy.use_batch_mode sqlalchemy_slave.url sqlalchemy_slave.pool_recycle sqlalchemy_slave.pool_size \
    sqlalchemy_slave.max_overflow sqlalchemy_slave.use_batch_mode schema schema_static enable_admin_interface \
    default_locale_name servers layers available_locale_names cache admin_interface functionalities \
    raster shortener hide_capabilities tinyowsproxy resourceproxy print_url print_get_redirect \
    checker check_collector default_max_age package srid \
    reset_password fulltextsearch global_headers headers authorized_referers hooks stats db_chooser \
    dbsessions urllogin host_forward_host smtp c2c.base_path welcome_email \
    lingua_extractor interfaces_config interfaces devserver_url api

COPY . /tmp/config/

RUN \
    for lang in ${LANGUAGES}; \
    do \
        node /usr/bin/compile-catalog \
            /opt/c2cgeoportal_geoportal/c2cgeoportal_geoportal/locale/${lang}/LC_MESSAGES/ngeo.po \
            /opt/c2cgeoportal_geoportal/c2cgeoportal_geoportal/locale/${lang}/LC_MESSAGES/gmf.po \
            /tmp/config/geoportal/demo_geoportal/locale/${lang}/LC_MESSAGES/demo_geoportal-client.po \
            > /tmp/config/geoportal/demo_geoportal/static/${lang}.json; \
    done && \
    rm -rf /tmp/config/geoportal/demo_geoportal/locale

RUN \
    cd /tmp/config/geoportal/ && \
    c2c-template --vars ${VARS_FILE} \
        --get-config demo_geoportal/config.yaml \
        ${CONFIG_VARS} && \
    pykwalify --data-file demo_geoportal/config.yaml \
        --schema-file CONST_config-schema.yaml && \
    rm CONST_* vars.yaml

###############################################################################

FROM camptocamp/geomapfish-config-build:2.5

ARG PGSCHEMA
ENV PGSCHEMA=$PGSCHEMA

COPY --from=builder /tmp/config/ /tmp/config/

RUN mv /tmp/config/bin/* /usr/bin/ && \
    if [ -e /tmp/config/mapserver ]; then mv /tmp/config/mapserver /etc/; fi && \
    if [ -e /tmp/config/tilegeneration ]; then mv /tmp/config/tilegeneration /etc/; fi && \
    if [ -e /tmp/config/qgisserver ]; then mv /tmp/config/qgisserver /etc/qgisserver; fi && \
    if [ -e /tmp/config/mapcache ]; then mv /tmp/config/mapcache /etc/; fi && \
    if [ -e /tmp/config/front ]; then mv /tmp/config/front /etc/haproxy; fi && \
    if [ -e /tmp/config/front_dev ]; then mv /tmp/config/front_dev /etc/haproxy_dev; fi && \
    mkdir --parent /usr/local/tomcat/webapps/ROOT/ && \
    if [ -e /tmp/config/print ]; then mv /tmp/config/print/print-apps /usr/local/tomcat/webapps/ROOT/; fi && \
    mv /tmp/config/geoportal/demo_geoportal/ /etc/geomapfish/ && \
    chmod g+w -R /etc /usr/local/tomcat/webapps && \
    adduser www-data root

VOLUME /etc/geomapfish \
    /etc/mapserver \
    /etc/qgisserver \
    /etc/mapcache \
    /etc/tilegeneration \
    /usr/local/tomcat/webapps/ROOT/print-apps \
    /etc/haproxy_dev \
    /etc/haproxy

ENTRYPOINT [ "/usr/bin/entrypoint" ]
