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
      BASE_HEIGHT: 20,                // task arrow height
      BASE_WIDTH: 20,                 // x-coord difference between 2 days 

      // Base x-coordinates
      DATE_GRADUATION_START: 300,     // where date graduation starts
      TASK_START: 100,                // where task title text starts
      SUBTASK_START: 200,             // where sub-task title text starts

      // Date constants
      START_DATE: new Date('01/01/17'),
    };

    this.dateToXCoord = this.dateToXCoord.bind(this);
    this.drawTaskArrow = this.drawTaskArrow.bind(this);
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


    this.drawTaskArrow(this.constants.START_DATE, new Date('02/02/17'), 50);

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

  /**
   * Returns an arrow associated with a task with given duration
   * @param {object} startDate Arrow start date
   * @param {object} endDate Arrow end date
   * @param {number} yCoord Y-coordinate of arrow midline
   */
  drawTaskArrow(startDate, endDate, yCoord) {
    const arrowStart = new paper.Point(this.dateToXCoord(startDate), yCoord);
    const arrowEnd = new paper.Point(this.dateToXCoord(endDate), yCoord);

    const drawArc = (startDate, yCoord) => {
      var arc = new paper.Path.Arc({
        from: [this.dateToXCoord(startDate), yCoord - this.constants.BASE_HEIGHT / 2],
        through: [this.dateToXCoord(startDate) - this.constants.BASE_HEIGHT / 2, yCoord],
        to: [this.dateToXCoord(startDate), yCoord + this.constants.BASE_HEIGHT / 2],
        strokeColor: 'black'
      });
    }

    const drawLines = (startDate, endDate, yCoord) => {
      const lineUpStart = new paper.Point(this.dateToXCoord(startDate), yCoord - this.constants.BASE_HEIGHT / 2);
      const lineUpEnd = new paper.Point(this.dateToXCoord(endDate), yCoord - this.constants.BASE_HEIGHT / 2);

      const lineDownStart = new paper.Point(this.dateToXCoord(startDate), yCoord + this.constants.BASE_HEIGHT / 2);
      const lineDownEnd = new paper.Point(this.dateToXCoord(endDate), yCoord + this.constants.BASE_HEIGHT / 2);

      const lineUp = new paper.Path.Line(lineUpStart, lineUpEnd);
      const lineDown = new paper.Path.Line(lineDownStart, lineDownEnd);

      lineUp.strokeColor = 'black';
      lineDown.strokeColor = 'black';
    }

    const drawArrowTip = (endDate, yCoord) => {
      const curveUp = new paper.Path(
        new paper.Segment(
          new paper.Point(this.dateToXCoord(endDate), yCoord - this.constants.BASE_HEIGHT / 2),
          null,
          new paper.Point(10, 0),
        ),
        new paper.Segment(
          new paper.Point(this.dateToXCoord(endDate) + this.constants.BASE_WIDTH, yCoord),
          null,
          null
        )
      );
      const curveDown = new paper.Path(
        new paper.Segment(
          new paper.Point(this.dateToXCoord(endDate), yCoord + this.constants.BASE_HEIGHT / 2),
          null,
          new paper.Point(10, 0),
        ),
        new paper.Segment(
          new paper.Point(this.dateToXCoord(endDate) + this.constants.BASE_WIDTH, yCoord),
          null,
          null
        )
      );

      curveUp.strokeColor = 'black';
      curveDown.strokeColor = 'black';

      console.log(curveUp);
    }

    drawArc(startDate, yCoord);
    drawLines(startDate, endDate, yCoord);
    drawArrowTip(endDate, yCoord);
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