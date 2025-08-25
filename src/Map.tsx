import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';
import 'react-datepicker/dist/react-datepicker.css';

import '@src/Map.css';
import { useMap, dateChangeCallback } from '@src/map';

import polyImg from '@src/assets/draw-polygon_1.svg';
import downloadImg from '@src/assets/download-data.svg';
import timeseriesImg from '@src/assets/bar-chart.svg';
import guideImg from '@src/assets/question-mark.svg';

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
        <h3 id="plot-dialog-header">Time Series Plot</h3>
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
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
            <p>This is where the guide will go</p>
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
        <img src={timeseriesImg} />
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
