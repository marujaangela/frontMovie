<script setup lang="ts">
import { ref } from 'vue';
import AddMovieForm from './AddMovieForm.vue';

// Zustand: Ob das Formular sichtbar ist
const isFormVisible = ref(false);

// Funktion: Sichtbarkeit des Formulars umschalten
const toggleForm = () => {
  isFormVisible.value = !isFormVisible.value;
};
</script>

<template>
  <div class="relative">
    <!-- Button zum Hinzufügen von Filmen -->
    <button
      @click="toggleForm"
      class="px-4 py-2 bg-[#FF6B4A] text-white rounded-full hover:bg-opacity-90 transition-colors flex items-center gap-2"
    >
      <span class="material-icons text-xl">+</span>
      Add Movie
    </button>

    <!-- Zeigt das AddMovieForm an, wenn isFormVisible true ist -->
    <div v-if="isFormVisible" class="absolute right-0 mt-2 w-96 z-50">
      <AddMovieForm @close="toggleForm" />
    </div>
  </div>
</template>
