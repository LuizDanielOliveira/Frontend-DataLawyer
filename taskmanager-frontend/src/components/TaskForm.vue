<template>
  <div class="task-form-container">
    <h2>{{ isEditMode ? 'Editar Tarefa' : 'Nova Tarefa' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Título</label>
        <input
          type="text"
          id="title"
          v-model="taskData.title"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Descrição</label>
        <textarea
          id="description"
          v-model="taskData.description"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="taskData.status">
          <option value="Pendente">Pendente</option>
          <option value="Em Progresso">Em Progresso</option>
          <option value="Concluída">Concluída</option>
        </select>
      </div>

      <!-- Campo para horas do timer (aceita qualquer valor, incluindo < 3) -->
      <div class="form-group">
        <label for="timerHours">Timer (horas)</label>
        <input
          type="number"
          id="timerHours"
          v-model.number="taskData.timerHours"
          min="0"
        />
      </div>

      <div class="buttons">
        <button type="submit" class="btn primary">
          {{ isEditMode ? 'Atualizar' : 'Criar' }}
        </button>
        <button type="button" class="btn secondary" @click="clearForm">
          Limpar
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import api from '../services/api';
import { TaskItem } from '../models/TaskItem';

export default defineComponent({
  name: 'TaskForm',
  props: {
    taskToEdit: {
      type: Object as PropType<TaskItem | null>,
      default: null,
    },
  },
  emits: ['refresh-list'],
  data() {
    return {
      isEditMode: false,
      taskData: {
        title: '',
        description: '',
        status: 'Pendente',
        timerHours: 0,
      } as TaskItem,
    };
  },
  watch: {
    taskToEdit: {
      immediate: true,
      handler(newVal: TaskItem | null) {
        if (newVal) {
          this.isEditMode = true;
          this.taskData = { ...newVal };
        } else {
          this.isEditMode = false;
          this.clearForm();
        }
      },
    },
  },
  methods: {
    clearForm() {
      this.isEditMode = false;
      this.taskData = {
        title: '',
        description: '',
        status: 'Pendente',
        timerHours: 0,
      };
    },

    async handleSubmit() {
      try {
        if (this.isEditMode && this.taskData.id) {
          // PUT: atualizar tarefa
          await api.put(`/tasks/${this.taskData.id}`, this.taskData);
          alert('Tarefa atualizada com sucesso!');
        } else {
          // POST: criar nova tarefa
          // -> TimerStart em UTC (com 'Z')
          const nowUtcIso = new Date().toISOString();

          const newTask = {
            ...this.taskData,
            timerStart: nowUtcIso
          };

          await api.post('/tasks', newTask);
          alert('Tarefa criada com sucesso!');
        }

        this.$emit('refresh-list');
        this.clearForm();
      } catch (error) {
        console.error('Erro ao enviar tarefa:', error);
        alert('Falha ao enviar tarefa. Verifique se o backend está rodando e se o modelo está correto.');
      }
    },
  },
});
</script>

<style scoped>
.task-form-container {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 16px 20px;
  margin-bottom: 30px;
  background: #fefefe;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.4rem;
  color: #0066cc;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.form-group input[type="text"],
.form-group textarea,
.form-group select,
.form-group input[type="number"] {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  font-size: 0.95rem;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn.primary {
  background-color: #0066cc;
  color: #fff;
}

.btn.primary:hover {
  background-color: #005bb5;
}

.btn.secondary {
  background-color: #f2f2f2;
  color: #333;
}

.btn.secondary:hover {
  background-color: #e2e2e2;
}
</style>
