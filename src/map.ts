import {useEffect} from 'react';

import OlMap from 'ol/Map';
import {defaults as defaultControls, MousePosition} from 'ol/control';
import OlDraw from 'ol/interaction/Draw';
import OlGeoJSON from 'ol/format/GeoJSON';
import OlTileLayer from 'ol/layer/Tile';
import {Pixel as OlPixel} from 'ol/pixel';
import {FeatureLike as OlFeatureLike} from 'ol/Feature';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector'; 
import OlView from 'ol/View.js';
import type OlMapBrowserEvent from 'ol/MapBrowserEvent';

import { BASEMAP } from '@src/basemap';
import { PROJECTION } from '@src/projection';
import { API_STATIONS_QUERY_URL } from '@src/api';

const EVENT_COUNT_FIELD_NAME = 'matching_rain_on_snow_event_count';
const EVENT_SCALE_MIN = 10;
const EVENT_SCALE_MAX = 1000;

export const useMap = () => { useEffect(() => {
  /////////
  // Layers
  const basemap = new OlTileLayer({
    source: BASEMAP,
  });

  const stationsLayer = new OlVectorLayer({
    source: new OlVectorSource({
      format: new OlGeoJSON(),
      url: API_STATIONS_QUERY_URL,
    }),
    // @ts-ignore: Allow lists for circle-radius and circle-fill-color
    style: {
      'circle-stroke-color': 'hsl(0 100% 100% / 0.9)',
      'circle-stroke-width': 0.75,
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', EVENT_COUNT_FIELD_NAME],
        EVENT_SCALE_MIN,
        3,
        EVENT_SCALE_MAX,
        10,
      ],
      'circle-fill-color': [
        'interpolate',
        ['linear'],
        ['get', EVENT_COUNT_FIELD_NAME],
        EVENT_SCALE_MIN,
        'hsl(210 100% 40% / 0.9)',
        EVENT_SCALE_MAX,
        'hsl(0 80% 60% / 0.9)',
      ],
    },
  });

  const drawAPolygonSource = new OlVectorSource({wrapX: false});
  const drawAPolygonLayer = new OlVectorLayer({source: drawAPolygonSource});

  //////
  // Map
  const map = new OlMap({
    target: 'map',
    layers: [basemap, stationsLayer, drawAPolygonLayer],
    view: new OlView({
      projection: PROJECTION,
      extent: PROJECTION.getExtent(),
      center: [0, 0],
      zoom: 0,
      maxZoom: 4,
    }),
    controls: defaultControls().extend([new MousePosition()]),
  }); 

  //////////////////////////////////////////////////////////////////////
  // Tooltip code based on OpenLayers example:
  //     https://openlayers.org/en/latest/examples/tooltip-on-hover.html
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const mapTooltipElement = document.getElementById('map-tooltip')!;

  let currentFeature: OlFeatureLike | undefined;

  const featureText = (feature: OlFeatureLike) => {
    return `<strong>${feature.get("name") as string}</strong>
    <br/>
    Elevation: ${String(feature.get('elevation_meters'))} meters
    <hr/>
    Matching rain on snow events: ${feature.get(EVENT_COUNT_FIELD_NAME) as string}`;
  };

  const displayFeatureInfo = function (pixel: OlPixel, target: Element) {
    const feature = target.closest('.ol-control')
      ? undefined
      : map.forEachFeatureAtPixel(
        pixel,
        (feature) => feature,
        {layerFilter: (layer) => layer === stationsLayer}
      );
    if (feature) {
      mapTooltipElement.style.left = `${pixel[0].toString()}px`;
      mapTooltipElement.style.top = `${pixel[1].toString()}px`;
      if (feature !== currentFeature) {
        mapTooltipElement.style.visibility = 'visible';
        mapTooltipElement.innerHTML = featureText(feature);
      }
    } else {
      mapTooltipElement.style.visibility = 'hidden';
    }
    currentFeature = feature;
  };

  map.on('pointermove', (evt: OlMapBrowserEvent<UIEvent>) => {
    if (evt.dragging || evt.originalEvent.target === null) {
      mapTooltipElement.style.visibility = 'hidden';
      currentFeature = undefined;
      return;
    }
    const pixel = map.getEventPixel(evt.originalEvent);
    // TODO: 
    displayFeatureInfo(pixel, evt.originalEvent.target as Element);
  });

  /////////////////
  // Draw a polygon
  const draw = new OlDraw({
    source: drawAPolygonSource,
    type: "Polygon",
  });
  map.addInteraction(draw);

  return () => {map.setTarget(undefined)};
}, []); };
