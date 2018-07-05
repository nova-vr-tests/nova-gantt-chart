
const keywords = 'TASK SUBTASK START_DATE END_DATE'.split(/\s+/)

const lex = str => str
    .trim()
    .split(/\n+/)
    .map(e => e
        .split(/\s+/)
        .filter(e => e !== '')
        .map(e => ({
            type: keywords.includes(e) ? 'keyword' : 'word',
            value: e,
        })))
    .map(([ car, ...cdr ]) => {
        return [
            car,
            {
                type: 'word',
                value: cdr.map(e => e.value).join(' ')
            }
        ]
    })

// callbacks: Array<[char, c: int => Date]>
const parseDate = (str, callbacks) => {
    const unit = str.slice(str.length - 1, str.length)
    const magnitude = parseInt(str.slice(0, str.length - 1))

    if(isNaN(magnitude))
        return 'Syntax Error: cannot parse date, argument is NaN'

    for(let i = 0; i < callbacks.length; i++) {
        const char = callbacks[i][0]
        const callback = callbacks[i][1]

        if(unit === char)
            return callback(magnitude)
    }

    return 'Syntax Error: unit does not exist'
}

const parser = (str, callbacks) => {
    const lexerOutput = lex(str)

    const ast = []

    for(let i = 0; i < lexerOutput.length; i++) {
        const [keyword, word] = lexerOutput[i]
        let task
        switch(keyword.value) {
        case 'INIT_DATE':
            ast.push({
                projectInitDate: new Date(word.value),
                subtasks: [],
                startDate: '',
                endDate: '',
                color: 'red',
            })
            break
        case 'TASK':
            ast.push({
                title: word.value,
                subtasks: [],
                startDate: '',
                endDate: '',
                color: 'red',
            })
            break
        case 'COLOR':
            if(!ast.length)
                return 'Syntax error: no TASK has been defined'

            task = ast[ast.length - 1]
            task.color = word.value

            break
        case 'START_DATE':
            if(!ast.length)
                return 'Syntax error: no TASK has been defined'

            const startDate = parseDate(word.value, callbacks)
            task = ast[ast.length - 1]
            if(task.subtasks.length) {
                const subtask = task.subtasks[task.subtasks.length - 1]
                subtask.startDate = startDate
            } else {
                task.startDate = startDate
            }
            break
        case 'END_DATE':
            if(!ast.length)
                return 'Syntax error: no TASK has been defined'

            const endDate = parseDate(word.value, callbacks)
            task = ast[ast.length - 1]
            if(task.subtasks.length) {
                const subtask = task.subtasks[task.subtasks.length - 1]
                subtask.endDate = endDate
            } else {
                task.endDate = endDate
            }
            break
        case 'SUBTASK':
            if(!ast.length)
                return 'Syntax error: no TASK has been defined'

            task = ast[ast.length - 1]
            task.subtasks.push({
                title: word.value,
                startDate: '',
                endDate: '',
            })
            break
        }
    }
    return ast
}

export default parser
