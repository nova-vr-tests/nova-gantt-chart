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
                     END_DATE 4w`

const parser = str => {
    const lexerOutput = lex(str)
    const ast = lexerOutput

    return ast
}

console.log(parser(subject))
