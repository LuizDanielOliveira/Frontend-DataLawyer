<template>
  <div class="task-list-container">
    <h2>Lista de Tarefas</h2>
    <table>
      <thead>
        <tr>
          <th>Título</th>
          <th>Descrição</th>
          <th>Status</th>
          <th>Tempo</th>
          <th>Data de Criação</th>
          <th>Renovações</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="task in tasks"
          :key="task.id"
          :class="{
            'expired-task': isExpired(task),
            'concluida-task': task.status === 'Concluída'
          }"
        >
          <td>{{ task.title }}</td>
          <td>{{ task.description }}</td>
          <td>{{ task.status }}</td>

          <!-- Exibir tempo. Se Concluída, mostra "Levou X tempo", caso contrário countdown etc. -->
          <td>
            <span v-if="task.status === 'Concluída'">
              {{ tempoParaConcluir(task) }}
            </span>
            <span v-else>
              {{ formatCountdown(task) }}
            </span>
          </td>

          <td>{{ formatDate(task.createdAt) }}</td>
          <td>{{ task.renewCount || 0 }}</td>
          <td class="action-cell">
            <button class="btn info" @click="onEdit(task)">Editar</button>
            <button class="btn danger" @click="onDelete(task.id)">Excluir</button>
            <button class="btn warning" @click="onRenew(task.id)">Renovar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import api from '../services/api';
import { TaskItem } from '../models/TaskItem';

export default defineComponent({
  name: 'TaskList',
  emits: ['edit-task'],
  data() {
    return {
      tasks: [] as TaskItem[],
      timeNow: Date.now(),
    };
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await api.get<TaskItem[]>('/tasks');
        this.tasks = response.data;
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        alert('Falha ao buscar tarefas. Verifique se o backend está rodando.');
      }
    },
    onEdit(task: TaskItem) {
      this.$emit('edit-task', task);
    },
    async onDelete(id?: number) {
      if (!id) return;
      if (!confirm('Deseja realmente excluir esta tarefa?')) return;
      try {
        await api.delete(`/tasks/${id}`);
        this.fetchTasks();
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        alert('Falha ao excluir tarefa. Verifique se o backend está rodando.');
      }
    },
    async onRenew(id?: number) {
      if (!id) return;
      try {
        await api.put(`/tasks/${id}/renew`);
        alert('Timer renovado com sucesso!');
        this.fetchTasks();
      } catch (error) {
        console.error('Erro ao renovar timer:', error);
        alert('Falha ao renovar timer.');
      }
    },

    formatDate(dateStr?: string) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleString();
    },

    // Exemplo: se tiver countdown e timerHours
    formatCountdown(task: TaskItem): string {
      if (!task.timerStart || !task.timerHours) return '---';
      const startMs = new Date(task.timerStart).getTime();
      const endMs = startMs + task.timerHours * 3600000;
      let diffMs = endMs - this.timeNow;
      if (diffMs <= 0) return 'Expirado';
      const diffH = Math.floor(diffMs / 3600000);
      diffMs -= diffH * 3600000;
      const diffM = Math.floor(diffMs / 60000);
      return `${diffH}h ${diffM}m`;
    },

    // Marca tarefa como "expirada" se for a lógica do timer
    isExpired(task: TaskItem): boolean {
      if (!task.timerHours || !task.timerStart) return false;
      const startMs = new Date(task.timerStart).getTime();
      const endMs = startMs + task.timerHours * 3600000;
      return this.timeNow >= endMs && task.status !== 'Concluída';
    },

    // Cálculo de tempo para concluir
    // Diferença entre CompletedAt e CreatedAt, por exemplo
    tempoParaConcluir(task: TaskItem): string {
      if (!task.completedAt) return ''; // ou "Não concluída"
      const created = new Date(task.createdAt).getTime();
      const completed = new Date(task.completedAt).getTime();
      const diffMs = completed - created; // milissegundos
      if (diffMs < 0) return '0h';

      const diffH = Math.floor(diffMs / 3600000);
      const remainder = diffMs - diffH * 3600000;
      const diffM = Math.floor(remainder / 60000);

      return `Levou ${diffH}h ${diffM}m`;
    },
  },
  mounted() {
    this.fetchTasks();

    // Atualiza "timeNow" a cada minuto, se quiser countdown
    setInterval(() => {
      this.timeNow = Date.now();
    }, 60000);
  }
});
</script>

<style scoped>
.task-list-container {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 16px 20px;
  margin-bottom: 30px;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: #0066cc;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

th,
td {
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #0066cc;
  color: #fff;
  border: none;
}

tbody tr:nth-child(even) {
  background-color: #fafafa;
}

tbody tr:hover {
  background-color: #f5faff;
}

/* Para tarefas expiradas (exemplo anterior) */
.expired-task {
  background-color: #ffe5e5 !important;
}

/* Para tarefas concluídas: background verde bem claro */
.concluida-task {
  background-color: #e6ffe6 !important;
}

.action-cell {
  display: flex;
  gap: 6px;
}

.btn {
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.btn.info {
  background-color: #17a2b8;
  color: #fff;
}
.btn.info:hover {
  background-color: #138496;
}

.btn.danger {
  background-color: #dc3545;
  color: #fff;
}
.btn.danger:hover {
  background-color: #c82333;
}

.btn.warning {
  background-color: #ffc107;
  color: #333;
}
.btn.warning:hover {
  background-color: #e0a800;
}
</style>
