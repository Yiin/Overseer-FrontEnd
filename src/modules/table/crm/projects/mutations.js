import TableMutations from '@/modules/table/base/mutations'

export default TableMutations({
  ADD_TASK_LIST(state, { uuid, newTaskList }) {
    const project = state.items.find((project) => project.uuid === uuid)

    if (project) {
      if (!project.taskLists.find((tl) => tl.uuid === newTaskList.uuid)) {
        project.taskLists.push(newTaskList)
      }
    }
  },

  UPDATE_TASK_LIST(state, { uuid, updatedTaskList }) {
    const project = state.items.find((project) => project.uuid === uuid)

    if (project) {
      const taskList = project.taskLists.find((taskList) => taskList.uuid === updatedTaskList.uuid)

      if (taskList) {
        for (let key in updatedTaskList) {
          taskList[key] = updatedTaskList[key]
        }
      }
    }
  },

  ADD_TASK(state, { uuid, taskListUuid, newTask }) {
    const project = state.items.find((project) => project.uuid === uuid)

    if (project) {
      const taskList = project.taskLists.find((taskList) => taskList.uuid === taskListUuid)

      if (taskList) {
        const task = taskList.tasks.find((task) => task.uuid === newTask.uuid)

        if (!task) {
          taskList.tasks.push(newTask)
        }
      }
    }
  },

  UPDATE_TASK(state, { uuid, taskListUuid, updatedTask }) {
    const project = state.items.find((project) => project.uuid === uuid)

    if (project) {
      const taskList = project.taskLists.find((taskList) => taskList.uuid === taskListUuid)

      if (taskList) {
        const task = taskList.tasks.find((task) => task.uuid === updatedTask.uuid)

        if (task) {
          for (let key in updatedTask) {
            task[key] = updatedTask[key]
          }
        }
      }
    }
  }

})
