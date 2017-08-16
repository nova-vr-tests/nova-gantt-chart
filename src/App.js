import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Gantt from './gantt/Gantt';

class App extends Component {
  render() {
    const tasks = [
      {
        title: "Task 1",
        startDate: new Date('01/05/17'),
        endDate: new Date('01/18/17'),
        color: '#65B766',
        subtasks: [
          {
            title: "Subtask 1.1",
            startDate: new Date('01/05/17'),
            endDate: new Date('01/09/17'),
          },
          {
            title: "Subtask 1.2",
            startDate: new Date('01/09/17'),
            endDate: new Date('01/18/17'),
          }
        ]
      },
      {
        title: "Task 2",
        startDate: new Date('01/18/17'),
        endDate: new Date('01/31/17'),
        color: '#59AF92',
        subtasks: [
          {
            title: "Subtask 2.1",
            startDate: new Date('01/18/17'),
            endDate: new Date('01/25/17'),
          },
          {
            title: "Subtask 2.2",
            startDate: new Date('01/25/17'),
            endDate: new Date('01/31/17'),
          }
        ]
      },
      {
        title: "Task 3",
        startDate: new Date('01/18/17'),
        endDate: new Date('02/08/17'),
        color: '#59A4AF',
        subtasks: []
      },
      {
        title: "Task 4",
        startDate: new Date('01/18/17'),
        endDate: new Date('04/15/17'),
        color: '#5888B3',
        subtasks: [
          {
            title: "Subtask 2.1",
            startDate: new Date('01/18/17'),
            endDate: new Date('01/25/17'),
          },
          {
            title: "Subtask 2.2",
            startDate: new Date('01/25/17'),
            endDate: new Date('01/31/17'),
          },
          {
            title: "Subtask 2.3",
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
