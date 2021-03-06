import React, {Component} from "react";
import "./App.css";
import parser from "./gantt/DSL.js";

import Gantt from "./gantt/Gantt";
import moment from "moment";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {splitTasks, download, orderTasks} from "./functions";

const initTasks = `
INIT_DATE 8/1/18

TASK Design
    COLOR #59AF92

    SUBTASK Spec. v1
        START_DATE 0w
        END_DATE 2w
    SUBTASK Spec. v2
        START_DATE 2w
        END_DATE 4w
    SUBTASK Final spec
        START_DATE 4w
        END_DATE 6w

TASK Development
    COLOR #59A4AF

    SUBTASK Demo 1
        START_DATE 6w
        END_DATE 12w
    SUBTASK Demo 2
        START_DATE 12w
        END_DATE 20w
    SUBTASK Demo 3
        START_DATE 20w
        END_DATE 36w
    SUBTASK Demo 4
        START_DATE 36w
        END_DATE 48w
    SUBTASK MVP
        START_DATE 48w
        END_DATE 60w

TASK Testing
    COLOR #6b71b4

    SUBTASK Closed beta
        START_DATE 60w
        END_DATE 64w
    SUBTASK Open beta
        START_DATE 64w
        END_DATE 72w

TASK Deploy
    COLOR #926cad

    START_DATE 72w
    END_DATE 78w

TASK Market
    COLOR #59A4AF
    START_DATE 78w
    END_DATE 88w

`;

class SrcEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      str: this.props.src,
    };

    this.handleChange = this.handleChange.bind(this);

    this.setTextOutputRef = element => {
      this.textOutput = element;
    };

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.highlightKeywords = this.highlightKeywords.bind(this);
    this.syncScroll = this.syncScroll.bind(this);
    this.handleTrailingLineBreak = this.handleTrailingLineBreak.bind(this);
  }

  handleChange(e) {
    this.setState({str: e.target.value});
  }

  componentDidUpdate() {
    this.handleTrailingLineBreak();
    this.textOutput.scrollTop = this.textInput.scrollTop;
  }

  highlightKeywords(str) {
    return str
      .replace(/SUBTASK/g, "<strong style='color: blue'>SUBTASK</strong>")
      .replace(/TASK /g, "<strong style='color: red'>TASK </strong>")
      .replace(
        /START_DATE/g,
        "<strong style='color: purple'>START_DATE</strong>",
      )
      .replace(/END_DATE/g, "<strong style='color: purple'>END_DATE</strong>")
      .replace(
        /INIT_DATE/g,
        "<strong style='color: #6b71b4'>INIT_DATE</strong>",
      )
      .replace(/COLOR/g, "<strong style='color: purple'>COLOR</strong>")
      .replace(/([0-9]+)(w)/g, "$1<strong style='color: grey'>$2</strong>");
  }

  handleTrailingLineBreak() {
    if (
      this.state.str.slice(this.state.str.length - 1, this.state.str.length) ===
      "\n"
    ) {
      this.textOutput.innerHTML += "\n";
    }
  }

  syncScroll(e) {
    this.handleTrailingLineBreak();
    this.textOutput.scrollTop = e.target.scrollTop;
  }

  render() {
    const textareaHeight = "30rem";
    const textareaWidth = "30rem";
    const styles = {
      wrapper: {
        display: "flex",
        flexDirection: "column",
      },
      button: {},
      textArea: {
        position: "absolute",
        color: "rgba(0, 0, 0, 0)",
        caretColor: "red",
        width: textareaWidth,
        height: textareaHeight,
        resize: "none",
        left: 0,
        top: 0,
        margin: 0,
      },
      pre: {
        //color: 'rgba(0, 0, 0, 0)',
        margin: 0,
        textAlign: "left",
        position: "absolute",
        pointerEvents: "none",
        width: textareaWidth,
        height: textareaHeight,
        overflow: "hidden",
        left: 0,
        top: 0,
      },
      textareaWrapper: {
        width: textareaWidth,
        height: textareaHeight,
        position: "relative",
        margin: "2rem 0",
      },
    };

    return (
      <div style={styles.wrapper}>
        <div style={styles.textareaWrapper}>
          <textarea
            ref={this.setTextInputRef}
            onScroll={this.syncScroll}
            wrap="soft"
            style={styles.textArea}
            rows="40"
            onChange={this.handleChange}
            value={this.state.str}
          />
          <pre
            ref={this.setTextOutputRef}
            style={styles.pre}
            dangerouslySetInnerHTML={{
              __html: this.highlightKeywords(this.state.str),
            }}
          />
        </div>
        <button
          style={styles.button}
          onClick={() => this.props.submitCallback(this.state.str)}>
          Submit
        </button>
      </div>
    );
  }
}

