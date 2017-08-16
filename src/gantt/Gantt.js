import React, { Component } from 'react';
import './Gantt.css';

import paper from 'paper';

const addDays = (dat, jump) => {
  dat.setDate(dat.getDate() + jump);

  return dat;
}

const diffInDays = (startDate, endDate) => {
  const diff = endDate - startDate;    // milliseconds

  return diff / (1000 * 60 * 60 * 24);
}

class Gantt extends Component {
  constructor(props) {
    super(props);

    // Constant used to build chart elements
    this.constants = {};
    // Base dimensions
    this.constants.BASE_HEIGHT = 12;                // task arrow height
    this.constants.BASE_WIDTH = 14;                 // x-coord difference between 2 days 

    // Arrow dimensions
    this.constants.TASK_ARROW_HEIGHT = 1.5 * this.constants.BASE_HEIGHT;
    this.constants.SUBTASK_ARROW_HEIGHT = 1 * this.constants.BASE_HEIGHT;
    this.constants.CALENDAR_ARROW_HEIGHT = 2 * this.constants.BASE_HEIGHT;
    this.constants.TASK_TITLE_START = 20;
    this.constants.SUBTASK_TITLE_START = 40;
    this.constants.DATE_GRADUATION_START = 200;     // where date graduation starts
    this.constants.TASK_ARROW_POINT_DIAMETER = 0.4 * this.constants.BASE_HEIGHT;
    this.constants.CALENDAR_ARROW_POINT_DIAMETER = this.constants.TASK_ARROW_POINT_DIAMETER;
    this.constants.CALENDAR_GRADUATION_START = 10;

    // Colors
    this.constants.CALENDAR_BG_COLOR = '#A8A898';
    this.constants.CALENDAR_TEXT_COLOR = '#999999';


    // Spaces beween tasks
    this.constants.TASK_INTERLINE = 1 * this.constants.BASE_HEIGHT;
    this.constants.SUBTASK_INTERLINE = 0.5 * this.constants.BASE_HEIGHT;

    // Fonts
    this.constants.TASK_FONT_SIZE = 9;
    this.constants.SUBTASK_FONT_SIZE = 7;
    this.constants.CALENDAR_GRADUATION_FONT_SIZE = 10;

    this.constants.FONT_FAMILY = 'Courier New';
    this.constants.FONT_STROKE_WIDTH = 0.4,

      // Task title coords
      this.constants.TASK_TITLE_START_OFFSET = {
        x: this.constants.TASK_ARROW_HEIGHT / 0.75,
        y: this.constants.TASK_FONT_SIZE / 2.5,
      }

    this.constants.SUBTASK_TITLE_START_OFFSET = {
      x: this.constants.SUBTASK_ARROW_HEIGHT / 0.75,
      y: this.constants.SUBTASK_FONT_SIZE / 2.5,
    }

    // Line type
    this.constants.TASK = 0;
    this.constants.SUBTASK = 1;
    this.constants.CALENDAR = 2;


    // Date constants
    this.constants.START_DATE = new Date('01/01/17');

    // Other constants
    this.constants.FIRST_TASK_Y = 50;
    this.constants.TEXT_OPACITY = 0.5;
    this.constants.TEXT_COLOR_OPACITY = new paper.Color(255, 255, 255, this.constants.TEXT_OPACITY);
    this.constants.TEXT_COLOR = 'white';
    this.constants.DATE_GRADUATION_Y_COORD = this.constants.CALENDAR_ARROW_HEIGHT / 2 * 0.75;
    this.constants.CALENDAR_POINTS_BEFORE_START = 9;
    this.constants.CALENDAR_POINTS_AFTER_END = 3;
    this.constants.CALENDAR_MONTH_MARK_HEIGHT = 8;
    this.constants.CALENDAR_MONTH_FONT_SIZE = 12;
    this.constants.CALENDAR_YEAR_FONT_SIZE = 18;

    this.dateToXCoord = this.dateToXCoord.bind(this);
    this.drawAllTasks = this.drawAllTasks.bind(this);
    this.drawArrow = this.drawArrow.bind(this);
    this.drawCalendarLine = this.drawCalendarLine.bind(this);
    this.drawDashedLine = this.drawDashedLine.bind(this);
    this.drawTaskArrow = this.drawTaskArrow.bind(this);
    this.drawTaskArrowPoints = this.drawTaskArrowPoints.bind(this);
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
        color: '#65B766',
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
        endDate: new Date('04/31/17'),
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

    let yCoord = this.constants.FIRST_TASK_Y;

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      this.drawTaskLine(task.title, task.startDate, task.endDate, yCoord, task.color);

      if (task.subtasks.length) {
        yCoord += this.constants.TASK_ARROW_HEIGHT / 2 + this.constants.TASK_INTERLINE + this.constants.SUBTASK_ARROW_HEIGHT / 2;

        for (let j = 0; j < task.subtasks.length; j++) {
          const subtask = task.subtasks[j];
          this.drawSubtaskLine(subtask.title, subtask.startDate, subtask.endDate, yCoord, task.color);

          if (j !== task.subtasks.length - 1)
            yCoord += this.constants.SUBTASK_INTERLINE + this.constants.SUBTASK_ARROW_HEIGHT;
        }

        yCoord += this.constants.SUBTASK_ARROW_HEIGHT + this.constants.BASE_HEIGHT * 2;
      } else {

        yCoord += this.constants.TASK_ARROW_HEIGHT + this.constants.BASE_HEIGHT * 2;
      }
    }

