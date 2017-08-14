import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Gantt from './gantt/Gantt';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Gantt />
      </div>
    );
  }
}

export default App;
