import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Gantt from './gantt/Gantt';

class App extends Component {
  render() {
    const initDate = () => new Date('10/09/17');
    const week = weeks => new Date(new Date(initDate()).setDate(initDate().getDate() + 7 * weeks));

    let tasks = [
      {
        title: "Hardware install",
        startDate: week(0),
        endDate: week(2),
        color: '#65B766',
        subtasks: [
        ]
      },
      {
        title: "Define expectation",
        startDate: week(0),
        endDate: week(3),
        color: '#59AF92',
        subtasks: [
        ]
      },
      {
        title: "Exp BGRS tour",
        startDate: week(3),
        endDate: week(5),
        color: '#59A4AF',
        subtasks: []
      },
      {
        title: "Hard Mop creative",
        startDate: week(5),
        endDate: week(13),
        color: '#5888B3',
        subtasks: [
          {
            title: "Sketch design",
            startDate: week(5),
            endDate: week(6),
          },
          {
            title: "Intro tech restrictions",
            startDate: week(5),
            endDate: week(6),
          },
          {
            title: "Gameplay",
            startDate: week(5),
            endDate: week(10),
          }, 
          {
            title: "Environments",
            startDate: week(6),
            endDate: week(8),
          }, 
          {
            title: "Storyline",
            startDate: week(5),
            endDate: week(9),
          }, 
          {
            title: "Concept art",
            startDate: week(6),
            endDate: week(13),
          }, 
        ]
      },
      {
        title: "Development",
        startDate: week(6),
        endDate: week(13),
        color: '#5888B3',
        subtasks: [
          {
            title: "Integration",
            startDate: week(6),
            endDate: week(11),
          },
          {
            title: "Asset integration",
            startDate: week(8),
            endDate: week(12),
          },
          {
            title: "Testing",
            startDate: week(9),
            endDate: week(13),
          }, 
        ],
      },
    ];

    const orderTasks = tasks => {
      tasks.sort((a, b) => a.startDate - b.startDate);

      for(let i = 0; i < tasks.length; i++) {
        tasks[i].subtasks.sort((a, b) => a.startDate - b.startDate);
      }

      return tasks;
    }

    tasks = orderTasks(tasks);
    return (
      <div className="App">
        <Gantt tasks={ tasks } />
      </div>
    );
  }
}

export default App;
