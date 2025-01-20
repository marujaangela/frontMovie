<script setup lang="ts">
import { ref } from 'vue';
import { useMovieStore } from '../stores/movieStore';
import type { Movie } from '../types/movie';
import { EyeIcon, EyeSlashIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import EditMovieForm from './EditMovieForm.vue';

const props = defineProps<{
  movie: Movie
}>();

const store = useMovieStore();
const isHovered = ref(false);
const isEditing = ref(false);

const handleDelete = () => {
  if (props.movie.id === undefined) {
    console.error("Movie ID is undefined. Cannot delete the movie.");
    return;
  }

  if (confirm(`Are you sure you want to delete the movie "${props.movie.title}"?`)) {
    store.removeMovie(props.movie.id);
  }
};

</script>

<template>
  <div
    class="relative group cursor-pointer"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <img
      :src="movie.imageUrl"
      :alt="movie.title"
      class="w-full aspect-[2/3] rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
    />

    <div
      v-show="isHovered"
      class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-md transition-opacity duration-300"
    >
      <div class="absolute bottom-0 p-4 w-full">
        <h3 class="text-lg font-bold text-white mb-1">{{ movie.title }}</h3>
        <p class="text-sm text-gray-300 mb-3">{{ movie.releaseYear }}</p>

        <div class="flex justify-between items-center">
          <button
            @click.stop="movie.id !== undefined && store.toggleWatched(movie.id)"
            class="text-white hover:text-[#FF6B4A] transition-colors"
            :title="movie.watched ? 'Mark as unwatched' : 'Mark as watched'"
          >
            <component :is="movie.watched ? EyeIcon : EyeSlashIcon" class="h-6 w-6" />
          </button>

          <button
            @click.stop="isEditing = true"
            class="text-white hover:text-[#FF6B4A] transition-colors"
            title="Edit movie"
          >
            <PencilIcon class="h-6 w-6" />
          </button>

          <button
            @click.stop="handleDelete"
            class="text-white hover:text-[#FF6B4A] transition-colors"
            title="Delete movie"
          >
            <TrashIcon class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <EditMovieForm
      v-if="isEditing"
      :movie="movie"
      @close="isEditing = false"
      @save="isEditing = false"
    />
  </div>
</template>
