import {
    splitTasks,
    getDateSpread,
    getDateIntervals,
    trimInterval,
} from './functions.js'

describe('trimInterval', () => {
    test('error', () => {
        const t = 1000
        const startDate = new Date(t)
        const endDate = new Date(t - 10)
        const lowerBound = new Date(t)
        const upperBound = new Date(t)
        const output = trimInterval(startDate, endDate, lowerBound, upperBound)
        const result = 0

        expect(output).toEqual(result)
    })
    test('task hasnt started yet', () => {
        const t = 1000
        const startDate = new Date(t + 10)
        const endDate = new Date(t + 20)
        const lowerBound = new Date(t)
        const upperBound = new Date(t + 5)
        const output = trimInterval(startDate, endDate, lowerBound, upperBound)
        const result = -1

        expect(output).toEqual(result)
    })
    test('task finished', () => {
        const t = 1000
        const startDate = new Date(t)
        const endDate = new Date(t + 10)
        const lowerBound = new Date(t + 20)
        const upperBound = new Date(t + 25)
        const output = trimInterval(startDate, endDate, lowerBound, upperBound)
        const result = 1

        expect(output).toEqual(result)
    })
    test('task sandwiched', () => {
        const t = 1000
        const startDate = new Date(t)
        const endDate = new Date(t + 10)
        const lowerBound = new Date(t - 20)
        const upperBound = new Date(t + 20)
        const output = trimInterval(startDate, endDate, lowerBound, upperBound)
        const result =  {
            startDate,
            endDate,
        }

        expect(output).toEqual(result)
    })
    test('task start before, end during', () => {
        const t = 1000
        const startDate = new Date(t - 10)
        const endDate = new Date(t + 10)
        const lowerBound = new Date(t)
        const upperBound = new Date(t + 20)
        const output = trimInterval(startDate, endDate, lowerBound, upperBound)
        const result =  {
            startDate: lowerBound,
            endDate,
        }

        expect(output).toEqual(result)
    })
    test('task start during, end after', () => {
        const t = 1000
        const startDate = new Date(t + 10)
        const endDate = new Date(t + 30)
        const lowerBound = new Date(t)
        const upperBound = new Date(t + 20)
        const output = trimInterval(startDate, endDate, lowerBound, upperBound)
        const result =  {
            startDate,
            endDate: upperBound,
        }

        expect(output).toEqual(result)
    })
})

describe('getDateIntervals', () => {
    test('get intervals', () => {
        const n = 3
        const startDate = new Date("1/1/2001")
        const endDate = new Date("1/1/2002")
        const answer = [
            startDate,
            new Date(startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 3),
            new Date(startDate.getTime() + 2 * (endDate.getTime() - startDate.getTime()) / 3),
            endDate,
        ]
        const output = getDateIntervals(startDate, endDate, n)
        expect(output).toEqual(answer)
    })
})

describe('getDateSpread', () => {
    test('spread', () => {
        const input = [
            {
                title: "task 1",
                startDate: new Date("1/1/2001"),
                endDate: new Date("1/1/2002"),
                color: "A",
            },
            {
                title: "task 1",
                startDate: new Date("1/1/2001"),
                endDate: new Date("1/1/2008"),
                color: "A",
            },
        ]

        const answer = {
            minDate: input[0].startDate,
            maxDate: input[1].endDate,
        }

        const output = getDateSpread(input)

        expect(output).toEqual(answer)
    })
})

describe('splitTasks', () => {
    test('task split', () => {
        const n = 2
        const input = [
            {
                title: "task 1",
                startDate: new Date("1/1/2001"),
                endDate: new Date("1/1/2002"),
                color: "A",
                subtasks: [],
            },
        ]

        const answer = [
            [
                {
                    title: "task 1",
                    startDate: input[0].startDate,
                    endDate: new Date(input[0].startDate.getTime() + (input[0].endDate.getTime() - input[0].startDate.getTime()) / 2),
                    color: "A",
                    subtasks: [],
                    before: false,
                    after: false,
                },
            ],
            [
                {
                    title: "task 1",
                    startDate: new Date(input[0].startDate.getTime() + (input[0].endDate.getTime() - input[0].startDate.getTime()) / 2),
                    endDate: input[0].endDate,
                    color: "A",
                    subtasks: [],
                    before: false,
                    after: false,
                },
            ]
        ]

        const output = splitTasks(input, n)

        expect(output).toEqual(answer)
    })
    test('task and subtask split', () => {
        const n = 2
        const input = [
            {
                title: "task 1",
                startDate: new Date("1/1/2001"),
                endDate: new Date("1/1/2002"),
                color: "A",
                subtasks: [
                    {
                        title: "subtask 2",
                        startDate: new Date("3/1/2001"),
                        endDate: new Date("9/1/2001"),
                    }
                ]
            },
        ]

        const midDate = new Date(input[0].startDate.getTime() + (input[0].endDate.getTime() - input[0].startDate.getTime()) / 2)

        const answer = [
            [
                {
                    title: "task 1",
                    startDate: input[0].startDate,
                    endDate: midDate,
                    color: "A",
                    before: false,
                    after: false,
                    subtasks: [{
                        title: input[0].subtasks[0].title,
                        startDate: input[0].subtasks[0].startDate,
                        endDate: midDate,
                        before: false,
                        after: false,
                    }]
                },
            ],
            [
                {
                    title: "task 1",
                    startDate: midDate,
                    endDate: input[0].endDate,
                    color: "A",
                    before: false,
                    after: false,
                    subtasks: [{
                        title: input[0].subtasks[0].title,
                        startDate: midDate,
                        endDate: input[0].subtasks[0].endDate,
                        before: false,
                        after: false,
                    }]
                },
            ]
        ]

        const output = splitTasks(input, n)

        expect(output).toEqual(answer)
    })
})
