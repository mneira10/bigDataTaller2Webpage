import React, { Component } from 'react'
import CanvasJSReact from './canvasjs/canvasjs.react';
import './chart.css';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
export default class Chart extends Component {
  render() {
    const options = {
      theme: "light2", // "light1", "dark1", "dark2"
      animationEnabled: true,
      zoomEnabled: true,
      title: {
      	text: this.props.title
      },
      axisY: {
        includeZero: false,
        title: this.props.ylabel,
      },
      axisX:{
        title:this.props.style==='column'? "Polarity":'Time',
        valueFormatString: "DD-MMM",
      },
      data: [{
        type: this.props.style? this.props.style : "area",
        markerColor: this.props.style? 'red': "",
        color: this.props.style==='column'? "#014D65":'',
        dataPoints: this.props.data
      }]
    }
    return (
        <div className='chart'>
          <CanvasJSChart options={options} /* onRef={ref => this.chart = ref} */ />
        </div>
    )
  }
}
