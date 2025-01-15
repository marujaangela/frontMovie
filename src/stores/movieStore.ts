import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import type { Movie, Genre } from "../types/movie.ts";

// API-Endpunkte
const apiEndpoint = `${import.meta.env.VITE_APP_BACKEND_BASE_URL}/api/movies`;
const apiEndpointTwo = `${import.meta.env.VITE_APP_BACKEND_BASE_URL}/api/genres`;

export const useMovieStore = defineStore('movies', () => {
  // State
  const movies = ref<Movie[]>([]);
  const genres = ref<Genre[]>([]);
  const searchQuery = ref('');
  const recommendedMovie = ref<Movie | null>(null);
  const setSelectedGenre = ref<string | null>(null);
  const currentView = ref<'all' | 'watched' | 'unwatched'>('all');
  const error = ref<string | null>(null);

  // Computed Property: Gesehene Filme filtern
  const watchedMovies = computed(() =>
    movies.value.filter(movie => movie.watched)
  );

  // Computed Property: Ungesehene Filme filtern
  const unwatchedMovies = computed(() =>
    movies.value.filter(movie => !movie.watched)
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
    const moviesSource = currentMovies.value;
    const grouped: Record<string, Movie[]> = {};

    genres.value.forEach(genre => {
      const genreMovies = moviesSource.filter(movie =>
        movie.genre.includes(genre.name)
      );
      if (genreMovies.length > 0) {
        grouped[genre.name] = genreMovies;
      }
    });
    return grouped;
  });

  // Computed Property: Filtert Filme basierend auf Suchtext und Genre
  const filteredMovies = computed(() => {
    let filtered = currentMovies.value;

    if (setSelectedGenre.value) {
      filtered = filtered.filter(movie =>
        movie.genre.includes(setSelectedGenre.value!)
      );
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.genre.some(genreId => {
          const genre = genres.value.find(g => g.name === genreId);
          return genre?.name.toLowerCase().includes(query);
        })
      );
    }

    return filtered;
  });

  // Methode: Einen neuen Film hinzufügen
  function addMovie(movie: Movie) {
    axios
      .post<Movie>(apiEndpoint, movie)
      .then(response => {
        movies.value.push(response.data);
      })
      .catch(err => {
        error.value = 'Failed to add the movie';
        console.error(err);
      });
  }

  // Methode: Einen existierenden Film aktualisieren
  function updateMovie(updatedMovie: Movie) {
    axios
      .put<Movie>(`${apiEndpoint}/${updatedMovie.id}`, updatedMovie)
      .then(response => {
        const index = movies.value.findIndex(m => m.id === updatedMovie.id);
        if (index !== -1) {
          movies.value[index] = response.data;
        }
      })
      .catch(err => {
        error.value = 'Failed to update the movie';
        console.error(err);
      });
  }

  // Methode: Einen Film entfernen
  function removeMovie(id: string) {
    axios
      .delete(`${apiEndpoint}/${id}`)
      .then(() => {
        movies.value = movies.value.filter(m => m.id !== id);
      })
      .catch(err => {
        error.value = 'Failed to delete the movie';
        console.error(err);
      });
  }

  // Methode: Ein neues Genre hinzufügen
  function addGenre(genre: Genre) {
    axios
      .post<Genre>(apiEndpointTwo, genre)
      .then(response => {
        genres.value.push(response.data);
      })
      .catch(err => {
        error.value = 'Failed to add the genre';
        console.error(err);
      });
  }

  // Methode: Ein Genre entfernen
  function removeGenre(id: string) {
    axios
      .delete(`${apiEndpointTwo}/${id}`)
      .then(() => {
        genres.value = genres.value.filter(g => g.name!== id);
        movies.value.forEach(movie => {
          movie.genre = movie.genre.filter(g => g !== id);
        });
      })
      .catch(err => {
        error.value = 'Failed to delete the genre';
        console.error(err);
      });
  }

  // Methode: "Gesehen"-Status eines Films umschalten
  function toggleWatched(id: string) {
    const movie = movies.value.find(m => m.id === id);
    if (movie) {
      movie.watched = !movie.watched;
      updateMovie(movie); // Optional: Status auch im Backend speichern
    }
  }

  // Methode: Empfehlung generieren
  function generateRecommendation(genreId: string) {
    const eligibleMovies = currentMovies.value.filter(movie =>
      movie.genre.includes(genreId) && !movie.watched
    );

    if (eligibleMovies.length === 0) {
      recommendedMovie.value = null;
      return;
    }

    const randomIndex = Math.floor(Math.random() * eligibleMovies.length);
    recommendedMovie.value = eligibleMovies[randomIndex];
  }

  // Daten vom Backend laden
  const fetchGenres = async () => {
    try {
      const response = await axios.get<Genre[]>(apiEndpointTwo);
      genres.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch genres';
      console.error(err);
    }
  };

  // Methode: Ansicht ändern
  function setView(view: 'all' | 'watched' | 'unwatched') {
    currentView.value = view; // Ansicht aktualisieren
    recommendedMovie.value = null; // Empfehlung zurücksetzen
  }

  const fetchMovies = async () => {
    try {
      const response = await axios.get<Movie[]>(apiEndpoint);
      movies.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch movies';
      console.error(err);
    }
  };

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
    generateRecommendation
  };
});
