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

        /*
          SHOULD STRINGIFY TO THIS:

          [
            {
                "title": "hello",
                "subtasks": [
                    {
                        "title": "Asset creation",
                        "startDate": "2w",
                        "endDate": "4w"
                    },
                    {
                        "title": "who are you",
                        "startDate": "2w",
                        "endDate": "4w"
                    }
                ],
                "startDate": "0w",
                "endDate": "4w"
            },
            {
                "title": "hey",
                "subtasks": [],
                "startDate": "2w",
                "endDate": "4w"
            }
          ]

          */
    })
})
