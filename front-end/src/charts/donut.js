import React from "react";
import ReactApexChart from 'react-apexcharts';

const Donut = ({ data, width, height, title }) => {
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
              showAlways: true,
            }
          },
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    labels: data?.labels ?? [],
    title: {
      text: title
    },
    theme: {
      mode: 'light',
      palette: 'palette4'
    },
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
    <ReactApexChart type="donut" options={options} series={data?.series ?? []} width={width} height={height} />
  );
}

export default Donut;