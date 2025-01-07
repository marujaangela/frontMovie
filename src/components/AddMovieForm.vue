<script setup lang="ts">
import { ref } from 'vue';
import { useMovieStore } from '../stores/movieStore';
import type { Movie } from '../types/movie';

// Emits-Ereignis, um das Formular zu schließen
const emit = defineEmits(['close']);
const store = useMovieStore(); // Zugriff auf den Store

// Felder für den Film
const title = ref('');
const releaseYear = ref<number>(new Date().getFullYear());
const imageUrl = ref('');
const description = ref('');
const selectedGenres = ref<string[]>([]);

// Funktion: Film hinzufügen
const addMovie = () => {
  if (!title.value.trim() || !imageUrl.value.trim()) return; // Validierung

  const movie: Movie = {
    id: crypto.randomUUID(), // Einzigartige ID generieren
    title: title.value.trim(),
    releaseYear: releaseYear.value,
    genre: selectedGenres.value,
    imageUrl: imageUrl.value.trim(),
    description: description.value.trim(),
    watched: false, // Standardmäßig als "ungesehen" setzen
  };

  store.addMovie(movie); // Film zum Store hinzufügen
  emit('close'); // Formular schließen
};
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal-content p-6" @click.stop>
      <h2 class="text-xl font-bold text-white mb-4">Add New Movie</h2>
      <form @submit.prevent="addMovie" class="space-y-4">
        <!-- Eingabefelder für den Film -->
        <div>
          <label class="block text-white mb-2">Title</label>
          <input v-model="title" type="text" required class="input-primary w-full" />
        </div>

        <div>
          <label class="block text-white mb-2">Release Year</label>
          <input v-model="releaseYear" type="number" required class="input-primary w-full" />
        </div>

        <div>
          <label class="block text-white mb-2">Image URL</label>
          <input v-model="imageUrl" type="url" required class="input-primary w-full" />
        </div>

        <div>
          <label class="block text-white mb-2">Description</label>
          <textarea v-model="description" rows="3" class="input-primary w-full"></textarea>
        </div>

        <div>
          <label class="block text-white mb-2">Categories</label>
          <div class="flex flex-wrap gap-2">
            <!-- Genres auswählen -->
            <button
              type="button"
              v-for="genre in store.genres"
              :key="genre.id"
              @click="selectedGenres.includes(genre.id)
                ? selectedGenres = selectedGenres.filter(g => g !== genre.id)
                : selectedGenres.push(genre.id)"
              :class="[
                'px-3 py-1 rounded-full transition-colors',
                selectedGenres.includes(genre.id)
                  ? 'bg-[#FF6B4A] text-white'
                  : 'bg-[#020B34] border border-[#FF6B4A] text-white'
              ]"
            >
              {{ genre.name }}
            </button>
          </div>
        </div>

        <!-- Buttons für Abbrechen oder Hinzufügen -->
        <div class="flex justify-end gap-4 pt-4">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-white hover:text-[#FF6B4A] transition-colors"
          >
            Cancel
          </button>
          <button type="submit" class="btn-primary">
            Add Movie
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