    yCoord += this.constants.BASE_HEIGHT * 2;
    this.drawCalendarLine(tasks[0].startDate, tasks[tasks.length - 1].endDate, yCoord);
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

  drawArrow(xStart, xEnd, yCoord, taskType, color, isFilled = true) {
    const strokeWidth = 1;

    let ARROW_HEIGHT = 0;
    let tipAnchorLength = 0;
    let opacity = 1;
    let fillColor = color;
    if (taskType === this.constants.TASK) {
      ARROW_HEIGHT = this.constants.TASK_ARROW_HEIGHT;
      tipAnchorLength = 0.75 * this.constants.BASE_WIDTH;
    } else if (taskType === this.constants.SUBTASK) {
      ARROW_HEIGHT = this.constants.SUBTASK_ARROW_HEIGHT;
      tipAnchorLength = 0.5 * this.constants.BASE_WIDTH;
      opacity = 0.5;
    } else if (taskType === this.constants.CALENDAR) {
      ARROW_HEIGHT = this.constants.CALENDAR_ARROW_HEIGHT;
      tipAnchorLength = 1.0 * this.constants.BASE_WIDTH;
    }

    let endPoint = new paper.Point(xEnd, yCoord);


    const arrow = new paper.Path(
      // Bottom arc 
      new paper.Segment(
        new paper.Point(xStart + ARROW_HEIGHT / 2, yCoord + ARROW_HEIGHT / 2),
        null,
        new paper.Point(-0.55228 * ARROW_HEIGHT / 2, 0),
      ),
      new paper.Segment(
        new paper.Point(xStart, yCoord),
        new paper.Point(0, 0.55228 * ARROW_HEIGHT / 2),
        null,
      ),
      // Top arc
      new paper.Segment(
        new paper.Point(xStart, yCoord),
        null,
        new paper.Point(0, -0.55228 * ARROW_HEIGHT / 2),
      ),
      new paper.Segment(
        new paper.Point(xStart + ARROW_HEIGHT / 2, yCoord - ARROW_HEIGHT / 2),
        new paper.Point(-0.55228 * ARROW_HEIGHT / 2, 0),
        null,
      ),
      // Top line
      new paper.Segment(
        new paper.Point(xStart + ARROW_HEIGHT / 2, yCoord - ARROW_HEIGHT / 2),
      ),
      new paper.Segment(
        new paper.Point(xEnd - ARROW_HEIGHT, yCoord - ARROW_HEIGHT / 2),
      ),
      // Top arrow tip
      new paper.Segment(
        new paper.Point(xEnd - ARROW_HEIGHT, yCoord - ARROW_HEIGHT / 2),
        null,
        new paper.Point(tipAnchorLength, 0),
      ),
      new paper.Segment(
        endPoint,
        null,
        null,
      ),
      // Bottom arrow tip
      new paper.Segment(
        endPoint,
        null,
        null,
      ),
      new paper.Segment(
        new paper.Point(xEnd - ARROW_HEIGHT, yCoord + ARROW_HEIGHT / 2),
        new paper.Point(tipAnchorLength, 0),
        null,
      ),
      // Bottom line
      new paper.Segment(
        new paper.Point(xEnd - ARROW_HEIGHT, yCoord + ARROW_HEIGHT / 2),
      ),
      new paper.Segment(
        new paper.Point(xStart + ARROW_HEIGHT / 2, yCoord + ARROW_HEIGHT / 2),
      )
    );

    arrow.strokeColor = color;
    arrow.opacity = opacity;

    if (isFilled)
      arrow.fillColor = color;


    return endPoint;
  }

