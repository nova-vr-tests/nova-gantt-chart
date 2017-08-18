import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Gantt from './gantt/Gantt';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initDate: '09/17/2018',
      getInitDate : () => new Date(this.state.initDate),
    }
    

    this.orderTasks = this.orderTasks.bind(this);
    this.weeksToDate = this.weeksToDate.bind(this);

    const week = this.weeksToDate;
    this.state.tasks = [
      {
        title: "Hardware install",
        startDate: week(0),
        endDate: week(3),
        color: '#65B766',
        subtasks: [
        ]
      },
      {
        title: "Needs analysis",
        startDate: week(0),
        endDate: week(4),
        color: '#59AF92',
        subtasks: [
        ]
      },
      {
        title: "BGRS tour",
        startDate: week(1),
        endDate: week(4),
        color: '#59A4AF',
        subtasks: []
      },
      {
        title: "Design spec",
        startDate: week(3),
        endDate: week(14),
        color: '#5888B3',
        subtasks: [
          {
            title: "Script",
            startDate: week(3),
            endDate: week(7),
          }, 
          {
            title: "Graphic charters",
            startDate: week(3),
            endDate: week(11),
          },
          {
            title: "Feasibility analysis",
            startDate: week(14),
            endDate: week(15),
          },
          {
            title: "Technical specification",
            startDate: week(5),
            endDate: week(14),
          }, 
        ]
      },
      {
        title: "Training",
        startDate: week(2),
        endDate: week(14),
        color: '#6b71b4',
        subtasks: [
          {
            title: 'Getting started',
            startDate: week(2),
            endDate: week(4),
          },
          {
            title: 'Hardware',
            startDate: week(4),
            endDate: week(7),
          },
          {
            title: 'Software',
            startDate: week(7),
            endDate: week(10),
          },
          {
            title: 'Theory',
            startDate: week(10),
            endDate: week(13),
          },
          {
            title: 'Lab',
            startDate: week(13),
            endDate: week(14),
          },
        ]
      },
      {
        title: 'Final restitution',
        startDate: week(15),
        endDate: week(16),
        subtasks: [],
        color: '#926cad',
      }
    ];
  }

  orderTasks(tasks_original) {
    const tasks = [...tasks_original];

    tasks.sort((a, b) => a.startDate - b.startDate);

    for(let i = 0; i < tasks.length; i++) {
      tasks[i].subtasks.sort((a, b) => a.startDate - b.startDate);
    }

    return tasks;
  }

  weeksToDate(weeks) {
    const initDate = this.state.getInitDate;
    return new Date(new Date(initDate()).setDate(initDate().getDate() + 7 * weeks));
  }

  getForm() {
    
  }

  render() {
    return (
      <div className="App">
        <Gantt tasks={ this.orderTasks(this.state.tasks) } />
      </div>
    );
  }
}

export default App;
