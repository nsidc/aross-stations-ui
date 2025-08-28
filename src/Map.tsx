import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';
import 'react-datepicker/dist/react-datepicker.css';

import '@src/Map.css';
import { useMap, dateChangeCallback } from '@src/map';

import polyImg from '@src/assets/draw-polygon_1.svg';
import downloadImg from '@src/assets/download-data.svg';
import guideImg from '@src/assets/question-mark.svg';
import barchartImg from '@src/assets/bar-chart.svg';
import linechartImg from '@src/assets/line-chart.svg';

import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';

export const Map = () => {
  useMap();

  const DEFAULT_START = new Date('2000/01/01');
  const DEFAULT_END = new Date();

  const [startDate, setStartDate] = useState(DEFAULT_START);
  const [endDate, setEndDate] = useState(DEFAULT_END);

  useEffect(() => {
    dateChangeCallback();
  }, [startDate, endDate])

  return (
    <div id="map" style={{ width: '100vw', height: '100vh' }}>

      {/* This "covers" the rest of the screen so that things cannot be clicked while
      the dialog box is open */}
      <div id="dialog-modality"></div>

      {/* A dialog box which will pop up when downloading a plot. */}
      <div id="plot-dialog" className="plot-dialog-layout">
        <div id="plot-dialog-close" className="dialog-close-btn">
          &times;
        </div>
        <h3 id="plot-dialog-header">Plot</h3>
        <div id="plot-dialog-image"></div>
        <div id="plot-dialog-link"></div>
      </div>

      {/* A dialog box for displaying user guide information. */}
      <div id="guide-dialog" className="guide-dialog-layout">
        <div id="guide-dialog-close" className="dialog-close-btn">
          &times;
        </div>
        <h3 id="guide-dialog-header">User Guide</h3>
        <div id="guide-dialog-content">
            <h1>Welcome to the Arctic Rain on Snow Database App</h1>
            <p>
              This application allows you to query the database of Arctic rain on snow events, selecting one or
              more stations, displaying time-series and climatology plots of the data, and downloading data for
              selected points.  The database and this web application were built at part of the Arctic Rain on
              Snow Study (AROSS) funded by the National Science Foundations Navigating the New Arctic program
            </p>
            <p>
              <a href="https://nsf.gov/awardsearch/showAward?AWD_ID=1928230">
                <img src="https://img.shields.io/badge/NSF-1928230-red.svg" 
                     alt="National Science Foundation Award: 1928230" />
              </a>.
            </p>
            <p>
              The database is built from reports from automatic weather stations in Arctic regions of North
              America, Greenland, Svalbard, Iceland, Scandanavia, and Russia.  Data were downloaded from the
              <a href="https://mesonet.agron.iastate.edu/ASOS/">Iowa State University Environmental Mesonet</a>
              site.  Snow cover for station locations was extracted from the
              <a href="https://nsidc.org/data/g02156/versions/1">Interactive Multisensor Snow and Ice Mapping System</a>
              for dates after 2004, and from ERA5 prior to this date.  More information can be found on the
              Readme page of the
              <a href="https://github.com/andypbarrett/rain_on_snow_database">Rain on Snow Database GitHub repository</a>.
            </p>
            <p>
              Each station in the database is shown as a colored dot on the map.  The size and color or dots
              indicate the number of events reported for each station
            </p>

            <h2>How to Use the App</h2>
            <p>
              <b>Hover</b> over a station with your cursor to see the station name and number of events reported
            </p>
            <p>
              <b>Select</b> a station by clicking on a dot.  You can select multiple stations by pressing SHIFT
              and clicking on several dots.  You can also de-select selected stations in this way.  Clicking on
              the map away from any dot will cause all stations to be de-selected.
            </p>
            <p>
              <b>Draw</b> a polygon around a group of stations by clicking
              <img src={polyImg} alt="Polygon icon" width="20px" />. Click on the map to start drawing a polygon,
              add vertices, and close the polygon by clicking on the first point again.
            </p>
            <p>
              The date range for data can be set by adjusting the dates on the left of the screen.
            </p>
            <p>
              <b>Download</b> selected data by clicking on <img src={downloadImg} alt="Download icon" width="20px" />.
            </p>
            <p>
              A time series of events for selected stations can be plotted by clicking
              <img src={linechartImg} alt="Line plot icon" width="20px" />.  If multiple stations are
              selected, the time series shows the sum of events on each day.
            </p>
            <p>
              A climatology of events for selected stations can be plotted by clicking
              <img src={barchartImg} alt="Bar chart icon" width="20px" />.  The climatology is
              represented as the sum of events in each month for all selected stations.
            </p>
        </div>
      </div>

      <div id="guide-toggle-btn" className="guideButton">
        <img src={guideImg} />
      </div>      
      
      {/* Mouseover tooltip for stations */}
      <div id="map-tooltip" />
            
      {/* Buttons for downloading data and generating plots */}
      <div id="map-download-btn" className="hidden dataButton">
        <img src={downloadImg} />
      </div>
      <div id="map-timeseries-btn" className="hidden dataButton">
        <img src={linechartImg} />
      </div>
      <div id="map-totals-btn" className="hidden dataButton">
        <img src={barchartImg} />
      </div>

      {/* Draw Polygon selection toggle */}
      <div id="map-toggle-polygon" className="toggle-off" title="Draw Polygon to Select Stations">
        <img src={polyImg} />
      </div>

      {/* Datepicker control */}
      <div id="datepicker-container">
        <div>
          <DatePicker
            id="date-start"
            showIcon
            selected={startDate}
            onChange={(date) => {setStartDate(date ?? DEFAULT_START)}}
            dateFormat='yyyy-MM-dd'
            showMonthDropdown
            showYearDropdown
            dropdownMode='select'
            popperPlacement='bottom-end'
            minDate={new Date('01/01/1900')}
            maxDate={new Date()}
          />
        </div>
        <div>
          <DatePicker
            id="date-end"
            showIcon
            selected={endDate}
            onChange={(date) => {setEndDate(date ?? DEFAULT_END)}}
            dateFormat='yyyy-MM-dd'
            showMonthDropdown
            showYearDropdown
            dropdownMode='select'
            popperPlacement='bottom-end'
            minDate={new Date('01/01/1900')}
            maxDate={new Date()}
          />
        </div>
      </div>
      
    </div>
  );
};
