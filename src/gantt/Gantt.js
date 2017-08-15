import React, { Component } from 'react';
import './Gantt.css';

import paper from 'paper';

const addDays = days => {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);

  return dat;
}

const diffInDays = (startDate, endDate) => {
  const diff = endDate - startDate;    // milliseconds
  console.log(startDate, endDate, diff / 1000 / 60 / 60 / 24)

  return diff / (1000*60*60*24);
}

class Gantt extends Component {
  constructor(props) {
    super(props);

    // Constant used to build chart elements
    this.constants = {};
    // Base dimensions
    this.constants.BASE_HEIGHT = 12;                // task arrow height
    this.constants.BASE_WIDTH = 15;                 // x-coord difference between 2 days 

    // Arrow dimensions
    this.constants.TASK_ARROW_HEIGHT = 1.5 * this.constants.BASE_HEIGHT;
    this.constants.SUBTASK_ARROW_HEIGHT = 1 * this.constants.BASE_HEIGHT;
    this.constants.TASK_TITLE_START = 20;
    this.constants.SUBTASK_TITLE_START = 40;
    this.constants.DATE_GRADUATION_START = 200;     // where date graduation starts


    // Spaces beween tasks
    this.constants.TASK_INTERLINE = 1 * this.constants.BASE_HEIGHT;
    this.constants.SUBTASK_INTERLINE = 0.5 * this.constants.BASE_HEIGHT;

    // Fonts
    this.constants.TASK_FONT_SIZE = 9;
    this.constants.SUBTASK_FONT_SIZE = 7;

    this.constants.FONT_FAMILY = 'Courier New';
    this.constants.FONT_STROKE_WIDTH = 0.4,

    // Task title coords
    this.constants.TASK_TITLE_START_OFFSET = {
      x: this.constants.TASK_ARROW_HEIGHT / 2 + 4,
      y: this.constants.TASK_FONT_SIZE / 2.5,
    }

    this.constants.SUBTASK_TITLE_START_OFFSET = {
      x: this.constants.SUBTASK_ARROW_HEIGHT / 2 + 3,
      y: this.constants.SUBTASK_FONT_SIZE / 2.5,
    }

    // Line type
    this.constants.TASK = 0;
    this.constants.SUBTASK = 1;
    

    // Date constants
    this.constants.START_DATE = new Date('01/01/17');

    // Other constants
    this.constants.FIRST_TASK_Y = 50;

    this.dateToXCoord = this.dateToXCoord.bind(this);
    this.drawAllTasks = this.drawAllTasks.bind(this);
    this.drawArrow = this.drawArrow.bind(this);
    this.drawDashedLine = this.drawDashedLine.bind(this);
    this.drawTaskArrow = this.drawTaskArrow.bind(this);
    this.drawTaskLine = this.drawTaskLine.bind(this);
    this.drawTaskTitle = this.drawTaskTitle.bind(this);
    this.setupCanvas = this.setupCanvas.bind(this);
  }

  componentDidMount() {
    this.setupCanvas();
  }

  /**
   * Sets up the canvas to draw Gantt
   */
  setupCanvas() {
    // Get a reference to the canvas object
    var canvas = document.getElementById('gantt-canvas');
		// Create an empty project and a view for the canvas:
    paper.setup(canvas);


    // this.drawTaskLine("Task 1", this.constants.START_DATE, new Date('02/02/17'), this.constants.FIRST_TASK_Y);
    // this.drawSubtaskLine("Task 1", this.constants.START_DATE, new Date('02/02/17'), this.constants.FIRST_TASK_Y + this.constants.TASK_ARROW_HEIGHT);
    // this.drawSubtaskLine("Task 1", this.constants.START_DATE, new Date('02/02/17'), this.constants.FIRST_TASK_Y + this.constants.SUBTASK_ARROW_HEIGHT);

    this.drawAllTasks();

		// Draw the view now:
		paper.view.draw();
  }

