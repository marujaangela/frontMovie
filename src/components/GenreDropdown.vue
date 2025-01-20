<script setup lang="ts">
import { ref } from 'vue';
import { useMovieStore } from '../stores/movieStore';
import GenreManager from './GenreManager.vue';

const store = useMovieStore();
const isEditMode = ref(false);
const isOpen = ref(false);

const selectGenre = (genreId: number | null) => {
  store.setSelectedGenre = genreId;
  isOpen.value = false;
};

const clearGenreFilter = () => {
  store.setSelectedGenre = null;
  isOpen.value = false;
};
</script>

<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      :class="[
        'px-4 py-2 rounded-full transition-colors',
        store.setSelectedGenre
          ? 'bg-[#FF6B4A] text-white'
          : 'border border-[#FF6B4A] text-[#FF6B4A] hover:bg-[#FF6B4A] hover:text-white'
      ]"
    >
      {{ store.setSelectedGenre !== null
      ? store.genres.find((g) => g.id === store.setSelectedGenre)?.name || 'Unknown Genre'
      : 'Genre Filter' }}
    </button>

    <div v-if="isOpen"
         class="absolute top-full right-0 mt-2 w-64 bg-[#020B34] border border-[#FF6B4A]/20 rounded-lg shadow-xl p-4 z-50">
      <div class="space-y-2">
        <button
          @click="clearGenreFilter"
          class="w-full text-left px-3 py-2 text-white hover:bg-[#FF6B4A]/10 rounded-md transition-colors"
        >
          All Genres
        </button>
        <button
          v-for="genre in store.genres"
          :key="genre.id"
          @click="selectGenre(genre.id ?? null)"
          class="w-full text-left px-3 py-2 text-white hover:bg-[#FF6B4A]/10 rounded-md transition-colors"
        >
          {{ genre.name }}
        </button>
      </div>

      <div class="mt-4 pt-4 border-t border-[#FF6B4A]/20">
        <button
          @click="isEditMode = !isEditMode"
          class="text-[#FF6B4A] text-sm hover:text-white transition-colors"
        >
          {{ isEditMode ? 'Done Editing' : 'Manage Genres' }}
        </button>

        <GenreManager v-if="isEditMode" class="mt-4" />
      </div>
    </div>
  </div>
</template>
