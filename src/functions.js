const getDateSpread = tasks => {
  let startDate = tasks[0].startDate;
  let endDate = tasks[0].endDate;

  let minDate = startDate ? startDate.getTime() : new Date("1/1/3018");
  let maxDate = endDate ? endDate.getTime() : new Date("1/1/2018");
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const startDate = task.startDate
      ? task.startDate.getTime()
      : new Date("1/1/3018");
    const endDate = task.endDate
      ? task.endDate.getTime()
      : new Date("1/1/2018");

    if (startDate < minDate) {
      minDate = startDate;
    }

    if (endDate > maxDate) {
      maxDate = endDate;
    }
  }
  const returnValue = {
    minDate: new Date(minDate),
    maxDate: new Date(maxDate),
  };

  console.log("reutrn value", returnValue);

  return returnValue;
};

const getDateIntervals = (minDate, maxDate, n) => {
  const dates = [];
  const interval = (maxDate.getTime() - minDate.getTime()) / n;
  for (let i = 0; i <= n; i++) {
    dates.push(new Date(minDate.getTime() + i * interval));
  }

  return dates;
};

const trimInterval = (startDate, endDate, lowerBound, upperBound) => {
  let trimmedStartDate = startDate;
  let trimmedEndDate = endDate;

  if (endDate < startDate)
    // error
    return 0;

  if (startDate > upperBound)
    // hasn't started yet
    return -1;

  if (endDate < lowerBound)
    // already finished
    return 1;

  // here we are sure that:
  //   1. startDate <= endDate
  //   2. startDate < upperBound
  //   3. endDate > lowerBound

  if (startDate >= lowerBound && endDate <= upperBound) {
    // included in interval
    return {
      startDate,
      endDate,
    };
  }

  if (startDate < lowerBound) trimmedStartDate = lowerBound;

  if (endDate > upperBound) trimmedEndDate = upperBound;

  return {
    startDate: trimmedStartDate,
    endDate: trimmedEndDate,
  };
};

const splitTasks = (tasks, n) => {
  if (!tasks.length) return 0;

  if (n === 1) return [tasks];

  const {minDate, maxDate} = getDateSpread(tasks);
  const dateIntervals = getDateIntervals(minDate, maxDate, n);
  const result = []; // array of task arrays

  for (let i = 0; i < n; i++) {
    const lowerBound = dateIntervals[i];
    const upperBound = dateIntervals[i + 1];
    result.push([]);
    console.log("foo", i, n, result);

    for (let j = 0; j < tasks.length; j++) {
      const currentTask = tasks[j];
      const currentSubtasks = currentTask.subtasks || [];
      const startDate = currentTask.startDate;
      const endDate = currentTask.endDate;
      const subtasks = [];

      for (let k = 0; k < currentSubtasks.length; k++) {
        const currentSubtask = currentSubtasks[k];
        subtasks.push({
          ...currentSubtask,
          startDate: trimInterval(
            currentSubtask.startDate,
            currentSubtask.endDate,
            lowerBound,
            upperBound,
          ).startDate,
          endDate: trimInterval(
            currentSubtask.startDate,
            currentSubtask.endDate,
            lowerBound,
            upperBound,
          ).endDate,
          before:
            trimInterval(
              currentSubtask.startDate,
              currentSubtask.endDate,
              lowerBound,
              upperBound,
            ) < 0,
          after:
            trimInterval(
              currentSubtask.startDate,
              currentSubtask.endDate,
              lowerBound,
              upperBound,
            ) > 0,
        });
      }

      console.log(
        "yoooo",
        trimInterval(startDate, endDate, lowerBound, upperBound),
      );
      result[i].push({
        ...currentTask,
        startDate: trimInterval(startDate, endDate, lowerBound, upperBound)
          .startDate,
        endDate: trimInterval(startDate, endDate, lowerBound, upperBound)
          .endDate,
        before: trimInterval(startDate, endDate, lowerBound, upperBound) < 0,
        after: trimInterval(startDate, endDate, lowerBound, upperBound) > 0,
        subtasks,
      });
    }
  }

  return result;
};

/**
 * https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript
 */
function download(strData, strFileName, strMimeType) {
  var D = document,
    A = arguments,
    a = D.createElement("a"),
    n = A[1];

  //build download link:
  a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);

  if ("download" in a) {
    //FF20, CH19
    a.setAttribute("download", n);
    a.innerHTML = "downloading...";
    D.body.appendChild(a);
    setTimeout(function() {
      var e = D.createEvent("MouseEvents");
      e.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null,
      );
      a.dispatchEvent(e);
      D.body.removeChild(a);
    }, 66);
    return true;
  } /* end if('download' in a) */

  //do iframe dataURL download: (older W3)
  var f = D.createElement("iframe");
  D.body.appendChild(f);
  f.src =
    "data:" +
    (A[2] ? A[2] : "application/octet-stream") +
    (window.btoa ? ";base64" : "") +
    "," +
    (window.btoa ? window.btoa : escape)(strData);
  setTimeout(function() {
    D.body.removeChild(f);
  }, 333);
  return true;
}

const orderTasks = tasks_original => {
  const tasks = [...tasks_original];

  // Update task delta t when subtasks
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    let minDate = task.startDate;
    let maxDate = task.endDate;

    if (task.subtasks.length) {
      minDate = task.subtasks[0].startDate;
      maxDate = task.subtasks[task.subtasks.length - 1].endDate;
    }

    for (let j = 0; j < task.subtasks.length; j++) {
      const subtask = task.subtasks[j];
      if (subtask.startDate < minDate) minDate = subtask.startDate;

      if (subtask.endDate > maxDate) maxDate = subtask.endDate;
    }

    task.startDate = minDate;
    task.endDate = maxDate;
  }

  // Sort by task date
  tasks.sort((a, b) => {
    if (JSON.stringify(a.startDate) !== JSON.stringify(b.startDate)) {
      return a.startDate - b.startDate;
    } else {
      return a.endDate - a.startDate - (b.endDate - b.startDate);
    }
  });

  // Sort by subtask length and date
  for (let i = 0; i < tasks.length; i++) {
    // Sort by date
    tasks[i].subtasks.sort((a, b) => {
      if (JSON.stringify(a.startDate) !== JSON.stringify(b.startDate)) {
        return a.startDate - b.startDate;
      } else {
        return a.endDate - a.startDate - (b.endDate - b.startDate);
      }
    });
  }

  return tasks;
};

export {
  download,
  orderTasks,
  splitTasks,
  getDateSpread,
  getDateIntervals,
  trimInterval,
};
