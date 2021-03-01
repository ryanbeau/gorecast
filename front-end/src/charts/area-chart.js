import React from "react";
import ReactApexChart from 'react-apexcharts';

const Area = ({ data, width, height, title }) => {
  const options = {
    chart: {
      type: 'area',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '14px'
      }
    },
    xaxis: {
      type: data?.xtype,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      tickAmount: 4,
      floating: false,
      labels: {
        style: {
          colors: '#8e8da4',
        },
        offsetY: -7,
        offsetX: 0,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth'
    },
    theme: {
      mode: 'light',
      palette: 'palette4'
    },
    fill: {
      opacity: 0.5
    },
    tooltip: {
      x: {
        format: data?.xtooltipFormat,
      },
      fixed: {
        enabled: false,
        position: 'topRight'
      }
    },
    grid: {
      yaxis: {
        lines: {
          offsetX: -30
        }
      },
      padding: {
        left: 20
      }
    }
  };

  return (
    <ReactApexChart type="area" options={options} series={data?.series ?? []} width={width} height={height} />
  );
}

export default Area;