import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import type { Movie, Genre } from "../types/movie.ts";

// API-Endpunkte
const apiEndpoint = import.meta.env.VITE_APP_BACKEND_BASE_URL;

export const useMovieStore = defineStore('movies', () => {
  // State
  const movies = ref<Movie[]>([]);
  const genres = ref<Genre[]>([]);
  const error = ref<string | null>(null);

  // Daten vom Backend laden
  const fetchMovies = async () => {
    try {
      const response = await axios.get<Movie[]>(`${apiEndpoint}/movies`);
      movies.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch movies';
      console.error(err);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get<Genre[]>(`${apiEndpoint}/genres`);
      genres.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch genres';
      console.error(err);
    }
  };

  // Automatisches Laden bei Initialisierung
  onMounted(() => {
    fetchMovies();
    fetchGenres();
  });

  // Filme nach Suchtext filtern
  const filteredMovies = computed(() => movies.value);

  // Methoden
  const addMovie = async (movie: Movie) => {
    try {
      const response = await axios.post<Movie>(`${apiEndpoint}/movies`, movie);
      movies.value.push(response.data);
    } catch (err) {
      error.value = 'Failed to add movie';
      console.error(err);
    }
  };

  const removeMovie = async (id: string) => {
    try {
      await axios.delete(`${apiEndpoint}/movies/${id}`);
      movies.value = movies.value.filter(movie => movie.id !== id);
    } catch (err) {
      error.value = 'Failed to delete movie';
      console.error(err);
    }
  };

  // Rückgabe
  return {
    movies,
    genres,
    error,
    filteredMovies,
    addMovie,
    removeMovie,
  };
});
