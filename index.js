const gaugeOpts = Object.freeze({
  angle: -0.5, // The span of the gauge arc
  lineWidth: 0.05, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.45, // // Relative to gauge radius
    strokeWidth: 0.05, // The thickness
    color: '#000000', // Fill color
  },
  limitMax: true,     // If false, max value increases automatically if value > maxValue
  limitMin: true,     // If true, the min value of the gauge will be fixed
  colorStart: '#6FADCF',   // Colors
  colorStop: '#8FC0DA',    // just experiment with them
  strokeColor: '#E0E0E0',  // to see which ones work best for you
  generateGradient: false,
  highDpiSupport: true,     // High resolution support
  // renderTicks is Optional
  renderTicks: {
    divisions: 10,
    divWidth: 1.1,
    divLength: 0.7,
    divColor: '#333333',
    subDivisions: 0,
  },
  staticLabels: {
    font: "13px sans-serif",  // Specifies font
    labels: [-1,-2,-3,-4,-5,-6,-7,-8,-9,0,1,2,3,4,5,6,7,8,9],  // Print labels at these values
    color: "#000000",
    fractionDigits: 0
  },
});

const nGauges = 5;
const gauges = [];

function allowOnlyNumbers(e) {
  if (e.key.length === 1 && !e.shiftKey && !e.ctrlKey && !e.metaKey && /\D/.test(event.key)) {
    e.preventDefault();
  }
}

function reset() {
  const input = document.getElementById('input');
  setValue(0);
  input.value = '';
  input.focus({ focusVisible: true });
}

function isReverseGauge(idx) {
  return idx % 2 !== 0;
}

function buildGauge(idx, reverse = false) {
  const target = document.getElementById(`canvas-preview-${idx}`);
  const gauge = new Gauge(target).setOptions(gaugeOpts);
  if (reverse) {
    gauge.maxValue =  0;
    gauge.setMinValue(-10);
    gauge.set(-5);
  } else {
    gauge.maxValue = 10;
    gauge.setMinValue(0);
    gauge.set(5);
  }
  return gauge;
}



function setGaugeValue(idx, value) {
  const v = isReverseGauge(idx) ? -value : value;
  gauges[idx].set(v);
}

function initGauges() {
  const input = document.getElementById('input');
  input.addEventListener('keydown', allowOnlyNumbers);

  for (let i = nGauges - 1; i >= 0; i--) {
    gauges.push(buildGauge(i, isReverseGauge(i)));
  }
  setValue(0);
}

function setValue(kwh) {
  setGaugeValue(0, kwh % 10);
  setGaugeValue(1, kwh % 100 / 10);
  setGaugeValue(2, kwh % 1000 / 100);
  setGaugeValue(3, kwh % 10000 / 1000);
  setGaugeValue(4,  kwh % 100000 / 10000);
}

function onInputChanged(input) {
  let value = parseInt(input.value, 10);
  if (isNaN(value)) {
    value = 0;
  } else if (value < 0) {
    value = 0;
    input.value = '';
  } else if (value > 99999) {
    value = value % 99999;
    input.value = value;
  }
  setValue(value);
}

