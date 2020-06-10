import React, { useState } from 'react';

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

const TemperatureInput = (props) => {

  const handleChange = (e) => {
    props.onTemperatureChange(e.target.value);
  }

  console.log(props.temp, props.scale);

  return (
    <div>
    <fieldset>
    <legend>Enter temperature in {scaleNames[props.scale]}:</legend>
    <input value={props.temperature}
           onChange={handleChange} />
  </fieldset>
  <p style={{ color: 'red' }}>{props.temp}</p>
  </div>
  
  );
}

function Calculator() {

  const [temp, setTemp] = useState({temperature: '', scale: 'c'});

  function handleCelsiusChange(temperature) {
    setTemp({scale: 'c', temperature});  
  }

  function handleFahrenheitChange(temperature) {
    setTemp({scale: 'f', temperature});
  }

  const scale = temp.scale
  const temperature = temp.temperature
  const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
  const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;
  
  return (
    <div>
      <p>
  {celsius} {fahrenheit}</p>
    <TemperatureInput
      scale="c"
      temperature={celsius}
      onTemperatureChange={handleCelsiusChange} />
      <TemperatureInput
      scale="f"
      temperature={fahrenheit}
      onTemperatureChange={handleFahrenheitChange} />
    </div>
  );
}

export default Calculator;