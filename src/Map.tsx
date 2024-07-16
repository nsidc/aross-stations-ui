import 'ol/ol.css';

import '@src/Map.css';
import { useMap } from '@src/map';


export const Map = () => {
  useMap();

  return (
    <div id="map" style={{ width: '100vw', height: '100vh' }}>
      <div id="map-tooltip" />
    </div>
  );
};
