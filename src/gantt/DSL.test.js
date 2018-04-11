import DSL from './DSL'

describe('lexer', () => {
    test('keywords', () => {
        expect(1).toBe(1)
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
    })
})
