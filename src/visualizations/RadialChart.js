import React, { Component } from 'react';
import * as d3 from 'd3';
import chroma from 'chroma-js';

const width = 650;
const height = 650;
const red = '#eb6a5b';
const green = '#b6e86f';
const blue = '#52b6ca';
const colors = chroma.scale([blue, green, red]);

class RadialChart extends Component {
  state = {
    slices: [], 
    tempAnnotations: [],
    
    radiusScale: d3.scaleLinear().range([0, width/2]),
    colorScale: d3.scaleLinear(),
    arcGenerator: d3.arc(),
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null; 
    const {data} = nextProps;
    const {radiusScale, colorScale, arcGenerator} = prevState;

    // data has changed, so recalculate scale domains
    const tempMin = d3.min(data, d => -15);
    const tempMax = d3.max(data, d => 35);
    //const tempDomain = d3.extent(data, d => d.high);
    const colorDomain = d3.extent(data, d => d.avg);
    radiusScale.domain([tempMin, tempMax]);
    colorScale.domain(colorDomain);

    // one arc per day, innerRadius is low temp, outerRadius is high temp
    const perSliceAngle = (2 * Math.PI) / data.length;
    const slices = data.map((d, i) => {
      const path = arcGenerator({
        startAngle: i * perSliceAngle,
        endAngle: (i + 1) * perSliceAngle,
        innerRadius: radiusScale(d.low),
        outerRadius: radiusScale(d.high),
      });

      return {path, fill: colors(colorScale(d.avg))};
    });

    const tempAnnotations = [-10,0,10,20,30,40].map(temp => {
      return {
        r: radiusScale(temp),
        temp,
      }
    });

    return {slices, tempAnnotations};
  }

  render() {

    return (
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {this.state.slices.map((d, i) => (<path key={i} d={d.path} fill={d.fill} />))}

          {this.state.tempAnnotations.map((d, i) => (
            <g key={i}>
              <circle r={d.r} fill='none' stroke='#999' />
              <text y={-d.r - 2} textAnchor='middle'>{d.temp} C</text>
            </g>
          ))}
        </g>
      </svg>
    );
  }
}

export default RadialChart;
