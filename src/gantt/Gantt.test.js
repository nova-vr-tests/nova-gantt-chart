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
