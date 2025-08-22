import {useEffect} from 'react';

import OlMap from 'ol/Map';
import {defaults as defaultControls, MousePosition} from 'ol/control';
import OlDraw from 'ol/interaction/Draw';
import { click } from 'ol/events/condition';
import Select from 'ol/interaction/Select';
import OlGeoJSON from 'ol/format/GeoJSON';
import OlTileLayer from 'ol/layer/Tile';
import {Pixel as OlPixel} from 'ol/pixel';
import {FeatureLike as OlFeatureLike} from 'ol/Feature';
import {Extent} from 'ol/extent';
import {getCenter} from 'ol/extent.js';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector'; 
import OlView from 'ol/View.js';
import Feature from 'ol/Feature.js';
import {Style, Circle, Fill, Stroke, Text} from 'ol/style';
import OlPoint from 'ol/geom/Point.js';
import type OlMapBrowserEvent from 'ol/MapBrowserEvent';
import {type DrawEvent as OlDrawEvent} from 'ol/interaction/Draw';

import Legend from 'ol-ext/legend/Legend';
import {default as LegendCtl} from 'ol-ext/control/Legend';

import { hslaToRgba, interpolate, interpolateRgba } from './utils';

import $ from 'jquery';

import { BASEMAP } from '@src/basemap';
import { PROJECTION } from '@src/projection';
import { 
  API_STATIONS_QUERY_URL,
  API_STATIONS_DATA_URL,
  API_STATIONS_TIMESERIES_URL
} from '@src/api';

const DEFAULT_STARTDATE = '2000-01-01';
const DEFAULT_ENDDATE = '2024-12-31';
const EVENT_COUNT_FIELD_NAME = 'matching_rain_on_snow_event_count';
const EVENT_SCALE_MIN = 10;
const EVENT_SCALE_MAX = 1500;
const FILENAME_REGEX = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
const DATE_REGEX = /\d{4}-\d{2}-\d{2}/;
const CIRCLE_STROKE_COLOR = 'hsl(0 100% 100% / 0.9)';
const CIRCLE_STROKE_COLOR_RGBA = hslaToRgba(CIRCLE_STROKE_COLOR) ?? [0,0,0,1];
const CIRCLE_FILL_COLOR_MIN = 'hsl(229 100% 24% / 0.9)';  // BLUE
const CIRCLE_FILL_COLOR_MIN_RGBA = hslaToRgba(CIRCLE_FILL_COLOR_MIN) ?? [50,50,50,.5];
const CIRCLE_FILL_COLOR_MAX = 'hsl(180 100% 49% / 0.9)';  // CYAN
const CIRCLE_FILL_COLOR_MAX_RGBA = hslaToRgba(CIRCLE_FILL_COLOR_MAX) ?? [255,255,255,1];

// Have ajax send array-type data using `x=1&&x=2` instead of `x[]=1&&x[]=2`,
// as the backend does not expect the brackets.
$.ajaxSetup({ traditional: true });

export let dateChangeCallback : () => void;