  /**
   * Returns an arrow associated with a task with given duration
   * @param {object} startDate Arrow start date
   * @param {object} endDate Arrow end date
   * @param {number} yCoord Y-coordinate of arrow midline
   */
  drawTaskArrow(startDate, endDate, yCoord, taskType, color) {
    this.drawArrow(this.dateToXCoord(startDate), this.dateToXCoord(endDate), yCoord, taskType, color);
  }

  drawTaskTitle(title, yCoord, taskType = this.constants.TASK, color) {
    let ARROW_HEIGHT, ARROW_START, TEXT_START;

    if (taskType === this.constants.TASK) {
      ARROW_HEIGHT = this.constants.TASK_ARROW_HEIGHT;
      ARROW_START = this.constants.TASK_TITLE_START;
      TEXT_START = this.constants.TASK_TITLE_START_OFFSET;
    } else {
      ARROW_HEIGHT = this.constants.SUBTASK_ARROW_HEIGHT;
      ARROW_START = this.constants.SUBTASK_TITLE_START;
      TEXT_START = this.constants.SUBTASK_TITLE_START_OFFSET;
    }

    const arrowEndPoint = this.drawArrow(ARROW_START, 130, yCoord, taskType, color, false);
    const circle = paper.Path.Circle(new paper.Point(ARROW_START + ARROW_HEIGHT / 2, yCoord), ARROW_HEIGHT / 2);
    circle.fillColor = color;
    const text = new paper.PointText(ARROW_START + TEXT_START.x, yCoord + TEXT_START.y);


    if (taskType === this.constants.TASK) {
      text.strokeColor = color;
      text.content = title;
      text.fontSize = this.constants.TASK_FONT_SIZE;
      text.fontFamily = this.constants.FONT_FAMILY;
      text.strokeWidth = this.constants.FONT_STROKE_WIDTH;
    } else {
      text.strokeColor = color;
      text.content = title;
      text.fontSize = this.constants.SUBTASK_FONT_SIZE;
      text.fontFamily = this.constants.FONT_FAMILY;
      text.strokeWidth = this.constants.FONT_STROKE_WIDTH;
    }

    text.fillColor = color;


    return arrowEndPoint;
  }

  drawDashedLine(xStart, xEnd, yCoord) {
    const line = paper.Path.Line(new paper.Point(xStart, yCoord), new paper.Point(xEnd, yCoord));
    line.strokeColor = 'black';
    line.dashArray = [2, 3];
    line.opacity = 0.5;
  }

