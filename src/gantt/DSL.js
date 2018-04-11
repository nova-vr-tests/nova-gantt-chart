const a = {
    hey: true
}

const { hey } = a

console.log('yo', a, hey)

const str = "    \n     my     \n     dad is cool     \n"
const keywords = "TASK SUBTASK START_DATE END_DATE".split(/\s+/)
const lex = str => str
    .trim()
    .split(/\n+/)
    .map(e => e
         .split(/\s+/)
         .filter(e => e !== "")
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

const subject = `
             TASK hello
                 START_DATE 0w
                 END_DATE 4w
                 SUBTASK Asset creation
                     START_DATE 2w
                     END_DATE 4w
                 SUBTASK who are you
                     START_DATE 2w
                     END_DATE 4w
             TASK hey
                 START_DATE 2w
                 END_DATE 4w`

const countTasks = lexerOutput => lexerOutput.filter(([keyword]) => keyword.value === 'TASK').length

const parser = str => {
    const lexerOutput = lex(str)
    const numTasks = countTasks(lexerOutput)

    const ast = []

    for(let i = 0; i < lexerOutput.length; i++) {
        const [keyword, word] = lexerOutput[i]
        let task
        switch(keyword.value) {
        case 'TASK':
            ast.push({
                title: word.value,
                subtasks: [],
            })
            break
        case 'START_DATE':
            task = ast[ast.length - 1]
            if(task.subtasks.length) {
                const subtask = task.subtasks[task.subtasks.length - 1]
                subtask.startDate = word.value
            } else {
                task.startDate = word.value
            }
            break
        case 'END_DATE':
            task = ast[ast.length - 1]
            if(task.subtasks.length) {
                const subtask = task.subtasks[task.subtasks.length - 1]
                subtask.endDate = word.value
            } else {
                task.endDate = word.value
            }
            break
        case 'SUBTASK':
            task = ast[ast.length - 1]
            task.subtasks.push({
                title: word.value,
            })
            break
        }
    }
    return ast
}

console.log(JSON.stringify(parser(subject), null, 2))