export const useMap = () => { useEffect(() => {
  /////////
  // Layers
  const basemap = new OlTileLayer({
    source: BASEMAP,
  });

  const apiStationUrl = (startdate = DEFAULT_STARTDATE, enddate = DEFAULT_ENDDATE) => {
    const startClean = DATE_REGEX.exec(startdate) ?? [DEFAULT_STARTDATE];
    const endClean = DATE_REGEX.exec(enddate) ?? [DEFAULT_ENDDATE];

    const newUrl = `${API_STATIONS_QUERY_URL}?start=${startClean[0]}&&end=${endClean[0]}`;
    return newUrl;
  }

  const currentStartEndDates = () : string[] => {
    const newStart = $('#date-start').val()?.toString() ?? DEFAULT_STARTDATE;
    const newEnd = $('#date-end').val()?.toString() ?? DEFAULT_ENDDATE;

    return [newStart, newEnd];
  }

  const stationsLayer = new OlVectorLayer({
    source: new OlVectorSource({
      format: new OlGeoJSON(),
      url: apiStationUrl(),
    }),
    // @ts-ignore: Allow lists for circle-radius and circle-fill-color
    style: {
      'circle-stroke-color': CIRCLE_STROKE_COLOR,
      'circle-stroke-width': 0.75,
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', EVENT_COUNT_FIELD_NAME],
        EVENT_SCALE_MIN,
        6,
        EVENT_SCALE_MAX,
        9,
      ],
      'circle-fill-color': [
        'interpolate',
        ['linear'],
        ['get', EVENT_COUNT_FIELD_NAME],
        EVENT_SCALE_MIN,
        CIRCLE_FILL_COLOR_MIN,
        EVENT_SCALE_MAX,
        CIRCLE_FILL_COLOR_MAX,
      ],
    },
  });

  const drawAPolygonSource = new OlVectorSource({wrapX: false});
  const drawAPolygonLayer = new OlVectorLayer({source: drawAPolygonSource});

  const getLegendStyle = (feature: Feature): Style => {
    const featureEventCount : number = feature.get(EVENT_COUNT_FIELD_NAME) as number;
    return new Style({
      image: new Circle({
        radius: interpolate(featureEventCount, EVENT_SCALE_MIN, EVENT_SCALE_MAX, 6, 9),
        fill: new Fill({
          color: interpolateRgba(
            featureEventCount,
            EVENT_SCALE_MIN,
            EVENT_SCALE_MAX,
            CIRCLE_FILL_COLOR_MIN_RGBA,
            CIRCLE_FILL_COLOR_MAX_RGBA
          )
        }),
        stroke: new Stroke({
          width: 0.75,
          color: CIRCLE_STROKE_COLOR_RGBA
        })
      }),
      geometry: (feature) => {
        // @ts-ignore - Typescript has issues with this line, but in this case Geometry will always have an Extent
        return new OlPoint(getCenter(feature.getGeometry().getExtent()));
      }
    });
  };

  
  //////
  // Legend
  const legend = new Legend({
    title: '# of Station Events',
    // @ts-ignore - Typescript isn't getting the type for this assignment
    style: getLegendStyle,
    margin: 0,
    titleStyle: new Text({
      font: 'bold 24px sans-serif',
      padding: [200, 50, 10, 50],
    }),
  });
  const legendCtl = new LegendCtl({
    legend: legend,
    collapsed: false
  });

  // Add the sample "features" to the Legend
  const LEGEND_VALUES = [1, 500, 1000, 1500];
  for (const legendValue of LEGEND_VALUES) {
    let suffix = "";
    if (legendValue === 1500) suffix = "+";

    legend.addItem({
    title: `${String(legendValue)}${suffix}`,
    properties: { [EVENT_COUNT_FIELD_NAME] : legendValue },
    typeGeom: 'Point',
    height: 25,
  });
  }

  //////
  // Dialog
  const plotDialog = $('#plot-dialog');
  const plotModality = $('#dialog-modality');
  const togglePlotDialog = () => {
    plotDialog.toggle();
    plotModality.toggle();
  }
  $('#plot-dialog-close').off().on('click', togglePlotDialog);

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
    controls: defaultControls().extend([new MousePosition(), legendCtl]),
  }); 
  
  //////////////////////////////////////////////////////////////////////
  // Tooltip code based on OpenLayers example:
  //     https://openlayers.org/en/latest/examples/tooltip-on-hover.html
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const mapTooltipElement = document.getElementById('map-tooltip')!;

  let currentFeature: OlFeatureLike | undefined;
  let canToggle = true;

  const featureText = (feature: OlFeatureLike) => {
    return `<strong>${feature.get("name") as string}</strong>
    <br/>
    Elevation: ${String(feature.get('elevation_meters'))} meters
    <hr/>
    Matching rain on snow events: ${feature.get(EVENT_COUNT_FIELD_NAME) as string}`;
  };

  const displayFeatureInfo = (pixel: OlPixel, target: Element) => {
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


  ////////////////////////
  // Toggle Polygon Button
  const toggleOn = (btn: JQuery) => {
    btn.removeClass('toggle-off');
    btn.addClass('toggle-on');
    map.removeInteraction(select);
    map.addInteraction(draw);
  };

  const toggleOff = (btn: JQuery) => {
    btn.removeClass('toggle-on');
    btn.addClass('toggle-off');
    map.removeInteraction(draw);
    map.addInteraction(select);
  };

  const select = new Select({
    condition: click,
  });

  map.addInteraction(select);
  
  const togglePolygonBtn = $('#map-toggle-polygon');
  togglePolygonBtn.off().on('click', () => {
    if (!canToggle) {
      return;
    }
    const toggleBtn = $('#map-toggle-polygon');
    if (toggleBtn.hasClass('toggle-off')) {
      toggleOn(toggleBtn);
    } else {
      toggleOff(toggleBtn);
    }
    return false;
  });

  ////////////////////////////
  // Download and Plot Buttons

  const selectedFeatures = select.getFeatures();
  const downloadBtn : JQuery = $('#map-download-btn');
  const timeseriesBtn : JQuery = $('#map-timeseries-btn');

  const ShowOrHideDataButtons = () => {
    const numSelected = selectedFeatures.getLength();
    if (numSelected === 0) {
      downloadBtn.hide();
      timeseriesBtn.hide();
    } else {
      let stationText = 'Station';
      if (numSelected !== 1) {
        stationText += 's';
      }
      downloadBtn.attr('title', `Download Data for ${String(numSelected)} ${stationText}`);
      downloadBtn.show();

      timeseriesBtn.attr('title', `Plot Rain-on-Snow Time Series for ${String(numSelected)} ${stationText}`)
      timeseriesBtn.show();
    }
  }

  const extractAttachmentFilename = (value: string | null) => {
    let filename = null;
    if (value?.includes("attachment")) {
      const matches = FILENAME_REGEX.exec(value);
      if (matches?.[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    return filename;
  }

  const downloadDataForSelection = () => {
    const selectedStations : string[] = [];
    selectedFeatures.forEach( (f) => {
      selectedStations.push(f.get('id') as string);
    });

    const [startDate, endDate] : string[] = currentStartEndDates();

    void $.ajax({
      type: "POST",
      url: API_STATIONS_DATA_URL,
      data: {
        start: startDate,
        end: endDate,
        stations: selectedStations
      },
      success: (data, _status, xhr) => {
        const blob = new Blob([data], { type: "text/csv" });
        const url = window.URL;
        const link = url.createObjectURL(blob);
        const disposition = xhr.getResponseHeader('content-disposition');
        const a = $("<a />");
        a.attr("download", extractAttachmentFilename(disposition) ?? 'station_data.csv');
        a.attr("href", link);
        a[0].click();
      },
      error: (_result, _status, err) => {
        console.log(`Error loading data:\nERR: ${err}`);
      }
    });
  }

  const plotDialogImgDiv = $('#plot-dialog-image');
  const plotDialogLinkDiv = $('#plot-dialog-link');

  const createTimeseriesPlot = () => {
    const selectedStations : string[] = [];
    selectedFeatures.forEach( (f) => {
      selectedStations.push(f.get('id') as string);
    });

    plotDialogImgDiv.empty();
    plotDialogLinkDiv.attr("href", "javascript:");

    const [startDate, endDate] : string[] = currentStartEndDates();

    void $.ajax({
      type: "POST",
      url: API_STATIONS_TIMESERIES_URL,
      data: {
        start: startDate,
        end: endDate,
        stations: selectedStations
      },
      xhr: () => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        return xhr;
      },
      success: (data, _status, xhr) => {
        const blob = new Blob([data], { type: "image/png" });
        const url = window.URL;
        const link = url.createObjectURL(blob);
        const image = new Image();
        image.src = link;

        plotDialogImgDiv.empty().append(image);
        
        const a = $("<a>Download this plot</a>");
        const disposition = xhr.getResponseHeader('content-disposition');
        a.attr("download", extractAttachmentFilename(disposition) ?? 'station_plot.png');
        a.attr("href", link);
        
        plotDialogLinkDiv.empty().append(a);

        togglePlotDialog();
      },
      error: (_result, _status, err) => {
        console.log(`Error loading timeseries plot\nERR: ${err}`);
      }
    });
  };

  // Do "off" then "on" to ensure the listener isn't attached twice (not sure why this happens)
  downloadBtn.off().on('click', downloadDataForSelection);
  timeseriesBtn.off().on('click', createTimeseriesPlot);

  select.on('select', ShowOrHideDataButtons);


  // Update visible stations when date is updated
  dateChangeCallback = () => {
    const [newStart, newEnd] : string[] = currentStartEndDates();
      
    stationsLayer.getSource()?.setUrl(apiStationUrl(newStart, newEnd));
    stationsLayer.getSource()?.refresh();
  }



  /////////////////
  // Draw a polygon

  const draw = new OlDraw({
    source: drawAPolygonSource,
    type: "Polygon",
    stopClick: true,
  });

  draw.on('drawstart', () => {
    canToggle = false;
    select.setActive(false);
  });

  draw.on('drawend', (evt: OlDrawEvent) => {
    canToggle = true;
    evt.preventDefault();
    const geom = evt.feature.getGeometry();
    if (geom) {
      const extent : Extent = geom.getExtent();

      // Go through each station that is inside the Extent (bounding box) and check
      // for exact intersection with the actual geometry (to avoid false hits)
      stationsLayer.getSource()?.forEachFeatureIntersectingExtent(extent, (f) => {
        const fGeom = f.getGeometry();
        if (fGeom && geom.intersectsExtent(fGeom.getExtent())) {
          selectedFeatures.push(f);
        }
      });
    }
    
    setTimeout(() => {select.setActive(true)}, 300);
    setTimeout(() => {drawAPolygonSource.clear()}, 50);
    toggleOff($('#map-toggle-polygon'));
    ShowOrHideDataButtons();
  });

  draw.on('drawabort', () => {
    canToggle = true;
    toggleOff($('#map-toggle-polygon'));
    setTimeout(() => {select.setActive(true)}, 300);
  });

  return () => {map.setTarget(undefined)};
}, []); };