  drawTaskArrowPoints(startDate, endDate, yCoord) {
    const points = [];
    const numPoints = Math.floor(diffInDays(startDate, endDate) / 8);

    for (let i = 0; i <= numPoints + 1; i++) {
      if (i === 0) {
        const text = new paper.PointText(new paper.Point(this.dateToXCoord(startDate) + this.constants.TASK_ARROW_HEIGHT / 2, yCoord + 4));
        text.strokeColor = this.constants.TEXT_COLOR;
        text.fontFamily = this.constants.FONT_FAMILY;
        text.strokeWidth = this.constants.FONT_STROKE_WIDTH;
        text.content = addDays(startDate, 1).getDate();
        text.fillColor = 'white';
        text.opacity = 0.5;
      } else if (i === numPoints + 1) {
        const text = new paper.PointText(new paper.Point(this.dateToXCoord(endDate) - this.constants.BASE_WIDTH - this.constants.TASK_ARROW_HEIGHT / 2, yCoord + 4));
        text.strokeColor = this.constants.TEXT_COLOR;
        text.fontFamily = this.constants.FONT_FAMILY;
        text.strokeWidth = this.constants.FONT_STROKE_WIDTH;
        text.content = addDays(endDate, -1).getDate();
        text.fillColor = 'white';
        text.opacity = 0.5;
      } else {
        points[i] = new paper.Path.Circle(
          new paper.Point(this.dateToXCoord(startDate) + i * 7 * this.constants.BASE_WIDTH + this.constants.TASK_ARROW_HEIGHT / 2, yCoord),
          this.constants.TASK_ARROW_POINT_DIAMETER / 2,
        );

        points[i].fillColor = this.constants.TEXT_COLOR_OPACITY;
      }


    }
  }

  drawTaskLine(taskName, startDate, endDate, yCoord, color) {
    this.drawTaskArrow(addDays(startDate, -1), addDays(endDate, +1), yCoord, this.constants.TASK, color);
    const taskTitleArrowEndPoint = this.drawTaskTitle(taskName, yCoord, this.constants.TASK, color);
    this.drawDashedLine(taskTitleArrowEndPoint.x, this.dateToXCoord(startDate), yCoord);
    this.drawTaskArrowPoints(startDate, endDate, yCoord);
  }

  drawSubtaskLine(subtaskName, startDate, endDate, yCoord, color) {
    this.drawTaskArrow(startDate, endDate, yCoord, this.constants.SUBTASK, color);
    const taskTitleArrowEndPoint = this.drawTaskTitle(subtaskName, yCoord, this.constants.SUBTASK, color);
    this.drawDashedLine(taskTitleArrowEndPoint.x, this.dateToXCoord(startDate), yCoord);
  }

