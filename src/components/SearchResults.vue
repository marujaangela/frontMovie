<script setup lang="ts">
import { computed } from 'vue';
import MovieCard from './MovieCard.vue';
import {useMovieStore} from "../stores/movieStore.ts";

const store = useMovieStore();

const matchingMovies = computed(() => {
  if (!store.searchQuery) return [];
  const query = store.searchQuery.toLowerCase();
  return store.movies.filter(movie =>
    movie.title.toLowerCase().includes(query)
  );
});

const matchingGenres = computed(() => {
  if (!store.searchQuery) return [];
  const query = store.searchQuery.toLowerCase();
  return store.genres.filter(genre =>
    genre.name.toLowerCase().includes(query)
  );
});

const moviesByMatchingGenre = computed(() => {
  const results: Record<string, any[]> = {};
  matchingGenres.value.forEach(genre => {
    const movies = store.movies.filter(movie =>
      movie.genre.includes(genre.name)
    );
    if (movies.length > 0) {
      results[genre.name] = movies;
    }
  });
  return results;
});
</script>

<template>
  <div v-if="store.searchQuery" class="space-y-8">
    <!-- Direct movie matches -->
    <div v-if="matchingMovies.length > 0" class="space-y-4">
      <h2 class="text-xl font-bold text-white">Matching Movies</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <MovieCard
          v-for="movie in matchingMovies"
          :key="movie.id"
          :movie="movie"
        />
      </div>
    </div>

    <!-- Genre matches -->
    <div v-if="Object.keys(moviesByMatchingGenre).length > 0" class="space-y-8">
      <div v-for="(movies, genreId) in moviesByMatchingGenre" :key="genreId" class="space-y-4">
        <h2 class="text-xl font-bold text-white">
          {{ store.genres.find(g => g.name === genreId)?.name }}
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
          />
        </div>
      </div>
    </div>

    <!-- No results -->
    <div v-if="matchingMovies.length === 0 && Object.keys(moviesByMatchingGenre).length === 0" class="text-center py-8">
      <p class="text-gray-400">No movies or genres found matching "{{ store.searchQuery }}"</p>
    </div>
  </div>
</template>
