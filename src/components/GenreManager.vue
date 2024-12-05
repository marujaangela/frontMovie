<script setup lang="ts">
import { ref } from 'vue';
import { useMovieStore } from '@/stores/movieStore';

const store = useMovieStore();
const newGenreName = ref('');

const addGenre = () => {
  if (newGenreName.value.trim()) {
    store.addGenre({
      id: crypto.randomUUID(),
      name: newGenreName.value.trim()
    });
    newGenreName.value = '';
  }
};

const handleDeleteGenre = (genreId: string, genreName: string) => {
  if (confirm(`Are you sure you want to delete the genre "${genreName}"? This will remove it from all movies.`)) {
    store.removeGenre(genreId);
  }
};
</script>

<template>
  <div class="p-6 bg-[#020B34] rounded-lg shadow-lg">
    <h2 class="text-xl font-bold text-white mb-4">Manage Genres</h2>
    <div class="flex gap-4 mb-4">
      <input
        v-model="newGenreName"
        type="text"
        placeholder="New genre name..."
        class="flex-1 px-4 py-2 bg-[#020B34] border border-[#FF6B4A] rounded-md text-white"
      />
      <button
        @click="addGenre"
        class="px-4 py-2 bg-[#FF6B4A] text-white rounded-md hover:bg-opacity-90"
      >
        Add Genre
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <div
        v-for="genre in store.genres"
        :key="genre.id"
        class="flex items-center gap-2 px-3 py-1 bg-[#FF6B4A] text-white rounded-full"
      >
        {{ genre.name }}
        <button
          @click="handleDeleteGenre(genre.id, genre.name)"
          class="text-sm hover:text-red-200 ml-2"
          title="Delete genre"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>
