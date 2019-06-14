function Map2DTools(ol_obj) {
    this.ol = ol_obj ? ol_obj : ol;
    this.map = null;
    this.wktFormat = new this.ol.format.WKT();
    this.geoFormat = new this.ol.format.GeoJSON();
    this.kmlFormat = new this.ol.format.KML();
}

Map2DTools.prototype = {
    constructor: Map2DTools,

    FlyToExtent: function (extent, option) {
        option = option ? option : {};
        this.map.getView().fit(extent, option);
    },

    FlyToCenter: function (center, zoom) {
        this.map.getView().animate({
            zoom: zoom || this.map.getView().getZoom(),
            center: center
        });
    },

    CreateIconLayer: function (img) {
        let source = new this.ol.source.Vector();
        let vector = new this.ol.layer.Vector({
            source: source,
            map: this.map,
            style: new this.ol.style.Style({
                image: new this.ol.style.Icon(
                    ({
                        anchor: [0.5, 30],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        opacity: 0.95,
                        src: img || base.static + '/images/mark.png'
                    })
                ),
                fill: new this.ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new this.ol.style.Stroke({
                    color: '#03FFFF',
                    width: 2
                })
            })
        });
        return vector;
    },

    CreateResultLayer: function (style) {
        style = style || new this.ol.style.Style({
            image: new this.ol.style.Circle({
                radius: 5,
                fill: new this.ol.style.Fill({
                    color: 'red'
                }),
                stroke: new this.ol.style.Stroke({
                    color: '#319FD3',
                    width: 2
                })
            }),
            fill: new this.ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new this.ol.style.Stroke({
                color: '#03FFFF',
                width: 2
            })
        });
        let source = new this.ol.source.Vector();
        let vector = new this.ol.layer.Vector({
            source: source,
            map: this.map,
            style: style
        });
        return vector;
    },

    CreateVectorLayer: function (data) {
        style = data.style || new this.ol.style.Style({
            image: new this.ol.style.Circle({
                radius: 5,
                fill: new this.ol.style.Fill({
                    color: 'red'
                }),
                stroke: new this.ol.style.Stroke({
                    color: '#319FD3',
                    width: 2
                })
            }),
            fill: new this.ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new this.ol.style.Stroke({
                color: '#03FFFF',
                width: 2
            })
        });
        let source = new this.ol.source.Vector();
        let vector = new this.ol.layer.Vector({
            source: source,
            style: style,
            zIndex: data.zindex || 2
        });
        this.map.addLayer(vector);
        return vector;
    },

    CreateHeatLayer: function (data) {
        data = {
            geojson: "",
            zindex: "",
            blur: "",
            radius: ""
        }

        let features = geoformat.readFeatures(data.geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })

        let vectorSource = new ol.source.Vector({
            features: features
        });

        let heatmap = new ol.layer.Heatmap({
            source: vectorSource,
            blur: data.blur || 10,
            radius: data.radius || 10,
            zIndex: data.zindex || 9
        });

        this.map.addLayer(heatmap);

        return heatmap;
    },

    CreateAllzoneLayer: function (style) {
        style = style || new this.ol.style.Style({
            image: new this.ol.style.Circle({
                radius: 5,
                stroke: new this.ol.style.Stroke({
                    color: '#319FD3',
                    width: 2
                })
            }),
            fill: new this.ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.1)'
            }),
            stroke: new this.ol.style.Stroke({
                // color: '#319FD3',
                // color:'#fff',
                color: '#9B9C9B',
                width: 1
            })
        });
        let source = new this.ol.source.Vector();
        let vector = new this.ol.layer.Vector({
            source: source,
            map: this.map,
            style: style
        });
        return vector;
    },

    CreateDrawLayer: function (style) {
        style = style || new this.ol.style.Style({
            image: new this.ol.style.Circle({
                radius: 5,
                fill: new this.ol.style.Fill({
                    color: 'red'
                }),
                stroke: new this.ol.style.Stroke({
                    color: '#319FD3',
                    width: 2
                })
            }),
            fill: new this.ol.style.Fill({
                color: 'rgba(220,155,151,0.1)'
            }),
            stroke: new this.ol.style.Stroke({
                color: '#E12EC3',
                width: 2,
            })
        });
        let source = new this.ol.source.Vector({
            wrapX: false
        });
        let vector = new this.ol.layer.Vector({
            source: source,
            style: style,
            zIndex: 99
        });
        this.map.addLayer(vector);
        return vector;
    },

    GetGeoJsonByWkt: function (wkt) {
        let geometry = this.wktFormat.readGeometry(wkt);
        let geojson = this.geoFormat.writeGeometry(geometry);
        return geojson;
    },

    GetWktByFeature: function (feature) {
        let wkt = this.wktFormat.writeFeature(feature, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        return wkt;
    },

    GetGeoJsonByFeature: function (feature) {
        let geojson = this.geoFormat.writeFeature(feature, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        return geojson;
    },

    GetFeatureByWkt: function (wkt, isWgs84) {

        let feature = this.wktFormat.readFeature(wkt, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        if (!isWgs84) feature = this.wktFormat.readFeature(wkt);
        return feature;
    },

    GetFeatureByGeoJson: function (geojson) {
        let feature = this.geoFormat.readFeature(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        return feature;
    },

    GetFeatureByKML: function (kml) {
        let feature = this.kmlFormat.readFeature(kml, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        return feature;
    },

    GetExtentByFeature: function (feature) {
        let extent = feature.getGeometry().getExtent();
        return extent;
    },

    GetWktByCenter: function (center, metre, source) {
        let circleGeom = new this.ol.geom.Circle(this.ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857'), metre)
        let pointBuffer = new this.ol.Feature({
            geometry: this.ol.geom.Polygon.fromCircle(circleGeom)
        });
        source.addFeature(pointBuffer);
        return this.wktFormat.writeFeature(pointBuffer, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
    },

    GetWktByCoordinates: function (Coordinates, isWgs84) {
        let geom = new this.ol.geom.Polygon(Coordinates);
        let wkt = this.wktFormat.writeGeometry(geom, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })
        if (isWgs84) wkt = this.wktFormat.writeGeometry(geom);
        return wkt;
    },

    AddIconByPoint: function (point, source, value) {
        // 纬度范围-90~90，经度范围-180~180
        if (point[0] > 180 || point[0] < -180) {
            return;
        }

        if (point[1] > 90 || point[1] < -90) {
            return;
        }

        let icon = new this.ol.Feature({
            geometry: new this.ol.geom.Point(this.ol.proj.transform(
                point, 'EPSG:4326', 'EPSG:3857'))
        })
        if (value != undefined) icon.setProperties(value);
        source.addFeature(icon);
    },

    // AddIconByPoint: function (point, source, id) {
    //     // 纬度范围-90~90，经度范围-180~180
    //     if (point[0] > 180 || point[0] < -180) {
    //         return;
    //     }

    //     if (point[1] > 90 || point[1] < -90) {
    //         return;
    //     }

    //     let icon = new this.ol.Feature({
    //         geometry: new this.ol.geom.Point(this.ol.proj.transform(
    //             point, 'EPSG:4326', 'EPSG:3857'))
    //     })
    //     if (id) circle.setId(id);
    //     source.addFeature(icon);
    // },

    DrawExtentByWkt: function (wkt, source) {
        let feature = this.wktFormat.readFeature(wkt, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        source.clear();
        source.addFeature(feature);
        return feature;
    },

    DrawExtentByGeoJson: function (geojson, source, id, addto) {
        let feature = this.geoFormat.readFeature(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        if (id) feature.setId(id);
        if (addto == undefined) source.clear();
        source.addFeature(feature);
        return feature;
    },

    DrawExtentByGeoJsons: function (geojsons, source) {
        let features = this.geoFormat.readFeatures(geojsons, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        source.clear();
        source.addFeatures(features);
        return features;
    },

    Draw: function (type, layer, cb) {
        let draw;
        let This = this;
        if (type !== '') {
            let geometryFunction;
            let option = {};

            if (type === 'Polygon') {
                type = 'Polygon';
            } else if (type === 'Box') {
                type = 'Circle';
                geometryFunction = this.ol.interaction.Draw.createBox();
            } else if (type == 'Point') {
                type = 'Point';
            }else if(type === 'Circle'){
                type = 'Circle';
            }

            option.source = layer.getSource();
            option.type = (type);
            if (geometryFunction) option.geometryFunction = geometryFunction;

            draw = new this.ol.interaction.Draw(option);
            this.map.addInteraction(draw);

            draw.on('drawend', function (l) {
                This.map.removeInteraction(draw);
                cb(l);
            })
        }
        return draw;
    },

    RemoveDraw: function (draw) {
        this.map.removeInteraction(draw);
    },

    EditDraw: function (layer) {
        let modify;
        modify = new this.ol.interaction.Modify({
            source: layer.getSource()
        });
        this.map.addInteraction(modify);
        return modify;
    },

    RemoveEditDraw: function (modify) {
        this.map.removeInteraction(modify);
    },

    addGeojson: function (json,style) {
        style = style || new this.ol.style.Style({
            image: new this.ol.style.Circle({
                radius: 5,
                fill: new this.ol.style.Fill({
                    color: 'red'
                }),
                stroke: new this.ol.style.Stroke({
                    color: '#319FD3',
                    width: 2
                })
            }),
            fill: new this.ol.style.Fill({
                color: 'rgba(220,155,151,0.1)'
            }),
            stroke: new this.ol.style.Stroke({
                color: '#E12EC3',
                width: 2,
            })
        });
        
        let that = this;
        let source = new this.ol.source.Vector({
            wrapX: false,
            features: that.geoFormat.readFeatures(json, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        });
        let vector = new this.ol.layer.Vector({
            source: source,
            style: style,
            zIndex: 99
        });
        this.map.addLayer(vector);
        return vector;
    },

    // 根据wkt将image图片绘制到底图上
    AddImageByGeoJson: function (geojson, thumb, zindex) {
        let feature = this.geoFormat.readFeature(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        let source = new this.ol.source.ImageStatic({
            url: thumb,
            imageExtent: feature.getGeometry().getExtent()
        });
        let imageLayer = new this.ol.layer.Image({
            source: source,
            zIndex: zindex || 11
        });
        this.map.addLayer(imageLayer)
        return imageLayer;
    },

    // 根据wkt将image图片绘制到底图上
    AddImageByWkt: function (geojson, thumb) {
        let feature = this.wktFormat.readFeature(wkt, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        let source = new this.ol.source.ImageStatic({
            url: thumb,
            imageExtent: feature.getGeometry().getExtent()
        });
        let imageLayer = new this.ol.layer.Image({
            source: source,
            zIndex: 11
        });
        this.map.addLayer(imageLayer)
        return imageLayer;
    },

    AddWMS: function (data) {
        // data = {
        //     url: 'http://58.30.35.72:8013/grm/TitanGRM/wms',
        //     srs: 'EPSG:3857',
        //     version: '1.3.0',
        //     layers: 'TitanGRM:ftr-9e63dc9cbec841c2885c648ae5c73bdf'
        // };
        let source = new this.ol.source.TileWMS({
            url: data.url,
            params: {
                'VERSION': data.version,
                'SRS': data.srs,
                'TILED': true,
                'LAYERS': data.layers,
                'STYLES': data.style || ''
            },
            crossOrigin: 'anonymous'
        });

        let tileLayer = new this.ol.layer.Tile({
            source: source,
            visible: data.visible == false ? data.visible : true,
            zIndex: data.zindex || 12
        });

        this.map.addLayer(tileLayer);
        return tileLayer;
    },

    AddWMSByImage: function (data) {
        // data = {
        //     url: 'http://58.30.35.72:8013/grm/TitanGRM/wms',
        //     srs: 'EPSG:3857',
        //     version: '1.3.0',
        //     layers: 'TitanGRM:ftr-9e63dc9cbec841c2885c648ae5c73bdf'
        // };

        let source = new this.ol.source.ImageWMS({
            url: data.url,
            params: data.params || {},
            // crossOrigin: 'anonymous'
        });

        let wmsLayer = new this.ol.layer.Image({
            source: source,
            visible: data.visible == false ? data.visible : true,
            zIndex: data.zindex || 12
        });

        this.map.addLayer(wmsLayer);
        return wmsLayer;
    },

    AddWFS: function (data, style) {
        // data = {
        //     url: 'http://192.168.1.179:8181/grm/TitanGRM/wfs',
        //     srs: 'EPSG:3857',
        //     version: '1.0.0',
        //     layers: 'TitanGRM:ftr-da59a58129bb4756a27ee5c2601b2b4f'
        // };

        // data = {
        //     url: 'http://192.168.1.179:8181/grm/TitanGRM/wms',
        //     srs: 'EPSG:3857',
        //     version: '1.0.0',
        //     layers: 'TitanGRM:ftr-d7f4ed513ccb4ce49e13e67d3a3b374b'
        // };

        let source = new this.ol.source.Vector({
            format: new this.ol.format.GeoJSON(),
            url: function (extent) {
                let url = `${data.url}?service=WFS&version=${data.version}&typename=${data.layers}&srsname=${data.srs}&bbox=${extent.join(',')},${data.srs}&request=GetFeature&outputFormat=application/json`;
                return url;
            },
            strategy: this.ol.loadingstrategy.bbox
        });

        if (style == undefined) {
            style = new this.ol.style.Style({
                stroke: new this.ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 1.0)',
                    width: 2
                }),
                fill: new this.ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.1)'
                }),
                image: new this.ol.style.Circle({
                    radius: 5,
                    fill: new this.ol.style.Fill({
                        color: 'orange'
                    })
                })
            })
        }
        let vectorLayer = new this.ol.layer.Vector({
            source: source,
            style: style,
            zIndex: data.zindex || 13
        });
        this.map.addLayer(vectorLayer);
        return vectorLayer;
    },

    AddWMTS: function (data) {
        // data = {
        //     url:'http://t0.tianditu.com/ter_c/wmts',
        //     srs: 'EPSG:4326',
        //     layers:'ter',
        //     tilematrixset: 'c',
        //     format: '',
        //     version: '1.0.0',
        //     crossOrigin: "Anonymous",
        //     level: '18'
        // }

        // data = {
        //     url:'http://www.bjmap.gov.cn:8081/geoesb/proxy/48d613ef7eb0489793aeecb02ec6c9c9/886e60bb7e014f22a707de23e6f6505d',
        //     srs: 'EPSG:4326',
        //     layers:'BJMap',
        //     tilematrixset: 'CustomCRS4490ScaleBJMap',
        //     format: '',
        //     version: '1.0.0',
        // }
        let projection = this.ol.proj.get(data.srs);
        let projectionExtent = projection.getExtent();
        let size = this.ol.extent.getWidth(projectionExtent) / 256;
        let level = data.level || 18;
        let resolutions = new Array(level);
        let matrixIds = new Array(level);
        for (let z = 0; z < level; ++z) {
            resolutions[z] = size / Math.pow(2, z);
            matrixIds[z] = z;
        }
        let source = new this.ol.source.WMTS({
            url: data.url,
            layer: data.layers,
            matrixSet: data.tilematrixset,
            version: data.version || '1.0.0',
            format: data.format,
            projection: projection,
            crossOrigin: data.crossOrigin || undefined,
            tileGrid: new this.ol.tilegrid.WMTS({
                origin: this.ol.extent.getTopLeft(projectionExtent),
                resolutions: resolutions,
                matrixIds: matrixIds
            }),
            tileLoadFunction: function (imageTile, src) {
                imageTile.getImage().src = src + (data.url_parameter ? data.url_parameter : '')
            },
            style: data.style || 'default',
            wrapX: data.wrapX ? data.wrapX : false
        });

        let tileLayer = new this.ol.layer.Tile({
            source: source,
            visible: data.visible == false ? data.visible : true,
            zIndex: data.zindex || 12,
            name: data.name || 'WMTS图层'
        })
        this.map.addLayer(tileLayer);
        return tileLayer;
    },

    AddTMS: function (data) {
        // data = {
        //     url: 'http://192.168.1.199:9330/service/tile?x={x}&y={y}&z={z}',
        //     isOa: true,
        //     maxTime: '29991231',
        //     theme: '273',
        //     zindex: '',
        //     visible:false
        // }

        let url = data.url;

        if (data.isOa != undefined) {
            url += `&overall=${data.isOa}`;
        }

        if (data.maxTime != undefined) {
            url += `&t=${data.maxTime}`;
        }

        if (data.theme != undefined) {
            url += `&theme=${data.theme}`;
        }

        let source = new this.ol.source.TileImage({
            url: url,
            projection: data.projection || 'EPSG:3857',
            crossOrigin: 'anonymous',
            wrapX: data.wrapX ? data.wrapX : false
        });

        let tileLayer = new this.ol.layer.Tile({
            source: source,
            visible: data.visible == false ? data.visible : true,
            zIndex: data.zindex || 9,
            name: data.name || 'TMS图层'
        });
        this.map.addLayer(tileLayer);
        return tileLayer;
    },

    AddXYZ: function(data){
        let source = new this.ol.source.XYZ({
            url: data.url,
            wrapX: data.wrapX ? data.wrapX : false
        });

        let tileLayer = new this.ol.layer.Tile({
            source: source,
            visible: data.visible == false ? data.visible : true,
            zIndex: data.zindex || 9,
            name: data.name || 'TMS图层'
        });
        this.map.addLayer(tileLayer);
        return tileLayer;
    },

    AddMVT: function (data, style) {
        // let resolutions = [];
        // for (let i = 0; i <= 8; ++i) {
        //     resolutions.push(156543.03392804097 / Math.pow(2, i * 2));
        // }

        // data.url_parameter = '?cache=false';

        let source = new this.ol.source.VectorTile({
            format: new this.ol.format.MVT({
                featureClass: this.ol.Feature
            }),
            url: data.url,
            tileUrlFunction: function(tileCoord){
                // let xyz = `/${tileCoord[0]}/${tileCoord[1]}/${-tileCoord[2]-1}`;
                let xyz = `/${tileCoord[0]}/${tileCoord[1]}/${tileCoord[2]-1}`;
                return data.url.replace('/{z}/{x}/{y}', xyz) + (data.url_parameter ? data.url_parameter : '')
            }
            // tileGrid: new ol.tilegrid.TileGrid({
            //     resolutions: resolutions,
            //     extent: ol.proj.get('EPSG:3857').getExtent(),
            //     tileSize: 512
            // }),
            // tileType: 'ScaleXY',
            // projection: 'EPSG:4326'
        });

        let tileLayer = new this.ol.layer.VectorTile({
            declutter: true,
            // updateWhileInteracting: false,
            // updateWhileAnimating: false,
            // preload: data.zindex?data.zindex:12+1,
            renderMode:'image',
            // renderBuffer: 100000,
            source: source,
            style: style,
            zIndex: data.zindex || 1,
            visible: data.visible == false ? data.visible : true,
        })

        this.map.addLayer(tileLayer);
        return tileLayer;
    },

    AddArcGis: function (data) {
        let source = new this.ol.source.TileArcGISRest({
            // projection: this.ol.proj.get('EPSG:4326'),
            params: {
                FORMAT: 'PNG16'
            },
            url: data.url,
            crossOrigin: 'anonymous',
            wrapX: data.wrapX ? data.wrapX : false
        });

        let tileLayer = new this.ol.layer.Tile({
            source: source,
            visible: data.visible == false ? data.visible : true,
            zIndex: data.zindex || 9,
            name: data.name || 'ArcGIS图层'
        });
        this.map.addLayer(tileLayer);
        return tileLayer;
    },

    AddImage: function (imagexpressdUrl, filePath, data) {
        let jsonobj = eval('(' + data + ')');
        let imgExtent;
        let projection;
        if (jsonobj.srs == "") {
            // 像素坐标系
            // 设置显示区域
            imgExtent = [Math.min(jsonobj.xmin, jsonobj.xmax),
                Math.min(jsonobj.ymin, jsonobj.ymax),
                Math.max(jsonobj.xmin, jsonobj.xmax),
                Math.max(jsonobj.ymin, jsonobj.ymax)
            ];

            //新建投影
            projection = new this.ol.proj.Projection({
                code: 'xkcd-image',
                units: 'pixels',
                extent: imgExtent
            });
        } else {
            proj4.defs('mySrs', jsonobj.srs);

            imgExtent = [Math.min(jsonobj.xmin, jsonobj.xmax),
                Math.min(jsonobj.ymin, jsonobj.ymax),
                Math.max(jsonobj.xmin, jsonobj.xmax),
                Math.max(jsonobj.ymin, jsonobj.ymax)
            ];

            projection = new this.ol.proj.Projection({
                name: this.ol.proj.Projection,
                code: 'mySrs',
                extent: imgExtent
            });

            this.ol.proj.addProjection(projection);
        }

        let imgWMSSource = new this.ol.source.ImageWMS({
            url: imagexpressdUrl + '/wms',
            params: {
                'file': filePath,
                'bands': '1,2,3',
                'FORMAT': 'image/png'
            }
        });

        let imgLayer = new this.ol.layer.Image({
            opacity: 1,
            extent: imgExtent,
            source: imgWMSSource
        });

        let view = new this.ol.View({
            projection: projection,
            center: this.ol.extent.getCenter(imgExtent),
            zoom: 1
        })
        this.map.setView(view)
        this.map.addLayer(imgLayer);
        this.SetImageSourceEvent(imgLayer, imgWMSSource)
        return imgLayer;
    },

    GetimagexpressdUrl: function (api, cb) {
        $.ajax({
            method: 'GET',
            url: `${api}/service/imagexpressd`,
            dataType: "text"
        }).done(data => {
            if (data) {
                cb(data);
            }
        }).fail(() => {
            console.log('看图服务获取失败');
        })
    },

    GetImageMeta: function (imagexpressdUrl, filePath, cb) {
        $.ajax({
            method: 'GET',
            url: imagexpressdUrl + '/meta?file=' + filePath,
        }).done(res => {
            cb(imagexpressdUrl, filePath, res);
        }).fail(() => {
            console.log('获取影像元数据服务访问失败');
        })
    },

    ChangeImageSource: function (layer, data) {
        // data = {
        //     url: 'http://192.168.1.189:6381'
        //     path: '/data/test123/2.TIF',
        //     fommat: 'image/png',
        //     bands: [1, 2, 3],
        //     isEnhance: true
        // }
        let newImgWMSSource = new this.ol.source.ImageWMS({
            url: data.url + '/wms',
            params: {
                'file': data.path,
                'bands': data.bands,
                'isEnhance': data.isEnhance,
                'FORMAT': data.fommat
            }
        });
        this.SetImageSourceEvent(layer, newImgWMSSource);
        layer.setSource(newImgWMSSource);
    },

    SetImageSourceEvent: function (layer, source) {
        let isMapLoad = false;
        source.on('imageloadstart', function (event) {
            if (isMapLoad == true) {
                layer.setSource(null);
            } else {
                layer.setSource(source);
                isMapLoad = true;
            }
            // progress.addLoading();
        });

        source.on('imageloadend', function (event) {
            isMapLoad = false;
            layer.setSource(source);
            // progress.addLoaded();
        });

        source.on('imageloaderror', function (event) {
            isMapLoad = false;
            layer.setSource(source);
            // progress.addLoaded();
        });
    },

    RemoveLayer: function (layer) {
        this.map.removeLayer(layer);
    },

    ClearSource: function (source) {
        source.clear();
    },

    SetZIndex: function (layer, num) {
        layer.setZIndex(num);
        return layer;
    },

    // 获取url参数
    GetQueryString: function (str, name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = str.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },

    //根据经纬度的距离获取地图的缩放级别
    GetRoom: function (diff) {
        let room = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14);
        let diffArr = new Array(360, 180, 90, 45, 22, 11, 5, 2.5, 1.25, 0.6, 0.3, 0.15, 0.07, 0.03, 0);
        for (let i = 0; i < diffArr.length; i++) {
            if ((diff - diffArr[i]) >= 0) {
                return room[i];
            }
        }
        return 14;
    },

    //通过经纬度获取中心位置和缩放级别
    GetCenterPoint: function (maxJ, minJ, maxW, minW) {
        if (maxJ == minJ && maxW == minW) return [maxJ, maxW, 9];
        let diff = maxJ - minJ;
        if (diff < (maxW - minW)) diff = maxW - minW;
        diff = parseInt(10000 * diff) / 10000;
        let centerJ = minJ * 1000000 + 1000000 * (maxJ - minJ) / 2;
        let centerW = minW * 1000000 + 1000000 * (maxW - minW) / 2;
        let zoom = this.GetRoom(diff);
        return [centerJ / 1000000, centerW / 1000000, zoom];
    },

    // 通过geometry获取面积
    GetAreaByGeometry: function (polygon) {
        let area = ol.Sphere.getArea(polygon);
        let output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) + ' ' + '平方千米';
        } else {
            output = (Math.round(area * 100) / 100) + ' ' + '平方米';
        }
        return output;
    }
}

global.Map2DTools = Map2DTools