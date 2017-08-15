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

  return diff / (1000*60*60*24);
}

class Gantt extends Component {
  constructor(props) {
    super(props);

    // Constant used to build chart elements
    this.constants = {
      // Base dimensions
      BASE_HEIGHT: 12,                // task arrow height
      BASE_WIDTH: 15,                 // x-coord difference between 2 days 

      // Base x-coordinates
      DATE_GRADUATION_START: 200,     // where date graduation starts
      TASK_START: 50,                // where task title text starts
      SUBTASK_START: 200,             // where sub-task title text starts

      // Date constants
      START_DATE: new Date('01/01/17'),

      // Fonts
      FONT_SIZE: 8,
      FONT_FAMILY: 'Courier New',
      FONT_STROKE_WIDTH: 0.4,
    };

    this.dateToXCoord = this.dateToXCoord.bind(this);
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


    this.drawTaskLine("Task 1", this.constants.START_DATE, new Date('02/02/17'), 50);

		// Draw the view now:
		paper.view.draw();
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

  drawArrow(xStart, xEnd, yCoord) {
    const drawArc = (startDate, yCoord) => {
      var arc = new paper.Path.Arc({
        from: [xStart, yCoord - this.constants.BASE_HEIGHT / 2],
        through: [xStart - this.constants.BASE_HEIGHT / 2, yCoord],
        to: [xStart, yCoord + this.constants.BASE_HEIGHT / 2],
        strokeColor: 'black'
      });
    }

    const drawLines = (xStart, xEnd, yCoord) => {
      const lineUpStart = new paper.Point(xStart, yCoord - this.constants.BASE_HEIGHT / 2);
      const lineUpEnd = new paper.Point(xEnd, yCoord - this.constants.BASE_HEIGHT / 2);

      const lineDownStart = new paper.Point(xStart, yCoord + this.constants.BASE_HEIGHT / 2);
      const lineDownEnd = new paper.Point(xEnd, yCoord + this.constants.BASE_HEIGHT / 2);

      const lineUp = new paper.Path.Line(lineUpStart, lineUpEnd);
      const lineDown = new paper.Path.Line(lineDownStart, lineDownEnd);

      lineUp.strokeColor = 'black';
      lineDown.strokeColor = 'black';
    }

    const drawArrowTip = (xEnd, yCoord) => {
      const endPoint = new paper.Point(xEnd + this.constants.BASE_WIDTH, yCoord);

      const curveUp = new paper.Path(
        new paper.Segment(
          new paper.Point(xEnd, yCoord - this.constants.BASE_HEIGHT / 2),
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
          new paper.Point(xEnd, yCoord + this.constants.BASE_HEIGHT / 2),
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
  drawTaskArrow(startDate, endDate, yCoord) {
    this.drawArrow(this.dateToXCoord(startDate), this.dateToXCoord(endDate), yCoord);
  }

  drawTaskTitle(title, yCoord) {
    const arrowEndPoint = this.drawArrow(this.constants.TASK_START, 100, yCoord);

    const circle = paper.Path.Circle(new paper.Point(this.constants.TASK_START, yCoord), this.constants.BASE_HEIGHT / 2);
    circle.fillColor = 'black';

    const text = new paper.PointText(new paper.Point(this.constants.TASK_START + 3 * this.constants.BASE_HEIGHT / 4, yCoord + this.constants.BASE_HEIGHT / 4));
    text.strokeColor = 'black';
    text.content = title;
    text.fontSize = this.constants.FONT_SIZE;
    text.fontFamily = this.constants.FONT_FAMILY;
    text.strokeWidth = this.constants.FONT_STROKE_WIDTH;

    return arrowEndPoint;
  }

  drawDashedLine(xStart, xEnd, yCoord) {
    const line = paper.Path.Line(new paper.Point(xStart, yCoord), new paper.Point(xEnd, yCoord));
    line.strokeColor = 'black';
    line.dashArray = [2, 3];
  }

  drawTaskLine(taskName, startDate, endDate, yCoord) {
    this.drawTaskArrow(startDate, endDate, yCoord);
    
    const taskTitleArrowEndPoint = this.drawTaskTitle(taskName, yCoord);

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