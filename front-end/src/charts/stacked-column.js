import React from "react";
import ReactApexChart from 'react-apexcharts';

const StackedColumn = ({labels, series, width, height, title}) => {
  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    dataLabels: {
      enabled: false
    },
    colors: ['#43bcff', '#FF4560'],
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false
      },
    },
    title: {
      text: title
    },
    xaxis: {
      categories: labels,
    },
    legend: {
      position: 'right',
      offsetY: 40
    }
  }

  return (
    <ReactApexChart type="bar" options={options} series={series} width={width} height={height} />
  );
}

export { 
  StackedColumn,
};