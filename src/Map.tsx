import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';
import 'react-datepicker/dist/react-datepicker.css';

import '@src/Map.css';
import { useMap, dateChangeCallback } from '@src/map';

import polyImg from '@src/assets/draw-polygon_1.svg';
import downloadImg from '@src/assets/download-data.svg';
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
      <div id="plot-dialog" className="dialog-content">
        <div id="plot-dialog-close" className="dialog-close-btn">
          &times;
        </div>
        <h3 id="plot-dialog-header">Plot</h3>
        <div id="plot-dialog-image"></div>
        <div id="plot-dialog-link"></div>
      </div>
      
      <div id="map-tooltip" />
      <div id="map-download-btn" className="hidden dataButton">
        <img src={downloadImg} />
      </div>
      <div id="map-timeseries-btn" className="hidden dataButton">
        <img src={linechartImg} />
      </div>
      <div id="map-totals-btn" className="hidden dataButton">
        <img src={barchartImg} />
      </div>

      {/* @ts-ignore: don't worry about it */}
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

      <div id="map-toggle-polygon" className="toggle-off" title="Draw Polygon to Select Stations">
        <img src={polyImg} />
      </div>
      
    </div>
  );
};
