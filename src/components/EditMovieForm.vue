<script setup lang="ts">
import { ref } from 'vue';
import { useMovieStore } from '../stores/movieStore';
import type { Movie } from '../types/movie';

const props = defineProps<{
  movie: Movie
}>();

const emit = defineEmits(['close', 'save']);
const store = useMovieStore();

const title = ref(props.movie.title);
const releaseYear = ref(props.movie.releaseYear);
const imageUrl = ref(props.movie.imageUrl);
const description = ref(props.movie.description);
const selectedGenres = ref([...props.movie.genre]);

const saveMovie = () => {
  if (!title.value.trim() || !imageUrl.value.trim()) return;

  const updatedMovie: Movie = {
    ...props.movie,
    title: title.value.trim(),
    releaseYear: releaseYear.value,
    genre: selectedGenres.value,
    imageUrl: imageUrl.value.trim(),
    description: description.value.trim(),
  };

  store.updateMovie(updatedMovie);
  emit('save');
};
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal-content p-6" @click.stop>
      <h2 class="text-xl font-bold text-white mb-4">Edit Movie</h2>
      <form @submit.prevent="saveMovie" class="space-y-4">
        <div>
          <label class="block text-white mb-2">Title</label>
          <input
            v-model="title"
            type="text"
            required
            class="input-primary w-full"
          />
        </div>

        <div>
          <label class="block text-white mb-2">Release Year</label>
          <input
            v-model="releaseYear"
            type="number"
            required
            class="input-primary w-full"
          />
        </div>

        <div>
          <label class="block text-white mb-2">Image URL</label>
          <input
            v-model="imageUrl"
            type="url"
            required
            class="input-primary w-full"
          />
        </div>

        <div>
          <label class="block text-white mb-2">Description</label>
          <textarea
            v-model="description"
            rows="3"
            class="input-primary w-full"
          ></textarea>
        </div>

        <div>
          <label class="block text-white mb-2">Genres</label>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              v-for="genre in store.genres"
              :key="genre.id"
              @click="selectedGenres.includes(genre.name)
                ? selectedGenres = selectedGenres.filter(g => g !== genre.name)
                : selectedGenres.push(genre.name)"
              :class="[
                'px-3 py-1 rounded-full transition-colors',
                selectedGenres.includes(genre.name)
                  ? 'bg-[#FF6B4A] text-white'
                  : 'bg-[#020B34] border border-[#FF6B4A] text-white'
              ]"
            >
              {{ genre.name }}
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-4 pt-4">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-white hover:text-[#FF6B4A] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