  drawCalendarLine(startDate, endDate, yCoord) {
    this.drawArrow(this.constants.TASK_TITLE_START, this.dateToXCoord(endDate) + 4 * this.constants.BASE_WIDTH, yCoord, this.constants.CALENDAR, this.constants.CALENDAR_BG_COLOR);

      const points = [];
      const mondays = [];
      const monthGraduation = [];
      let year;
      const months = [];
    const drawCalendarGraduation = () => {

      const deltaDays = diffInDays(startDate, endDate);
      const pointYCoord = yCoord - this.constants.CALENDAR_ARROW_HEIGHT / 2 + this.constants.DATE_GRADUATION_Y_COORD;

      let m = 0;     // monday increment
      const date_m = new Date(startDate);
      let j = 0;    // months increment
      const i_0 =  -this.constants.CALENDAR_POINTS_BEFORE_START;
      addDays(date_m, -this.constants.CALENDAR_POINTS_BEFORE_START);
      for(let i = i_0; i < deltaDays + this.constants.CALENDAR_POINTS_AFTER_END; i++) {
        const x = this.constants.DATE_GRADUATION_START + i * this.constants.BASE_WIDTH;

        // Write year on first graduation
        if(i === i_0) {
          year = new paper.PointText(new paper.Point(
            x,
            yCoord + this.constants.CALENDAR_ARROW_HEIGHT / 2 + this.constants.CALENDAR_YEAR_FONT_SIZE / 2,
          ));

          year.fontSize = this.constants.CALENDAR_YEAR_FONT_SIZE;
          year.fillColor = new paper.Color(0,0,0,0.5);
          year.strokeWidth = 1;
          year.content = date_m.getFullYear();

        }

        // Show point of not Monday
        if(date_m.getDay() !== 0) {
          points[i] = new paper.Path.Circle(
            new paper.Point(x, pointYCoord), 
            this.constants.CALENDAR_ARROW_POINT_DIAMETER / 2,
          );         

          points[i].fillColor = 'black';
          points[i].opacity = this.constants.TEXT_OPACITY;
        } else {
          mondays[m] = new paper.PointText(new paper.Point(x - this.constants.CALENDAR_GRADUATION_FONT_SIZE / 1.5, yCoord));
          mondays[m].content = (date_m.getDate() + '').length < 2 ? "0" + date_m.getDate() : date_m.getDate();
          mondays[m].fillColor = 'black';
          mondays[m].fontSize = this.constants.CALENDAR_GRADUATION_FONT_SIZE;
          mondays[m].strokeWidth = 1;
          mondays[m].opacity = this.constants.TEXT_OPACITY;
          m++;
        }

        if(date_m.getDate() === 1) {
          monthGraduation[j] = new paper.Path.Line(
            new paper.Point(x, yCoord + this.constants.CALENDAR_ARROW_HEIGHT / 2 - this.constants.CALENDAR_MONTH_MARK_HEIGHT / 2),
            new paper.Point(x, yCoord + this.constants.CALENDAR_ARROW_HEIGHT / 2 + this.constants.CALENDAR_MONTH_MARK_HEIGHT / 2),
          );

          monthGraduation[j].strokeColor = 'black';
          monthGraduation[j].strokeWidth = 3;
          monthGraduation[j].opacity = this.constants.TEXT_OPACITY;
          monthGraduation[j].strokeCap = 'round';

          j++;
        }

        addDays(date_m, 1);
      };

    };

    const drawMonths = () => {
      const monthsNames = [
        "January", "Febuary", "March", "May", "April", "June", "July", "August", "Septembre", "October", "November", "December",
      ]

      // Show first month
      for(let i = 0; i < monthGraduation.length + 1; i++) {
        months[i] = new paper.PointText(year.bounds.right + 1 * this.constants.BASE_WIDTH, yCoord + this.constants.CALENDAR_ARROW_HEIGHT / 2 + this.constants.CALENDAR_MONTH_FONT_SIZE / 2);
        months[i].content = monthsNames[i];

        if(i === 0) {
          if(months[i].bounds.right < monthGraduation[0].bounds.left) {
            months[i].fillColor = 'black';
            months[i].opacity = 0.5;
            months[i].strokeWidth = 1;
          } else {
            months[i].opacity = 0;
          }
        } else if(i === monthGraduation.length) {
          if(months[i].bounds.left > monthGraduation[i - 1].bounds.right) {
            months[i].fillColor = 'black';
            months[i].opacity = 0.5;
            months[i].strokeWidth = 1;
            const translateX = this.dateToXCoord(endDate) -  months[i].bounds.left;
            months[i].translate(new paper.Point(translateX, 0));
          } else {
            months[i].opacity = 0;
          }

        } else {
          // center month
          months[i].fillColor = 'black';
          months[i].opacity = 0.5;
          months[i].strokeWidth = 1;

          const delta_0 = 0;//(monthGraduation[0].bounds.left - months[i].bounds.right) / 2;
          const translateX = i * (monthGraduation[i].bounds.left - monthGraduation[i - 1].bounds.right + delta_0)  - this.dateToXCoord(startDate);

          const midPt = (months[i].bounds.right - months[i].bounds.left) / 2;
          const midPt_prime = monthGraduation[i - 1].bounds.left + (monthGraduation[i].bounds.left - monthGraduation[i - 1].bounds.right) / 2 - months[0].bounds.left;
          const delta = midPt_prime - midPt;
          months[i].translate(new paper.Point(delta, 0));
        }
      }
    }

    drawCalendarGraduation();
    drawMonths();
  }

  render() {
    return (
      <div className="gantt">
        <h1>Gantt</h1>
        <canvas id="gantt-canvas" height={1000} width={2000}></canvas>
      </div>
    );
  }
}

export default Gantt;