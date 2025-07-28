import 'ol/ol.css';

import '@src/Map.css';
import { useMap } from '@src/map';

import polyImg from '@src/assets/draw-polygon_1.svg';


export const Map = () => {
  useMap();

  return (
    <div id="map" style={{ width: '100vw', height: '100vh' }}>
      <div id="map-tooltip" />
      <div id="map-download-btn" className="hidden">DOWNLOAD STUFF</div>
      <div id="map-toggle-polygon" className="toggle-off">
        <img src={polyImg} />
      </div>
    </div>
  );
};
