const options = {
  chart: {
    type: 'bar',
    height: 350,
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
  stroke: {
    width: 2
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  legend: {
    position: 'right',
    offsetY: 40
  }
}

export { 
  options,
};