import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css'

import '@src/Map.css';
import { useMap } from '@src/map';

import polyImg from '@src/assets/draw-polygon_1.svg';
import downloadImg from '@src/assets/download-data.svg';
import timeseriesImg from '@src/assets/bar-chart.svg';

export const Map = () => {
  useMap();

  return (
    <div id="map" style={{ width: '100vw', height: '100vh' }}>

      <div id="dialog-modality"></div>
      
      <div id="plot-dialog" className="dialog-content">
        <div id="plot-dialog-close" className="dialog-close-btn">
          &times;
        </div>
        <h3 id="plot-dialog-header">Time Series Plot</h3>
        <div id="plot-dialog-image">HERE IS WHERE IT GOES</div>
        <div id="plot-dialog-link">link...</div>
      </div>
      
      <div id="map-tooltip" />
      <div id="map-download-btn" className="hidden dataButton">
        <img src={downloadImg} />
      </div>
      <div id="map-toggle-polygon" className="toggle-off" title="Draw Polygon to Select Stations">
        <img src={polyImg} />
      </div>
      <div id="map-timeseries-btn" className="hidden dataButton">
        <img src={timeseriesImg} />
      </div>      
    </div>
  );
};
