import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Gantt from './gantt/Gantt';
import moment from 'moment';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initDate: '09/17/2017',
      getInitDate : () => new Date(this.state.initDate),
    }
    

    this.orderTasks = this.orderTasks.bind(this);
    this.weeksToDate = this.weeksToDate.bind(this);
    this.getForm = this.getForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

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
        endDate: week(15),
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

  handleInputChange(event, i, j = -1, date="startDate") {
    const target = event.target;

    const convertMomentToDate = moment => {
      const y = moment.year();
      const m = moment.month();
      const d = moment.date();

      return new Date(y + "/" + (m + 1)  + "/" + d);
    }

    const tasks = [...this.state.tasks ];

    if(target) {
      if(j > -1) {
        tasks[i].subtasks[j].title = target.value;
      } else {
        tasks[i].title = target.value;
      }
    } else {
      if(j > -1) {
        tasks[i].subtasks[j][date] = convertMomentToDate(event);
      } else {
        tasks[i][date] = convertMomentToDate(event);
      }
    }

     this.setState({
      tasks: this.orderTasks(tasks),
    });
    console.log(this.state.tasks)
  }

  getForm() {
    const taskLines = [];

    const convertDateToString = date => {
      let y = date.getFullYear();
      let m = date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
      let d = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();

      console.log(y + "-" + m + "-" + d);
      return y + "-" + m + "-" + d;
    };

    for(let i = 0; i < this.state.tasks.length; i++) {
      const task = this.state.tasks[i];
      const subtaskLlines = [];

      for(let j = 0; j < task.subtasks.length; j++) {
        const subtask = this.state.tasks[i].subtasks[j];

        subtaskLlines[j] = (
          <div className="subtask-line--wrapper" key={ "subtask-" + i + "-" + j }>
            <input type="text"  value={ subtask.title } onChange={ e => this.handleInputChange(e, i, j) } className="subtask-title--input" />
            {/* <input type="date" value={ convertDateToString(subtask.startDate) } onChange={ e => this.handleInputChange(e, i, j) } /> */}
            <div className="date-pickers">
              <Datepicker selected={ moment(convertDateToString(subtask.startDate), "YYYY-MM-DD") } onChange={ e => this.handleInputChange(e, i, j, "startDate") } />
              <Datepicker selected={ moment(convertDateToString(subtask.endDate), "YYYY-MM-DD") } onChange={ e => this.handleInputChange(e, i, j, "endDate") } />
            </div>
          </div>
        );
      }

      taskLines[i] = (
        <div className="task-line--wrapper" key={ "task-" + i }>
          <div className="task-line--wrapper2">
            <input type="text" value={ task.title } onChange={ e => this.handleInputChange(e, i) } className="task-title--input" />
            <div className="date-pickers">
              <Datepicker selected={ moment(convertDateToString(task.startDate), "YYYY-MM-DD") } onChange={ e => this.handleInputChange(e, i, -1, "startDate") } />
              <Datepicker selected={ moment(convertDateToString(task.endDate), "YYYY-MM-DD") } onChange={ e => this.handleInputChange(e, i, -1, "endDate") } />
            </div>
          </div>
          <div className="subtask-lines--wrapper">
            { subtaskLlines }
          </div>
        </div>
      )
    }

    return (
      <div>
        { taskLines }
      </div>
   ) 
  }

  render() {
    const styles = {
      main: {
        display: 'flex',
        flexDirection: 'row',
      },
    };

    return (
      <div className="App" style={ styles.main }>
        { this.getForm() }
        <Gantt tasks={ this.orderTasks(this.state.tasks) } />
      </div>
    );
  }
}

export default App;
