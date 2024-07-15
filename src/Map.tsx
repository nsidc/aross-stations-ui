import {useEffect} from 'react';

import OlMap from 'ol/Map.js';
import OlView from 'ol/View.js';
import OlTileLayer from 'ol/layer/Tile';
import OlOsmSource from 'ol/source/OSM';
import 'ol/ol.css';

export const Map = () => {
  useEffect(() => {
		const openStreetMapsLayer = new OlTileLayer({
				preload: Infinity,
				source: new OlOsmSource(),
		});

    const map = new OlMap({
      target: 'map',
      layers: [openStreetMapsLayer],
      view: new OlView({
        center: [0, 0],
        zoom: 0,
      }),
    }); 

    return () => {map.setTarget(undefined)};
  }, []);

  return (
    <div id="map" style={{ width: '100vw', height: '100vh' }} />
  );
};
