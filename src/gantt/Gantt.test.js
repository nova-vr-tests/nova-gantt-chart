require('canvas')
import React from 'react'
import Gantt from './Gantt.js'

const initProps = {
    constants: {},
    tasks: [{}],
}

const ganttFactory = (mockKeys, props = initProps) => {
    const gantt = new Gantt(props)

    for(let key in mockKeys) {
        gantt[mockKeys[key]] = jest.fn()
    }

    return gantt
}

const initGlobalMocks = () => {
      document.createRange = jest.fn()
}

describe('componentDidMount', () => {
  beforeEach(() => {
      initGlobalMocks()
  })

  test('calls setupCanvas properly', () => {
      const gantt = ganttFactory(['setupCanvas'])
      gantt.componentDidMount()

      expect(gantt.setupCanvas.mock.calls).toEqual([[]])
  })
})

describe('ComponentWillReceiveProps', () => {
  beforeEach(() => {
      document.createRange = jest.fn()
  })

  test('calls setState with the correct params', () => {
      const gantt = ganttFactory(['setState', 'drawGanttChart'])
      gantt.componentWillReceiveProps()

      expect(gantt.setState.mock.calls).toEqual([[{ tasks: gantt.props.tasks }]])
      expect(gantt.drawGanttChart.mock.calls).toEqual([[]])
  })
})

describe('updateConstants', () => {
  beforeEach(() => {
      document.createRange = jest.fn()
  })

  test('base dimensions takes props into account', () => {
      const props = {
          ...initProps,
          constants: {
              BASE_HEIGHT: 100,
              BASE_WIDTH: 200,
          }
      }
      const gantt = ganttFactory([], props)
      gantt.updateConstants()

      expect(gantt.constants.BASE_HEIGHT).toEqual(props.constants.BASE_HEIGHT)
      expect(gantt.constants.BASE_WIDTH).toEqual(props.constants.BASE_WIDTH)

      const gantt2 = ganttFactory([])
      gantt.updateConstants()

      expect(gantt2.constants.BASE_HEIGHT).toEqual(19)
      expect(gantt2.constants.BASE_WIDTH).toEqual(10)
  })

  test('arrow dimensions', () => {
      const props = {
          ...initProps,
          constants: {
              BASE_HEIGHT: 100,
              BASE_WIDTH: 200,
          }
      }
      const gantt = ganttFactory([], props)
      gantt.updateConstants()

      expect(gantt.constants.TASK_ARROW_HEIGHT).toEqual(1.5 * props.constants.BASE_HEIGHT)
      expect(gantt.constants.SUBTASK_ARROW_HEIGHT).toEqual(1 * props.constants.BASE_HEIGHT)
      expect(gantt.constants.CALENDAR_ARROW_HEIGHT).toEqual(2 * props.constants.BASE_HEIGHT)
      expect(gantt.constants.TASK_TITLE_START).toEqual(20)
      expect(gantt.constants.SUBTASK_TITLE_START).toEqual(40)
      expect(gantt.constants.DATE_GRADUATION_START).toEqual(250)
      expect(gantt.constants.TASK_ARROW_POINT_DIAMETER).toEqual(0.4 * props.constants.BASE_HEIGHT)
      expect(gantt.constants.CALENDAR_ARROW_POINT_DIAMETER).toEqual(0.75 * gantt.constants.TASK_ARROW_POINT_DIAMETER)
      expect(gantt.constants.CALENDAR_GRADUATION_START).toEqual(10)
      expect(gantt.constants.SUBTASK_COLOR_OPACITY).toEqual(0.6)
  })

  test('colors', () => {
      const gantt = ganttFactory([])
      gantt.updateConstants()

      expect(gantt.constants.CALENDAR_BG_COLOR).toEqual('#CCCABC')
      expect(gantt.constants.CALENDAR_TEXT_COLOR).toEqual('#999999')
  })

  test('spaces between tasks', () => {
      const gantt = ganttFactory([])
      gantt.updateConstants()

      expect(gantt.constants.TASK_INTERLINE).toEqual(gantt.constants.BASE_HEIGHT)
      expect(gantt.constants.SUBTASK_INTERLINE).toEqual(0.5 * gantt.constants.BASE_HEIGHT)
  })

  test('fonts', () => {
      const gantt = ganttFactory([])
      gantt.updateConstants()

      expect(gantt.constants.TASK_FONT_SIZE).toEqual(9)
      expect(gantt.constants.SUBTASK_FONT_SIZE).toEqual(7)
      expect(gantt.constants.CALENDAR_GRADUATION_FONT_SIZE).toEqual(10)
      expect(gantt.constants.FONT_FAMILY).toEqual('Courier New')
      expect(gantt.constants.FONT_STROKE_WIDTH).toEqual(0.4)
  })

  test('title offsets', () => {
      const gantt = ganttFactory([])
      gantt.updateConstants()

      expect(gantt.constants.TASK_TITLE_START_OFFSET).toEqual({
          x: gantt.constants.TASK_ARROW_HEIGHT / 0.75,
          y: gantt.constants.TASK_FONT_SIZE / 2.5,
      })

      expect(gantt.constants.SUBTASK_TITLE_START_OFFSET).toEqual({
          x: gantt.constants.SUBTASK_ARROW_HEIGHT / 0.75,
          y: gantt.constants.SUBTASK_FONT_SIZE / 2.5,
      })
  })

  test('line type', () => {
      const gantt = ganttFactory([])
      gantt.updateConstants()

      expect(gantt.constants.TASK).toEqual(0)
      expect(gantt.constants.SUBTASK).toEqual(1)
      expect(gantt.constants.CALENDAR).toEqual(2)
  })

  test('Date constants', () => {
      const props = {
          ...initProps,
          tasks: [{
              startDate: 1111111111111, // 2005/03/10
          }],
      }
      const gantt = ganttFactory([], props)
      gantt.updateConstants()

      expect(gantt.constants.START_DATE).toEqual(new Date(props.tasks[0].startDate))
  })

  test('other constants', () => {
      const gantt = ganttFactory([])
      gantt.updateConstants()

      expect(gantt.constants.FIRST_TASK_Y).toEqual(50)
      expect(gantt.constants.TEXT_OPACITY).toEqual(0.5)
      expect(gantt.constants.TEXT_COLOR).toEqual('white')
      expect(gantt.constants.DATE_GRADUATION_Y_COORD).toEqual(gantt.constants.CALENDAR_ARROW_HEIGHT / 2 * 0.75)
      expect(gantt.constants.CALENDAR_POINTS_BEFORE_START).toEqual(10)
      expect(gantt.constants.CALENDAR_POINTS_AFTER_END).toEqual(0)
      expect(gantt.constants.CALENDAR_MONTH_MARK_HEIGHT).toEqual(8)
      expect(gantt.constants.CALENDAR_MONTH_FONT_SIZE).toEqual(12)
      expect(gantt.constants.CALENDAR_YEAR_FONT_SIZE).toEqual(18)

  })
})
