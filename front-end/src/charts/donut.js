import React from "react";
import ReactApexChart from 'react-apexcharts';

const Donut = ({ data, width, height, title, labelTotal }) => {
  const options = {
    chart: {
      type: 'donut',
      toolbar: {
        show: true
      },
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        expandOnClick: false,
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: labelTotal ?? 'Total',
            },
          },
          size: '75%',
        },
        size: 200,
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false,
    },
    labels: data?.labels ?? [],
    title: {
      text: title
    },
    tooltip: {
      enabled: false,
    },
    theme: {
      mode: 'light',
      palette: 'palette1'
    },
    responsive: [{
      breakpoint: width,
      options: {
        chart: {
          width: width
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
  };

  return (
    <ReactApexChart type="donut" options={options} series={data?.series ?? []} width={width} height={height} />
  );
}

export default Donut;