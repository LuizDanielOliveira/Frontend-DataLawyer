<template>
  <!-- Navbar no topo -->
  <Navbar />

  <div id="app">
    <h1>Gerenciador de Tarefas Data Lawyer</h1>

    <TaskForm
      :taskToEdit="taskBeingEdited"
      @refresh-list="refreshTaskList"
    />

    <TaskList
      ref="taskListRef"
      @edit-task="onEditTask"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import Navbar from './components/Navbar.vue';
import TaskForm from './components/TaskForm.vue';
import TaskList from './components/TaskList.vue';
import { TaskItem } from './models/TaskItem';

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
    TaskForm,
    TaskList
  },
  setup() {
    const taskListRef = ref<InstanceType<typeof TaskList> | null>(null);
    const taskBeingEdited = ref<TaskItem | null>(null);

    function onEditTask(task: TaskItem) {
      taskBeingEdited.value = { ...task };
    }

    function refreshTaskList() {
      if (taskListRef.value) {
        taskListRef.value.fetchTasks();
      }
      taskBeingEdited.value = null;
    }

    return {
      taskListRef,
      taskBeingEdited,
      onEditTask,
      refreshTaskList
    };
  }
});
</script>

<style scoped>
#app {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  color: #0066cc;
  letter-spacing: 1px;
}
</style>
