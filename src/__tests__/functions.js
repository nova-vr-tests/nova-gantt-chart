import { orderTasks } from '../functions';

test('orders tasks', () => {
    const week = weeks => {
        const initDate = () => new Date('1/1/2017');
        return new Date(new Date(initDate()).setDate(initDate().getDate() + 7 * weeks));
    }

    const tasks1 = [
      {
        title: "hardware install",
        startDate: week(2),
        endDate: week(3),
        color: '#65b766',
        subtasks: [
        ]
      },
      {
        title: "needs analysis",
        startDate: week(0),
        endDate: week(4),
        color: '#59af92',
        subtasks: [
        ]
      },
    ];

    const tasks1_answer = [
      {
        title: "needs analysis",
        startDate: week(0),
        endDate: week(4),
        color: '#59af92',
        subtasks: [
        ]
      },
      {
        title: "hardware install",
        startDate: week(2),
        endDate: week(3),
        color: '#65b766',
        subtasks: [
        ]
      },
    ];

    expect(JSON.stringify(orderTasks(tasks1))).toBe(JSON.stringify(tasks1_answer));

    const tasks2 = [
      {
        title: "Design spec",
        startDate: week(3),
        endDate: week(15),
        color: '#5888B3',
        subtasks: [
          {
            title: "Script",
            startDate: week(4),
            endDate: week(7),
          }, 
          {
            title: "Graphic charters",
            startDate: week(3),
            endDate: week(11),
          },
        ]
      },
      {
        title: "BGRS tour",
        startDate: week(1),
        endDate: week(4),
        color: '#59A4AF',
        subtasks: []
      },
    ];

    const tasks2_answer = [
      {
        title: "BGRS tour",
        startDate: week(1),
        endDate: week(4),
        color: '#59A4AF',
        subtasks: []
      },
      {
        title: "Design spec",
        startDate: week(3),
        endDate: week(11),
        color: '#5888B3',
        subtasks: [
          {
            title: "Graphic charters",
            startDate: week(3),
            endDate: week(11),
          },
          {
            title: "Script",
            startDate: week(4),
            endDate: week(7),
          }, 
        ]
      },
    ];

    expect(JSON.stringify(orderTasks(tasks2))).toBe(JSON.stringify(tasks2_answer));

    const tasks3 = [
      {
        title: "Training",
        startDate: week(2),
        endDate: week(14),
        color: '#6b71b4',
        subtasks: [
          {
            title: 'Getting started',
            startDate: week(2),
            endDate: week(4),
          },
          {
            title: 'Hardware',
            startDate: week(4),
            endDate: week(7),
          },
          {
            title: 'Software',
            startDate: week(7),
            endDate: week(10),
          },
          {
            title: 'Theory',
            startDate: week(10),
            endDate: week(13),
          },
          {
            title: 'Lab',
            startDate: week(13),
            endDate: week(14),
          },
        ]
      },
    ];
    expect(1 + 2).toBe(3);
});