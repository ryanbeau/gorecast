import React from "react";
import ReactApexChart from 'react-apexcharts';

const Donut = ({labels, series, width, height, title}) => {
  const options = {
    chart: {
      type: 'donut',
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270
      }
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: title
    },
    theme: {
      mode: 'light',
      palette: 'palette4'
    },
    labels: labels,
    responsive: [{
      breakpoint: width || 380,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
  };

  return (
    <ReactApexChart type="donut" options={options} series={series} width={width} height={height} />
  );
}

export { 
  Donut,
};