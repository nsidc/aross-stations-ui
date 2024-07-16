import proj4 from 'proj4';
import {get as getProjection} from 'ol/proj';
import {register as registerProjection} from 'ol/proj/proj4';

proj4.defs(
  'EPSG:3413',
  '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
);
registerProjection(proj4);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const PROJECTION = getProjection('EPSG:3413')!;
PROJECTION.setExtent([-4194304, -4194304, 4194304, 4194304]);