SrcEditor.defaultProps = {
  src: "",
  submitCallback: () => {},
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initDate: new Date(), //startDate,
      getInitDate: () => new Date(this.state.initDate),
      base: {
        x: 15,
        y: 20,
      },
      constants: {
        DATE_GRADUATION_START: 350,
        TASK_FONT_SIZE: 18,
        SUBTASK_FONT_SIZE: 14,
        CALENDAR_GRADUATION_FONT_SIZE: 10,
        TASK_TIP_LENGTH: 45,
        SUBTASK_TIP_LENGTH: 35,
        TASK_ARROW_END_DATE_OFFSET: 10,
        GANTT_SPLITS: 1,
      },
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
    this.parseTasksSrc = this.parseTasksSrc.bind(this);
    this.parseTasksSrcAndUpdateState = this.parseTasksSrcAndUpdateState.bind(
      this,
    );

    const week = this.weeksToDate;
    const {tasks, initDate} = this.parseTasksSrc(initTasks);
    this.state.tasks = tasks;
    this.state.initDate = initDate;
  }
  parseTasksSrc(src) {
    const tasks = this.orderTasks(parser(src, [["w", this.weeksToDate]]));
    const newTasks = tasks.filter(e => !e.projectInitDate);
    const initDate = tasks.filter(e => e.projectInitDate)[0].projectInitDate;
    return {tasks: newTasks, initDate};
  }
  parseTasksSrcAndUpdateState(src) {
    const {tasks, initDate} = this.parseTasksSrc(src);
    this.setState({tasks, initDate});
  }

  orderTasks(tasks_original) {
    return orderTasks(tasks_original);
  }

  weeksToDate(weeks) {
    const initDate = this.state.getInitDate;
    return new Date(
      new Date(initDate()).setDate(initDate().getDate() + 7 * weeks),
    );
  }

  handleInputChange(event, i, j = -1, date = "startDate") {
    const target = event.target;

    const convertMomentToDate = moment => {
      const y = moment.year();
      const m = moment.month();
      const d = moment.date();

      return new Date(y + "/" + (m + 1) + "/" + d);
    };

    const tasks = [...this.state.tasks];

    if (target) {
      if (j > -1) {
        tasks[i].subtasks[j].title = target.value;
      } else {
        tasks[i].title = target.value;
      }
    } else {
      if (j > -1) {
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
      title: "new task",
      startDate: this.state.getInitDate(),
      endDate: this.weeksToDate(2),
      subtasks: [],
      color: "#999999",
    });
    this.setState({
      tasks: this.orderTasks(tasks),
    });
  }

  removeTask(i) {
    const tasks = [...this.state.tasks];
    tasks.splice(i, 1);

    this.setState({tasks: this.orderTasks(tasks)});
  }

  addSubtask(i) {
    const tasks = [...this.state.tasks];
    const subtasks = tasks[i].subtasks;
    subtasks.push({
      title: "new subtask",
      startDate: this.state.tasks[i].startDate,
      endDate: new Date(
        new Date(tasks[i].startDate).setDate(tasks[i].startDate.getDate() + 7),
      ),
    });
    this.setState({
      tasks: this.orderTasks(tasks),
    });
  }

  removeSubtask(i, j) {
    const tasks = [...this.state.tasks];
    tasks[i].subtasks.splice(j, 1);

    this.setState({tasks: this.orderTasks(tasks)});
  }

  updateTaskColor(e, i) {
    const tasks = [...this.state.tasks];
    tasks[i].color = e.target.value;

    this.setState({tasks: this.orderTasks(tasks)});
  }

  getForm() {
    const taskLines = [];

    const convertDateToString = date => {
      let y = date.getFullYear();
      let m =
        date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
      let d = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();

      return y + "-" + m + "-" + d;
    };

    for (let i = 0; i < this.state.tasks.length; i++) {
      const task = this.state.tasks[i];
      const subtaskLlines = [];

      for (let j = 0; j < task.subtasks.length; j++) {
        const subtask = this.state.tasks[i].subtasks[j];

        subtaskLlines[j] = (
          <div className="subtask-line--wrapper" key={"subtask-" + i + "-" + j}>
            <input
              type="text"
              value={subtask.title}
              onChange={e => this.handleInputChange(e, i, j)}
              className="subtask-title--input"
            />
            <div className="date-pickers">
              <Datepicker
                selected={moment(
                  convertDateToString(subtask.startDate),
                  "YYYY-MM-DD",
                )}
                onChange={e => this.handleInputChange(e, i, j, "startDate")}
              />
              <Datepicker
                selected={moment(
                  convertDateToString(subtask.endDate),
                  "YYYY-MM-DD",
                )}
                onChange={e => this.handleInputChange(e, i, j, "endDate")}
              />
              <div
                className="remove-subtask--button"
                onClick={() => this.removeSubtask(i, j)}>
                Remove
              </div>
            </div>
          </div>
        );
      }

      const taskLineStyle = {
        wrapper: {
          border: "4px solid",
          borderColor: this.state.tasks[i].color,
        },
        color: {
          color: this.state.tasks[i].color,
        },
      };

      taskLines[i] = (
        <div className="task-controls--wrapper" key={"task-" + i}>
          <div className="task-line--wrapper" style={taskLineStyle.wrapper}>
            <div className="color">
              <input
                type="text"
                onChange={e => this.updateTaskColor(e, i)}
                value={this.state.tasks[i].color}
                style={taskLineStyle.color}
              />
            </div>
            <div className="task-line--wrapper2">
              <input
                type="text"
                value={task.title}
                onChange={e => this.handleInputChange(e, i)}
                className="task-title--input"
              />
              <div className="date-pickers">
                <Datepicker
                  selected={moment(
                    convertDateToString(task.startDate),
                    "YYYY-MM-DD",
                  )}
                  onChange={e => this.handleInputChange(e, i, -1, "startDate")}
                />
                <Datepicker
                  selected={moment(
                    convertDateToString(task.endDate),
                    "YYYY-MM-DD",
                  )}
                  onChange={e => this.handleInputChange(e, i, -1, "endDate")}
                />
                <div
                  className="remove-task--button"
                  onClick={() => this.removeTask(i)}>
                  Remove
                </div>
              </div>
            </div>
            <div className="subtask-lines--wrapper">
              {subtaskLlines}
              <div
                className="add-subtask--button"
                onClick={() => this.addSubtask(i)}>
                Add Subtask
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        {taskLines}
        <div className="add-task--button" onClick={this.addTask}>
          Add Task
        </div>
      </div>
    );
  }

  getSVG(svg) {
    this.svg = svg;
  }

  downloadSVGGantt() {
    download(this.svg.outerHTML, "gantt.svg", "text/svg+xml");
  }

  getGanttSizeControls() {
    const handleBaseChange = e => {
      const base = this.state.base;
      base[e.target.name] = e.target.value;
      this.setState({base});
    };

    const handleConstantChange = e => {
      const constants = this.state.constants;
      constants[e.target.name] = parseFloat(e.target.value);
      this.setState({constants});
    };

    const styles = {
      constantInput: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
      },
      constantInputWrapper: {
        display: "flex",
        flexDirection: "column",
      },
      controlsWrapper: {
        padding: "2rem",
        height: "inherit",
      },
    };

    const ConstantInput = ({constantKey}) => (
      <div style={styles.constantInput}>
        <label htmlFor={constantKey}>{constantKey}:</label>
        <input
          name={constantKey}
          value={this.state.constants[constantKey]}
          onChange={handleConstantChange}
        />
      </div>
    );
    const inputs = [
      "DATE_GRADUATION_START",
      "TASK_FONT_SIZE",
      "SUBTASK_FONT_SIZE",
      "CALENDAR_GRADUATION_FONT_SIZE",
      "TASK_TIP_LENGTH",
      "SUBTASK_TIP_LENGTH",
      "TASK_ARROW_END_DATE_OFFSET",
      "GANTT_SPLITS",
    ].map((e, i) => (
      <ConstantInput
        styles={styles}
        constantKey={e}
        handleConstantChange={handleConstantChange}
        constants={this.state.constants}
        key={i}
      />
    ));

    return (
      <div className="size-controls--wrapper" style={styles.controlsWrapper}>
        <div style={{display: "flex", flexDirection: "column"}}>
          <div>
            <label htmlFor="x">X-unit:</label>
            <input
              name="x"
              value={this.state.base.x}
              onChange={handleBaseChange}
            />
          </div>
          <div>
            <label htmlFor="y">Y-unit:</label>
            <input
              name="y"
              value={this.state.base.y}
              onChange={handleBaseChange}
            />
          </div>
          {inputs}
          <SrcEditor
            src={initTasks}
            submitCallback={this.parseTasksSrcAndUpdateState}
          />
        </div>
      </div>
    );
  }

  render() {
    const styles = {
      main: {
        display: "flex",
        flexDirection: "row",
        marginLeft: "4rem",
        marginTop: "4rem",
      },
      button: {
        height: "4rem",
        alignSelf: "flex-start",
        display: "flex",
        justifyContent: "center",
      },
    };

    const constants = this.state.constants;
    constants.BASE_HEIGHT = this.state.base.y; // task arrow height
    constants.BASE_WIDTH = this.state.base.x; // x-coord difference between 2 days

    const tasks = splitTasks(
      this.state.tasks,
      this.state.constants.GANTT_SPLITS,
    );
    const Gantts = tasks.map((t, i) => (
      <Gantt
        canvasId={"canvas" + i}
        svgId={"svg" + i}
        key={i}
        tasks={t}
        getSVG={this.getSVG}
        constants={constants}
      />
    ));

    return (
      <div className="App" style={styles.main}>
        <div>
          <div className="general-controls--wrapper">
            {this.getGanttSizeControls()}
          </div>
        </div>
        <div className="svg--wrapper">
          {Gantts}
          <button
            style={styles.button}
            className="download--button"
            onClick={this.downloadSVGGantt}>
            Download
          </button>
        </div>
      </div>
    );
  }
}

export default App;
