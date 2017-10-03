<template>
  <div class="table-row-details">
    <tabs>
      <tab title="Overview">

        <div class="row">
          <button @click="createNewTaskList()" class="button button--task">
            Add New Task List
          </button>
        </div>
        <div class="list">
          <!--
            Create New Task List
           -->
          <div v-if="creatingNewTaskList" class="list__item">
            <div class="list-item__column">
              <button @click="toggleColorPicker()"
                      :style="{ 'background-color': newTaskList.color }"
                      class="button button__toggle"
              ></button>

              <template v-if="showColorPicker">
                <button v-for="color in taskListColors.reduce((a, b) => a.concat(b), [])"
                     @click="selectColor(color)"
                     :style="{ 'background-color': color }"
                     class="button button__toggle"
                ></button>
              </template>
            </div>
            <div class="list-item__column" :style="{ 'border-color': newTaskList.color }">
              <div class="task-list task-list--new">
                <div class="task-list__title">
                  <input
                    ref="newTaskListNameInput"
                    type="text"
                    name="task-list_name"
                    class="form__input form__input--tiny form__input--inline"
                    v-model="newTaskList.name"
                    placeholder="Enter Name"
                  >
                </div>
                <div class="task-list__controls">
                  <button @click="saveTaskList()" class="button button--tiny">Add Task List</button>
                </div>
              </div>
            </div>
          </div>
          <!--
            List of Task Lists
           -->
          <div v-for="taskList in taskLists" class="list__item">
            <div class="list-item__column">
              <button @click="toggleTaskList(taskList)"
                      :style="{ 'background-color': taskList.color }"
                      class="button button__toggle button__toggle--down"
              >
                <i :class="{
                    'icon-down': !taskList.__isOpen,
                    'icon-up': taskList.__isOpen
                  }"></i>
              </button>
            </div>
            <div class="list-item__column" :style="{ 'border-color': taskList.color }">
              <div class="task-list__title">
                {{ taskList.name }}
              </div>
              <template v-if="taskList.__isOpen">
                <div class="task-list__tasks">
                  <div
                    v-for="task in openOrRecentlyCompletedTasks(taskList)"
                    @click="toggleTaskStatus(task)"
                    class="task" :class="{ 'task--completed': task.is_completed }"
                  >
                    <div class="task__date">
                      {{ task.created_at | date }}
                    </div>
                    <div class="task__creator">
                      {{ task.user.full_name }}
                    </div>
                    <div class="task__title">
                      {{ task.name }}
                    </div>
                  </div>
                </div>
                <div class="tasks-control">
                  <!--
                    Create New Task
                   -->
                  <template v-if="creatingNewTaskIn === taskList">
                    <input ref="newTaskNameInput" v-model="newTask.name" placeholder="Enter Task" type="text" class="form__input form__input--tiny form__input--inline">
                    <button @click="saveTask(taskList)" class="button button--tiny">Save New Task</button>
                    <span class="cancel" @click="creatingNewTaskIn = undefined">Cancel</span>
                  </template>
                  <div v-else @click="createNewTask(taskList)" class="button button--tiny">
                    Add New Task
                  </div>
                  <span @click="showCompletedTasks(taskList)" class="completed-tasks-label">
                    {{ taskList.tasks.filter((task) => task.is_completed).length }} Task(s) Completed
                  </span>
                </div>
                <div v-if="showingCompletedTasksFor === taskList && completedTasks(taskList).length" class="completed-tasks">
                  Completed tasks
                  <div v-for="task in completedTasks(taskList)" class="task--completed completed-task">
                    <div class="task__date">
                      {{ task.created_at | date }}
                    </div>
                    <div class="task__title">
                      {{ task.name }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

      </tab>
      <tab title="Milestones"></tab>
      <tab title="Tasks"></tab>
      <tab title="Messages"></tab>
    </tabs>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      required: true
    }
  },

  data() {
    return {
      // are we currently creating new task list?
      creatingNewTaskList: false,
      newTaskList: {
        name: '',
        color: null
      },
      openTaskLists: [],

      showColorPicker: false,
      currentColorGroupIndex: null,
      lastColorGroupIndex: null,

      // are we currently creating new task in task list?
      creatingNewTaskIn: undefined,
      newTask: {
        name: ''
      },
      recentlyCompletedTasks: [],
      showingCompletedTasksFor: undefined
    }
  },

  computed: {
    taskLists() {
      return this.project.taskLists.slice().reverse()
    },

    taskListColors() {
      return [
        [ '#1abc9c', '#2ecc71', '#16a085', '#27ae60' ],
        [ '#03A9F4', '#2196F3', '#3498db', '#2980b9', '#3F51B5' ],
        [ '#E91E63', '#9C27B0', '#673AB7', '#9b59b6', '#8e44ad' ],
        [ '#f1c40f', '#FF9800', '#f39c12', '#e67e22' ],
        [ '#d35400', '#FF5722', '#e74c3c', '#F44336', '#c0392b' ]
      ]
    },

    availableTaskListColors() {
      return this.taskListColors.filter((group, index) => index !== this.lastColorGroupIndex)
    }
  },

  methods: {
    /**
     * Open (or hide if already open) a menu for creating new Task List.
     * Additionally, we pick semi-random color from list of color groups.
     * Semi-random, because we ignore last picked color group, to avoid duplicates.
     */
    createNewTaskList() {
      this.creatingNewTaskList = !this.creatingNewTaskList

      if (this.creatingNewTaskList) {
        const availableColorGroupIndex = Math.floor(Math.random() * this.availableTaskListColors.length)
        this.currentColorGroupIndex = this.taskListColors.indexOf(this.availableTaskListColors[availableColorGroupIndex])

        const colorIndex = Math.floor(Math.random() * this.availableTaskListColors[availableColorGroupIndex].length)
        this.newTaskList.color = this.availableTaskListColors[availableColorGroupIndex][colorIndex]

        this.$nextTick(() => {
          this.$refs.newTaskListNameInput.focus()
        })
      }
    },

    toggleColorPicker() {
      this.showColorPicker = !this.showColorPicker
    },

    selectColor(color) {
      this.newTaskList.color = color
      this.showColorPicker = false
    },

    saveTaskList(taskList) {
      if (typeof taskList === 'undefined') {
        this.$store.dispatch('table/projects/CREATE_TASK_LIST', {
          uuid: this.project.uuid,
          data: this.newTaskList
        }).then(() => {
          this.creatingNewTaskList = false
          this.lastColorGroupIndex = this.currentColorGroupIndex
        })
        this.newTaskList.name = ''
      }
    },

    toggleTaskList(taskList) {
      this.$set(taskList, '__isOpen', !taskList.__isOpen)
    },

    openOrRecentlyCompletedTasks(taskList) {
      return taskList.tasks.filter((task) => {
        return !task.is_completed || this.recentlyCompletedTasks.indexOf(task) >= 0
      })
    },

    completedTasks(taskList) {
      return taskList.tasks.filter((task) => task.is_completed)
    },

    showCompletedTasks(taskList) {
      if (this.showingCompletedTasksFor === taskList) {
        this.showingCompletedTasksFor = undefined
      } else if (this.completedTasks(taskList).length) {
        this.showingCompletedTasksFor = taskList
      }
    },

    createNewTask(taskList) {
      this.creatingNewTaskIn = taskList

      this.$nextTick(() => {
        this.$refs.newTaskNameInput[0].focus()
      })
    },

    saveTask(taskList, task) {
      if (typeof task === 'undefined') {
        this.$store.dispatch('table/projects/CREATE_TASK', {
          uuid: this.project.uuid,
          taskListUuid: taskList.uuid,
          data: this.newTask
        }).then(() => {
          this.$nextTick(() => {
            this.creatingNewTaskIn = undefined
          })
        })
        this.newTask.name = ''
      }
    },

    toggleTaskStatus(task) {
      task.is_completed = !task.is_completed

      if (task.is_completed && this.recentlyCompletedTasks.indexOf(task) < 0) {
        this.recentlyCompletedTasks.push(task)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.task-list {
    display: flex;
    padding: 15px 0;
}

.task-list--new, .tasks-control {
  padding: 0;

  .form__input + .button {
    margin-left: 15px;
    &:focus {
      outline: none;
    }
  }
}

.button--tiny {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  padding: 0 10px;
}

.form__input--tiny {
  line-height: 26px;
  height: 30px;
  width: 250px;
}

.cancel {
  margin-left: 10px;
  cursor: pointer;
}

.task {
  display: flex;
  padding: 15px 0;
  border-top: 1px solid #e1e1e1;

  &--completed > .task__title {
    text-decoration: line-through;
  }
}

.task:last-child {
  border-bottom: 1px solid #e1e1e1;
  margin-bottom: 15px;
}

.tasks-control {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
}

.completed-tasks-label {
  line-height: 30px;
  margin-left: 20px;
  font-size: 14px;
  color: $color-main;
  cursor: pointer;
}

.completed-task {
  display: flex;
  font-size: 14px;
}

.task__date {
    font-weight: 400;
    color: #909090;
    margin-right: 15px;
}

.task__creator {
    color: $color-main;
    margin-right: 15px;
}

.task__title {
    font-weight: normal;
}
</style>