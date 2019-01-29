import React, { Component } from 'react';
import './App.css';
import LineChart from './visualizations/LineChart';
import BarChart from './visualizations/BarChart';
import RadialChart from './visualizations/RadialChart';



class App extends Component {
  state = {
    temps: {},
    city: 'ny', 
  };

  componentDidMount() {
    Promise.all([
      fetch(`${process.env.PUBLIC_URL}/kl.json`),
      fetch(`${process.env.PUBLIC_URL}/ny.json`),
    
    ]).then(responses => Promise.all(responses.map(resp => resp.json())))
    .then(([kl, ny]) => {
      kl.forEach(day => day.date = new Date(day.date));
      ny.forEach(day => day.date = new Date(day.date));

      this.setState({temps: {kl, ny}});
    });
  }

  updateCity = (e) => {
    this.setState({city: e.target.value});
  }

  render() {
    const data = this.state.temps[this.state.city];

    return (
      <div className="App">
        <div className="Author">
          <h3> Hoang Hong Tu</h3>
          <h3>  Final Assignment
            <br/> 
                Course: Visual Analytics
            <br/>
                Arcada University of Applied Sciences
          </h3>
        
        </div>
        <h1>
          Temperature in the year 2017 for 
          <select name='city' onChange={this.updateCity}>
            {
              [
                {label: 'New York', value: 'ny'},
                {label: 'Koln', value: 'kl'},
        
                
              ].map(option => {
                return (<option key={option.value} value={option.value}>{option.label}</option>);
              })
            }
          </select>
        </h1>
      
        <LineChart data={data}/>
        <h3>Figure 1. Line Chart 2017</h3>
        <br/>

        <BarChart data={data} />
        <h3>Figure 2. Bar Chart 356 days in 2017</h3>
        <br />

        <RadialChart data={data} />
        <h3>Figure 3. Radical Chart 2017</h3>
        <br/>
        <p>
          These data visualisations are made by D3 and React
        </p>
        <p>
          (Weather data from <a href='wunderground.com' target='_new'>wunderground.com</a>)
        </p>
      </div>
    );
  }
}

export default App;
