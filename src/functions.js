/**
 * https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript 
 */
function download(strData, strFileName, strMimeType) {
    var D = document,
        A = arguments,
        a = D.createElement('a'),
        n = A[1]

    //build download link:
    a.href = 'data:' + strMimeType + 'charset=utf-8,' + escape(strData)



    if ('download' in a) { //FF20, CH19
        a.setAttribute('download', n)
        a.innerHTML = 'downloading...'
        D.body.appendChild(a)
        setTimeout(function() {
            var e = D.createEvent('MouseEvents')
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            a.dispatchEvent(e)
            D.body.removeChild(a)
        }, 66)
        return true
    } /* end if('download' in a) */



    //do iframe dataURL download: (older W3)
    var f = D.createElement('iframe')
    D.body.appendChild(f)
    f.src = 'data:' + (A[2] ? A[2] : 'application/octet-stream') + (window.btoa ? ';base64' : '') + ',' + (window.btoa ? window.btoa : escape)(strData)
    setTimeout(function() {
        D.body.removeChild(f)
    }, 333)
    return true
}


const orderTasks = tasks_original=> {
    const tasks = [...tasks_original]

    // Update task delta t when subtasks
    for(let i = 0; i < tasks.length; i++) {
        const task = tasks[i]

        let minDate = task.startDate
        let maxDate = task.endDate

        if(task.subtasks.length) {
            minDate = task.subtasks[0].startDate
            maxDate = task.subtasks[task.subtasks.length - 1].endDate
        }

        for(let j = 0; j < task.subtasks.length; j++){
            const subtask = task.subtasks[j]
            if(subtask.startDate < minDate)
                minDate = subtask.startDate

            if(subtask.endDate > maxDate)
                maxDate = subtask.endDate
        }

        task.startDate = minDate
        task.endDate = maxDate
    }

    // Sort by task date
    tasks.sort((a, b) => {
        if(JSON.stringify(a.startDate) !== JSON.stringify(b.startDate)) {
            return a.startDate - b.startDate
        } else {
            return (a.endDate - a.startDate) - (b.endDate - b.startDate)
        }
    })

    // Sort by subtask length and date
    for(let i = 0; i < tasks.length; i++) {
    // Sort by date
        tasks[i].subtasks.sort((a, b) => {
            if(JSON.stringify(a.startDate) !== JSON.stringify(b.startDate)) {
                return a.startDate - b.startDate
            } else {
                return (a.endDate - a.startDate) - (b.endDate - b.startDate)
            }
        })
    }

    return tasks
}

export {
    download,
    orderTasks,
}
