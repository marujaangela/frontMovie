import { defineStore } from 'pinia';
import { ref, computed, onMounted, UnwrapRef } from 'vue'
import axios from 'axios';
import type { Movie, Genre } from "../types/movie.ts";

// API-Endpunkte
const apiEndpoint = `${import.meta.env.VITE_APP_BACKEND_BASE_URL}/api/movies`;
const apiEndpointTwo = `${import.meta.env.VITE_APP_BACKEND_BASE_URL}/api/genres`;

export const useMovieStore = defineStore('movies', () => {
  // State
  const movies = ref<Movie[]>([]);
  const genres = ref<Genre[]>([]);
  const searchQuery = ref<string>('');
  const recommendedMovie = ref<Movie | null>(null);
  const setSelectedGenre = ref<string | null>(null);
  const currentView = ref<'all' | 'watched' | 'unwatched'>('all');
  const error = ref<string | null>(null);

  // Computed Property: Gesehene Filme filtern
  const watchedMovies = computed(() =>
    movies.value.filter((movie) => movie.watched)
  );

  // Computed Property: Ungesehene Filme filtern
  const unwatchedMovies = computed(() =>
    movies.value.filter((movie) => !movie.watched)
  );

  // Computed Property: Aktuelle Filme basierend auf der Ansicht
  const currentMovies = computed(() => {
    switch (currentView.value) {
      case 'watched':
        return watchedMovies.value;
      case 'unwatched':
        return unwatchedMovies.value;
      default:
        return movies.value;
    }
  });

  // Computed Property: Gruppiert Filme nach Genre
  const moviesByGenre = computed(() => {
    const grouped: Record<string, Movie[]> = {};
    genres.value.forEach((genre) => {
      grouped[genre.name] = currentMovies.value.filter((movie) =>
        movie.genre.includes(genre.name)
      );
    });
    return grouped;
  });

  // Computed Property: Filtert Filme basierend auf Suchtext und Genre
  const filteredMovies = computed(() => {
    let filtered = currentMovies.value;

    if (setSelectedGenre.value) {
      filtered = filtered.filter((movie) =>
        movie.genre.includes(setSelectedGenre.value!)
      );
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(query) ||
        movie.genre.some((genreName) =>
          genres.value.some(
            (genre) =>
              genre.name.toLowerCase() === genreName.toLowerCase() &&
              genre.name.toLowerCase().includes(query)
          )
        )
      );
    }

    return filtered;
  });

  // Methode: Einen neuen Film hinzufügen
  async function addMovie(movie: Movie): Promise<void> {
    try {
      const response = await axios.post<Movie>(apiEndpoint, movie);
      movies.value.push(response.data);
    } catch (err) {
      error.value = 'Failed to add the movie';
      console.error(err);
    }
  }

  // Methode: Einen existierenden Film aktualisieren
  async function updateMovie(updatedMovie: Movie): Promise<void> {
    try {
      const response = await axios.put<Movie>(
        `${apiEndpoint}/${updatedMovie.id}`,
        updatedMovie
      );
      const index = movies.value.findIndex((m) => m.id === updatedMovie.id);
      if (index !== -1) {
        movies.value[index] = response.data;
      }
    } catch (err) {
      error.value = 'Failed to update the movie';
      console.error(err);
    }
  }

  // Methode: Einen Film entfernen
  async function removeMovie(id: string): Promise<void> {
    try {
      await axios.delete(`${apiEndpoint}/${id}`);
      movies.value = movies.value.filter((m) => m.id !== id);
    } catch (err) {
      error.value = 'Failed to delete the movie';
      console.error(err);
    }
  }

  // Methode: Ein neues Genre hinzufügen
  async function addGenre(genre: Genre): Promise<void> {
    try {
      const response = await axios.post<Genre>(apiEndpointTwo, genre);
      genres.value.push(response.data);
    } catch (err) {
      error.value = 'Failed to add the genre';
      console.error(err);
    }
  }

  // Methode: Ein Genre entfernen
  async function removeGenre(id: number): Promise<void> {
    try {
      await axios.delete(`${apiEndpointTwo}/${id}`);

      // Filter Genres und prüfe, ob `g.id` tatsächlich definiert ist
      genres.value = genres.value.filter((g) => g.id !== id);

      // Aktualisiere die Genres in den Filmen
      movies.value.forEach((movie) => {
        movie.genre = movie.genre.filter((g) => Number(g) !== id); // Sicherstellen, dass `g` eine Zahl ist
      });
    } catch (err) {
      error.value = 'Failed to delete the genre';
      console.error(err);
    }
  }

// **Methode: Ansicht ändern**
  function setView(view: 'all' | 'watched' | 'unwatched'): void {
    currentView.value = view; // Aktualisiere die aktuelle Ansicht
    recommendedMovie.value = null; // Setze die Empfehlung zurück
  }

  // Methode: "Gesehen"-Status eines Films umschalten
  async function toggleWatched(id: string): Promise<void> {
    const movie = movies.value.find((m) => m.id === id);
    if (movie) {
      movie.watched = !movie.watched
      await updateMovie(movie) // Speichert den Status im Backend
    }
  }

  // Methode: Empfehlung generieren
  function generateRecommendation(genreId: UnwrapRef<Genre['id']> | undefined): void {
    const eligibleMovies = currentMovies.value.filter(
      (movie) => movie.genre.includes(genreId) && !movie.watched
    );

    if (eligibleMovies.length === 0) {
      recommendedMovie.value = null;
      return;
    }

    const randomIndex = Math.floor(Math.random() * eligibleMovies.length);
    recommendedMovie.value = eligibleMovies[randomIndex];
  }

  // Daten vom Backend laden
  async function fetchGenres(): Promise<void> {
    try {
      const response = await axios.get<Genre[]>(apiEndpointTwo);
      genres.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch genres';
      console.error(err);
    }
  }

  async function fetchMovies(): Promise<void> {
    try {
      const response = await axios.get<Movie[]>(apiEndpoint);
      movies.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch movies';
      console.error(err);
    }
  }

  // Automatisches Laden bei Initialisierung
  onMounted(() => {
    fetchMovies();
    fetchGenres();
  });

  return {
    movies,
    genres,
    searchQuery,
    recommendedMovie,
    setSelectedGenre,
    currentView,
    setView,
    watchedMovies,
    unwatchedMovies,
    currentMovies,
    moviesByGenre,
    filteredMovies,
    addMovie,
    updateMovie,
    removeMovie,
    toggleWatched,
    addGenre,
    removeGenre,
    generateRecommendation,
  };
});
