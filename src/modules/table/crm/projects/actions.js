import TableActions from '@/modules/table/base/actions'
import Api from '@/api'

export default TableActions({
  CREATE_TASK_LIST({ commit }, { uuid, data }) {
    return Api.post(`crm/projects/${uuid}/task-lists`, {
      'task-list': data
    }).then((newTaskList) => {
      commit('ADD_TASK_LIST', { uuid, newTaskList })
      return newTaskList
    })
  },

  UPDATE_TASK_LIST({ commit }, { uuid, taskListUuid, data }) {
    return Api.put(`crm/projects/${uuid}/task-lists/${taskListUuid}`, {
      'task-list': data
    }).then((updatedTaskList) => {
      commit('UPDATE_TASK_LIST', { uuid, updatedTaskList })
      return updatedTaskList
    })
  },

  CREATE_TASK({ commit }, { uuid, taskListUuid, data }) {
    return Api.post(`crm/projects/${uuid}/task-lists/${taskListUuid}/tasks`, {
      'task': data
    }).then((newTask) => {
      commit('ADD_TASK', { uuid, taskListUuid, newTask })
      return newTask
    })
  },

  UPDATE_TASK({ commit }, { uuid, taskListUuid, taskUuid, data }) {
    return Api.put(`crm/projects/${uuid}/task-lists/${taskListUuid}/tasks/${taskUuid}`, {
      'task': data
    }).then((updatedTask) => {
      commit('INSERT_TASK', { uuid, taskListUuid, updatedTask })
      return updatedTask
    })
  }
})
