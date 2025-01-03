<template>
  <nav class="navbar">
    <!-- Exemplo de imagem via data: { logo } -->
    <img
      :src="logo"
      alt="Logo"
      class="navbar-logo"
    />
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import logo from '../assets/logo.png';

export default defineComponent({
  name: 'Navbar',
  data() {
    return {
      logo
    };
  }
});
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  background-color:rgb(255, 255, 255);
  border-bottom: 1px solid #ddd;
   justify-content: center;
    align-items: center;
  padding: 0.5rem 1rem;
}

.navbar-logo {
  height: 80px;
  display: block; 
  margin-right: 10px;
}
</style>
