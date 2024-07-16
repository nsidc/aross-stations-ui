import OlXyzSource from 'ol/source/XYZ';
import TileGrid from 'ol/tilegrid/TileGrid';

import { PROJECTION } from '@src/projection';

export const BASEMAP = new OlXyzSource({
  // url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3413/best/BlueMarble_NextGeneration/default/500m/{z}/{y}/{x}.jpeg',
  url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3413/best/BlueMarble_NextGeneration/default/500m/{z}/{y}/{x}.jpeg',
  projection: PROJECTION,
  tileGrid: new TileGrid({
    origin: [-4194304, 4194304],
    resolutions: [
      8192.0,
      4096.0,
      2048.0,
      1024.0,
      512.0,
      256.0,
    ],
    tileSize: 512,
  }),
})