  drawAllTasks() {
    const tasks = [
      {
        title: "Task 1",
        startDate: new Date('01/01/17'),
        endDate: new Date('01/18/17'),
        subtasks: [
          {
            title: "Subtask 1.1",
            startDate: this.constants.START_DATE,
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
    ];

    let yCoord = this.constants.FIRST_TASK_Y;

    for(let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      this.drawTaskLine(task.title, task.startDate, task.endDate, yCoord);
      yCoord += this.constants.TASK_INTERLINE + this.constants.TASK_ARROW_HEIGHT / 2;

      for(let j = 0; j < task.subtasks.length; j++) {
        const subtask = task.subtasks[j];
        yCoord += this.constants.SUBTASK_INTERLINE + this.constants.SUBTASK_ARROW_HEIGHT;
        this.drawSubtaskLine(subtask.title, subtask.startDate, subtask.endDate, yCoord);
      }

      yCoord += this.constants.SUBTASK_INTERLINE + this.constants.BASE_HEIGHT * 2;
    }
  }

  /**
   * Converts date to canvas x-coordinatec
   * @param {object} date Date object to convert to x-coordinate on canvas
   * @returns {number} X-coordinate of input date to return
   */
  dateToXCoord(date) {
    const xcoord = diffInDays(this.constants.START_DATE, date) * this.constants.BASE_WIDTH + this.constants.DATE_GRADUATION_START;

    return xcoord;
  }

  drawArrow(xStart, xEnd, yCoord, taskType) {
    let ARROW_HEIGHT = 0;
    
    if(taskType === this.constants.TASK)
      ARROW_HEIGHT = this.constants.TASK_ARROW_HEIGHT;
    else
      ARROW_HEIGHT = this.constants.SUBTASK_ARROW_HEIGHT;

    const drawArc = (startDate, yCoord) => {
      var arc = new paper.Path.Arc({
        from: [xStart, yCoord - ARROW_HEIGHT / 2],
        through: [xStart - ARROW_HEIGHT / 2, yCoord],
        to: [xStart, yCoord + ARROW_HEIGHT / 2],
        strokeColor: 'black'
      });
    }

    const drawLines = (xStart, xEnd, yCoord) => {
      const lineUpStart = new paper.Point(xStart, yCoord - ARROW_HEIGHT / 2);
      const lineUpEnd = new paper.Point(xEnd, yCoord - ARROW_HEIGHT / 2);

      const lineDownStart = new paper.Point(xStart, yCoord + ARROW_HEIGHT / 2);
      const lineDownEnd = new paper.Point(xEnd, yCoord + ARROW_HEIGHT / 2);

      const lineUp = new paper.Path.Line(lineUpStart, lineUpEnd);
      const lineDown = new paper.Path.Line(lineDownStart, lineDownEnd);

      lineUp.strokeColor = 'black';
      lineDown.strokeColor = 'black';
    }

    const drawArrowTip = (xEnd, yCoord) => {
      const endPoint = new paper.Point(xEnd + this.constants.BASE_WIDTH, yCoord);

      const curveUp = new paper.Path(
        new paper.Segment(
          new paper.Point(xEnd, yCoord - ARROW_HEIGHT / 2),
          null,
          new paper.Point(10, 0),
        ),
        new paper.Segment(
          endPoint,
          null,
          null,
        )
      );
      const curveDown = new paper.Path(
        new paper.Segment(
          new paper.Point(xEnd, yCoord + ARROW_HEIGHT / 2),
          null,
          new paper.Point(10, 0),
        ),
        new paper.Segment(
          endPoint,
          null,
          null,
        )
      );

      curveUp.strokeColor = 'black';
      curveDown.strokeColor = 'black';

      return endPoint;
    }

    drawArc(xStart, yCoord);
    drawLines(xStart, xEnd, yCoord);
    return drawArrowTip(xEnd, yCoord);
  }

  /**
   * Returns an arrow associated with a task with given duration
   * @param {object} startDate Arrow start date
   * @param {object} endDate Arrow end date
   * @param {number} yCoord Y-coordinate of arrow midline
   */
  drawTaskArrow(startDate, endDate, yCoord, taskType) {
    this.drawArrow(this.dateToXCoord(startDate), this.dateToXCoord(endDate), yCoord, taskType);
  }

  drawTaskTitle(title, yCoord, taskType = this.constants.TASK) {
    let ARROW_HEIGHT, ARROW_START, TEXT_START;

    if(taskType === this.constants.TASK) {
      ARROW_HEIGHT = this.constants.TASK_ARROW_HEIGHT;
      ARROW_START = this.constants.TASK_TITLE_START;
      TEXT_START = this.constants.TASK_TITLE_START_OFFSET;
    } else {
      ARROW_HEIGHT = this.constants.SUBTASK_ARROW_HEIGHT;
      ARROW_START = this.constants.SUBTASK_TITLE_START;
      TEXT_START = this.constants.SUBTASK_TITLE_START_OFFSET;
    }

    const arrowEndPoint = this.drawArrow(ARROW_START, 100, yCoord, taskType);
    const circle = paper.Path.Circle(new paper.Point(ARROW_START, yCoord), ARROW_HEIGHT / 2);
    circle.fillColor = 'black';
    const text = new paper.PointText(ARROW_START + TEXT_START.x, yCoord + TEXT_START.y);


    if(taskType === this.constants.TASK) {
      text.strokeColor = 'black';
      text.content = title;
      text.fontSize = this.constants.TASK_FONT_SIZE;
      text.fontFamily = this.constants.FONT_FAMILY;
      text.strokeWidth = this.constants.FONT_STROKE_WIDTH;
    } else {
      text.strokeColor = 'black';
      text.content = title;
      text.fontSize = this.constants.SUBTASK_FONT_SIZE;
      text.fontFamily = this.constants.FONT_FAMILY;
      text.strokeWidth = this.constants.FONT_STROKE_WIDTH;
    }


    return arrowEndPoint;
  }

  drawDashedLine(xStart, xEnd, yCoord) {
    const line = paper.Path.Line(new paper.Point(xStart, yCoord), new paper.Point(xEnd, yCoord));
    line.strokeColor = 'black';
    line.dashArray = [2, 3];
  }

  drawTaskLine(taskName, startDate, endDate, yCoord) {
    this.drawTaskArrow(startDate, endDate, yCoord, this.constants.TASK);
    const taskTitleArrowEndPoint = this.drawTaskTitle(taskName, yCoord, this.constants.TASK);
    this.drawDashedLine(taskTitleArrowEndPoint.x, this.dateToXCoord(startDate) - this.constants.BASE_WIDTH / 2, yCoord);
  }

  drawSubtaskLine(subtaskName, startDate, endDate, yCoord) {
    this.drawTaskArrow(startDate, endDate, yCoord, this.constants.SUBTASK);
    const taskTitleArrowEndPoint = this.drawTaskTitle(subtaskName, yCoord, this.constants.SUBTASK);
    this.drawDashedLine(taskTitleArrowEndPoint.x, this.dateToXCoord(startDate) - this.constants.BASE_WIDTH / 2, yCoord);
  }

  render() {
    return (
      <div className="gantt">
        <h1>Gantt</h1>
        <canvas id="gantt-canvas" height={ 1000 } width={ 2000 }></canvas>
      </div>
    );
  }
}

export default Gantt;