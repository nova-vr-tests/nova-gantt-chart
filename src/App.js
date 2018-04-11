import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Gantt from './gantt/Gantt';
import moment from 'moment';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { download, orderTasks } from './functions';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initDate: '09/17/2017',
      getInitDate : () => new Date(this.state.initDate),
      base: {
        x: 10,
        y: 14,
      },
      constants: {
          DATE_GRADUATION_START: 350,
          TASK_FONT_SIZE: 18,
          SUBTASK_FONT_SIZE: 14,
          CALENDAR_GRADUATION_FONT_SIZE: 10,
          TASK_TIP_LENGTH: 45,
          SUBTASK_TIP_LENGTH: 35,
          TASK_ARROW_END_DATE_OFFSET: 10,
      }
    };
    

    this.orderTasks = this.orderTasks.bind(this);
    this.weeksToDate = this.weeksToDate.bind(this);
    this.getForm = this.getForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.addSubtask = this.addSubtask.bind(this);
    this.removeSubtask = this.removeSubtask.bind(this);
    this.getSVG = this.getSVG.bind(this);
    this.downloadSVGGantt = this.downloadSVGGantt.bind(this);
    this.getGanttSizeControls = this.getGanttSizeControls.bind(this);

    const week = this.weeksToDate;
    this.state.tasks = this.orderTasks([
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
    ]);
  }

  orderTasks(tasks_original) {
    return orderTasks(tasks_original);
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
  }

  addTask() {
    const tasks = [...this.state.tasks];
    tasks.push({
      title: 'new task',
      startDate: this.state.getInitDate(),
      endDate: this.weeksToDate(2),
      subtasks: [],
      color: '#999999',
    })
    this.setState({
      tasks: this.orderTasks(tasks),
    })
  }

  removeTask(i) {
    const tasks = [...this.state.tasks];
    tasks.splice(i, 1);

    this.setState({ tasks: this.orderTasks(tasks), });
  }

  addSubtask(i) {
    const tasks = [...this.state.tasks];
    const subtasks = tasks[i].subtasks;
    subtasks.push({
      title: 'new subtask',
      startDate: this.state.tasks[i].startDate,
      endDate: new Date(new Date(tasks[i].startDate).setDate(tasks[i].startDate.getDate() + 7)),
    })
    this.setState({
      tasks: this.orderTasks(tasks),
    })
  }

  removeSubtask(i, j) {
    const tasks = [...this.state.tasks];
    tasks[i].subtasks.splice(j, 1);

    this.setState({ tasks: this.orderTasks(tasks), });

  }

  updateTaskColor(e, i) {
    const tasks = [...this.state.tasks];
    tasks[i].color = e.target.value;

    this.setState({ tasks: this.orderTasks(tasks), });
  }

  getForm() {
    const taskLines = [];

    const convertDateToString = date => {
      let y = date.getFullYear();
      let m = date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
      let d = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();

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
              <div className="remove-subtask--button" onClick={ () => this.removeSubtask(i, j) }>Remove</div>
            </div>
          </div>
        );
      }

      const taskLineStyle = {
        wrapper: {
          border: '4px solid',
          borderColor: this.state.tasks[i].color,
        },
        color: {
          color: this.state.tasks[i].color,
        }
      };

      taskLines[i] = (
        <div className="task-controls--wrapper" >
          <div className="task-line--wrapper" key={ "task-" + i } style={ taskLineStyle.wrapper }>
            <div className="color"><input type="text" onChange={e => this.updateTaskColor(e, i)} value={ this.state.tasks[i].color } style={ taskLineStyle.color } /></div>
            <div className="task-line--wrapper2">
              <input type="text" value={ task.title } onChange={ e => this.handleInputChange(e, i) } className="task-title--input" />
              <div className="date-pickers">
                <Datepicker selected={ moment(convertDateToString(task.startDate), "YYYY-MM-DD") } onChange={ e => this.handleInputChange(e, i, -1, "startDate") } />
                <Datepicker selected={ moment(convertDateToString(task.endDate), "YYYY-MM-DD") } onChange={ e => this.handleInputChange(e, i, -1, "endDate") } />
                <div className="remove-task--button" onClick={ () => this.removeTask(i) }>Remove</div>
              </div>
            </div>
            <div className="subtask-lines--wrapper">
              { subtaskLlines }
              <div className="add-subtask--button" onClick={ () => this.addSubtask(i) }>Add Subtask</div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        { taskLines }
        <div className="add-task--button" onClick={ this.addTask }>Add Task</div>
      </div>
   ) 
  }

  getSVG(svg) {
    this.svg = svg;
  }

  downloadSVGGantt() {
    download(this.svg.outerHTML, 'gantt.svg', 'text/svg+xml');
  }

  getGanttSizeControls() {
    const handleBaseChange = e => {
      const base = this.state.base;
      base[e.target.name] = e.target.value;
      this.setState({ base, });
    };

    const handleConstantChange = e => {
      const constants = this.state.constants;
        constants[e.target.name] = parseFloat(e.target.value)
        console.log(constants)
      this.setState({ constants, });
    };

    const styles = {
      constantInput: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      constantInputWrapper: {
        display: 'flex',
        flexDirection: 'column',
      },
      controlsWrapper: {
          height: 'inherit',
      }
    }

    const ConstantInput = ({ constantKey }) => (
      <div style={ styles.constantInput } >
        <label htmlFor={ constantKey }>{ constantKey }:</label>
        <input name={ constantKey } value={ this.state.constants[constantKey] } onChange={ handleConstantChange } />
      </div>
    )

    const inputs = [
      "DATE_GRADUATION_START",
      "TASK_FONT_SIZE",
      "SUBTASK_FONT_SIZE",
      "CALENDAR_GRADUATION_FONT_SIZE",
      "TASK_TIP_LENGTH",
      "SUBTASK_TIP_LENGTH",
      "TASK_ARROW_END_DATE_OFFSET",
    ].map((e, i) => <ConstantInput constantKey={ e } key={ i } />)

    return (
      <div className="size-controls--wrapper" style={ styles.controlsWrapper }>
        <div>
          <label htmlFor="x">X-unit:</label><input name="x" value={ this.state.base.x } onChange={ handleBaseChange } />
        </div>
        <div>
          <label htmlFor="y">Y-unit:</label><input name="y" value={ this.state.base.y } onChange={ handleBaseChange } />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          { inputs }
        </div>
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

    const constants = {};
    constants.BASE_HEIGHT = this.state.base.y;                // task arrow height
    constants.BASE_WIDTH = this.state.base.x;                 // x-coord difference between 2 days 

    return (
      <div className="App" style={ styles.main }>
        { this.getForm() }
        <div className="svg--wrapper">
          <Gantt tasks={ this.state.tasks } getSVG={ this.getSVG } constants={ constants } />
          <div className="general-controls--wrapper">
            { this.getGanttSizeControls() }
            <div className="download--button" onClick={ this.downloadSVGGantt }>Download</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
