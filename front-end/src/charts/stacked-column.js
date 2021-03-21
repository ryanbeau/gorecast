import React from "react";
import ReactApexChart from 'react-apexcharts';

const StackedColumn = ({ data, width, height, title }) => {
  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: false,
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
    theme: {
      mode: 'light',
      palette: 'palette4'
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        onItemClick: {
          toggleDataSeries: true
        },
      },
    },
    title: {
      text: title
    },
    xaxis: {
      type: data?.xtype,
      labels: {
        format: data?.xlabelFormat,
      },
      categories: data.categories,
    },
    tooltip: {
      x: {
        format: data?.xtooltipFormat,
      },
    },
    legend: {
      position: 'right',
      offsetY: 40,
    }
  }

  return (
    <ReactApexChart type="bar" options={options} series={data?.series ?? []} width={width} height={height} />
  );
}

export default StackedColumn;