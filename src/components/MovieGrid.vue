<script setup lang="ts">
import { computed } from 'vue';
import { useMovieStore } from '../stores/movieStore';
import MovieCard from './MovieCard.vue';
import NoResults from './NoResults.vue';
import MovieRecommendation from './MovieRecommendation.vue';
import type { Movie } from '../types/movie';

const store = useMovieStore();

const props = defineProps<{
  movies: Movie[]
}>();

const groupedMovies = computed(() => {
  if (!store.setSelectedGenre) {
    return store.moviesByGenre;
  }

  const filtered: Record<string, Movie[]> = {};
  if (store.setSelectedGenre) {
    const genreMovies = props.movies.filter(movie =>
      movie.genre.includes(store.setSelectedGenre!)
    );
    if (genreMovies.length > 0) {
      filtered[store.setSelectedGenre] = genreMovies;
    }
  }
  return filtered;
});
</script>

<template>
  <div class="bg-[#01071F] min-h-screen p-6">
    <MovieRecommendation
      v-if="store.recommendedMovie"
      :movie="store.recommendedMovie"
      @close="store.recommendedMovie = null"
    />

    <div v-if="Object.keys(groupedMovies).length === 0">
      <NoResults />
    </div>

    <div v-else class="space-y-8">
      <div
        v-for="(movies, genreId) in groupedMovies"
        :key="genreId"
        class="space-y-4"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-white">
            {{ store.genres.find(g => g.name === genreId)?.name }}
          </h2>
          <button
            v-if="store.currentView !== 'watched'"
            @click="store.generateRecommendation(genreId)"
            class="px-4 py-2 bg-[#FF6B4A] text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Get Recommendation
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
          />
        </div>
      </div>
    </div>
  </div>
</template>
