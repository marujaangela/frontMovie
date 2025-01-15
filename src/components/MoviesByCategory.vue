<script setup lang="ts">
import { computed } from 'vue';
import { useMovieStore } from '../stores/movieStore';
import MovieCard from './MovieCard.vue';
import MovieRecommendation from './MovieRecommendation.vue';

const store = useMovieStore();

const moviesByGenre = computed(() => {
  const grouped: Record<string, any[]> = {};
  store.genres.forEach(genre => {
    grouped[genre.name] = store.movies.filter(movie =>
      movie.genre.includes(genre.name)
    );
  });
  return grouped;
});
</script>

<template>
  <div class="space-y-8">
    <MovieRecommendation
      v-if="store.recommendedMovie"
      :movie="store.recommendedMovie"
      @close="store.recommendedMovie = null"
    />

    <div v-for="genre in store.genres" :key="genre.id" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-white">{{ genre.name }}</h2>
        <button
          @click="store.generateRecommendation(genre.id)"
          class="px-4 py-2 bg-[#FF6B4A] text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          Get Recommendation
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <MovieCard
          v-for="movie in moviesByGenre[genre.id]"
          :key="movie.id"
          :movie="movie"
        />
      </div>
    </div>
  </div>
</template>
