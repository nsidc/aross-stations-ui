import {useEffect} from 'react';

import OlMap from 'ol/Map';
import {defaults as defaultControls, MousePosition} from 'ol/control';
import OlGeoJSON from 'ol/format/GeoJSON';
import OlTileLayer from 'ol/layer/Tile';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector'; 
import OlView from 'ol/View.js';
import 'ol/ol.css';

import { BASEMAP } from '@src/basemap';
import { PROJECTION } from '@src/projection';
import '@src/Map.css';


export const Map = () => {

  useEffect(() => {
    const basemap = new OlTileLayer({
      source: BASEMAP,
    });

    const stationsLayer = new OlVectorLayer({
      source: new OlVectorSource({
        format: new OlGeoJSON(),
        url: 'http://localhost:8000/v1/stations/?start=2000-01-01&end=2024-01-01',
      }),
			// @ts-ignore: Allow lists for circle-radius and circle-fill-color
      style: {
        'circle-stroke-color': 'hsl(0 100% 100% / 0.9)',
        'circle-stroke-width': 0.75,
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'matching_event_count'],
          2000,
          3,
          10000,
          10,
        ],
        'circle-fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'matching_event_count'],
          2000,
          'hsl(210 100% 40% / 0.9)',
          10000,
          'hsl(0 80% 60% / 0.9)',
        ],
      },
    });

    const map = new OlMap({
      target: 'map',
      layers: [basemap, stationsLayer],
      view: new OlView({
        projection: PROJECTION,
        extent: PROJECTION.getExtent(),
        center: [0, 0],
        zoom: 0,
        maxZoom: 4,
      }),
      controls: defaultControls().extend([
        new MousePosition(),
      ]),
    }); 

    return () => {map.setTarget(undefined)};
  }, []);

  return (
    <div id="map" style={{ width: '100vw', height: '100vh' }} />
  );
};
