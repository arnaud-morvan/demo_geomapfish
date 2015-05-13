throwErrorOnExtraParameters: true

templates:
    A4 portrait: !template
        reportTemplate: A4_Portrait.jrxml
        attributes:
            title: !string
                default: ""
            comments: !string
                default: ""
            debug: !integer
                default: 0
            legend: !legend {}
            northArrow: !northArrow
                size: 40
                default:
                    graphic: "file:///north.svg"
            scalebar: !scalebar
                width: 150
                height: 20
                default:
                     fontSize: 8
            map: !map
                maxDpi: 254
                dpiSuggestions: [254]
                zoomLevels: !zoomLevels
                    scales: [100, 250, 500, 2500, 5000, 10000, 25000, 50000, 100000, 500000]
                width: 555
                height: 675
            datasource: !datasource
                attributes:
                    title: !string {}
                    table: !table {}

        processors:
        - !reportBuilder # compile all reports in current directory
            directory: '.'
        - !configureHttpRequests
            httpProcessors:
            - !mapUri
                mapping:
                    ([htps])://${host}/(.*): "$1://127.0.0.1/$2"
            - !useHttpForHttps
                hosts:
                - ${host}
                portMapping:
                    443: 80
            - !forwardHeaders
                headers:
                - Cookie
                - Host
                - Referrer
        - !prepareLegend
            template: legend.jrxml
        - !createNorthArrow {}
        - !createScalebar {}
        - !createMap {}
        - !createDataSource
            processors:
            - !prepareTable
                dynamic: true
                columns:
                    icon: !urlImage
                        urlExtractor: (.*)
                        urlGroup: 1
