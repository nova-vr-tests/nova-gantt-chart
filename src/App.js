import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Gantt from './gantt/Gantt';

class App extends Component {
  render() {
    const tasks = [
      {
        title: "Hardware install",
        startDate: new Date('01/05/17'),
        endDate: new Date('01/18/17'),
        color: '#65B766',
        subtasks: [
          {
            title: "Setch design",
            startDate: new Date('01/05/17'),
            endDate: new Date('01/09/17'),
          },
          {
            title: "Intro tech restrictions",
            startDate: new Date('01/09/17'),
            endDate: new Date('01/18/17'),
          }
        ]
      },
      {
        title: "Define expectation",
        startDate: new Date('01/18/17'),
        endDate: new Date('01/31/17'),
        color: '#59AF92',
        subtasks: [
          {
            title: "Sketch design",
            startDate: new Date('01/18/17'),
            endDate: new Date('01/25/17'),
          },
          {
            title: "Intro tech restrictions",
            startDate: new Date('01/25/17'),
            endDate: new Date('01/31/17'),
          }
        ]
      },
      {
        title: "Exp BGRS tour",
        startDate: new Date('01/18/17'),
        endDate: new Date('02/08/17'),
        color: '#59A4AF',
        subtasks: []
      },
      {
        title: "Hard Mop creative",
        startDate: new Date('01/18/17'),
        endDate: new Date('03/19/17'),
        color: '#5888B3',
        subtasks: [
          {
            title: "Sketch design",
            startDate: new Date('01/18/17'),
            endDate: new Date('01/25/17'),
          },
          {
            title: "Intro tech restrictions",
            startDate: new Date('01/25/17'),
            endDate: new Date('01/31/17'),
          },
          {
            title: "Gameplay",
            startDate: new Date('01/20/17'),
            endDate: new Date('01/28/17'),
          }
        ]
      },
    ];
    return (
      <div className="App">
        <Gantt tasks={ tasks } />
      </div>
    );
  }
}

export default App;
