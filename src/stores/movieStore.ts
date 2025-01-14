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
  const searchQuery = ref(''); // Der aktuelle Suchtext
  const recommendedMovie = ref<Movie | null>(null); // Ein empfohlener Film
  const selectedGenre = ref<string | null>(null); // Das aktuell ausgewählte Genre
  const currentView = ref<'all' | 'watched' | 'unwatched'>('all'); // Aktive Ansicht
  const error = ref<string | null>(null);

  genres.value.push({
    id: 'test-genre',
    name: 'Test Genre',
  });

  // Computed Property: Gesehene Filme filtern
  const watchedMovies = computed(() =>
    movies.value.filter(movie => movie.watched)
  );

  // Computed Property: Ungesehene Filme filtern
  const unwatchedMovies = computed(() =>
    movies.value.filter(movie => !movie.watched)
  );

  // Computed Property: Aktuelle Filme basierend auf der Ansicht (all, watched, unwatched)
  const currentMovies = computed(() => {
    switch (currentView.value) {
      case 'watched': // Wenn die Ansicht "gesehene Filme" ist
        return watchedMovies.value;
      case 'unwatched': // Wenn die Ansicht "ungesehene Filme" ist
        return unwatchedMovies.value;
      default: // Standard: Alle Filme
        return movies.value;
    }
  });

  // Computed Property: Gruppiert Filme nach Genre
  const moviesByGenre = computed(() => {
    const moviesSource = currentMovies.value; // Die gefilterten Filme
    const grouped: Record<string, Movie[]> = {}; // Ergebnis als Dictionary

    genres.value.forEach(genre => {
      // Filme nach Genre-ID filtern
      const genreMovies = moviesSource.filter(movie =>
        movie.genre.includes(genre.id)
      );
      if (genreMovies.length > 0) {
        // Nur Genres hinzufügen, die Filme enthalten
        grouped[genre.id] = genreMovies;
      }
    });
    return grouped;
  });

  // Computed Property: Filtert Filme basierend auf Suchtext und ausgewähltem Genre
  const filteredMovies = computed(() => {
    let filtered = currentMovies.value; // Ausgangspunkt: Alle aktuellen Filme

    if (selectedGenre.value) {
      // Filme nach Genre-ID filtern
      filtered = filtered.filter(movie =>
        movie.genre.includes(selectedGenre.value!)
      );
    }

    if (searchQuery.value) {
      // Filme nach Titel oder Genre-Name filtern
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(query) || // Filter nach Titel
        movie.genre.some(genreId => {
          const genre = genres.value.find(g => g.id === genreId); // Genre finden
          return genre?.name.toLowerCase().includes(query); // Filter nach Genre-Name
        })
      );
    }

    return filtered;
  });

  // Methode: Ansicht ändern
  function setView(view: 'all' | 'watched' | 'unwatched') {
    currentView.value = view; // Ansicht aktualisieren
    recommendedMovie.value = null; // Empfehlung zurücksetzen
  }

  // Methode: Ausgewähltes Genre ändern
  function setSelectedGenre(genreId: string | null) {
    selectedGenre.value = genreId; // Genre aktualisieren
    recommendedMovie.value = null; // Empfehlung zurücksetzen
  }

  // Methode: Einen neuen Film hinzufügen
  function addMovie(movie: Movie) {
    movies.value.push({ ...movie, watched: false }); // Neuen Film hinzufügen, standardmäßig nicht gesehen
  }

  // Methode: Einen existierenden Film aktualisieren
  function updateMovie(updatedMovie: Movie) {
    const index = movies.value.findIndex(m => m.id === updatedMovie.id); // Film suchen
    if (index !== -1) {
      movies.value[index] = updatedMovie; // Film aktualisieren
    }
  }

  // Methode: Einen Film entfernen
  function removeMovie(id: string) {
    movies.value = movies.value.filter(m => m.id !== id); // Film nach ID entfernen
  }

  // Methode: "Gesehen"-Status eines Films umschalten
  function toggleWatched(id: string) {
    const movie = movies.value.find(m => m.id === id); // Film finden
    if (movie) {
      movie.watched = !movie.watched; // Status umschalten
    }
  }

  // Methode: Ein neues Genre hinzufügen
  function addGenre(genre: Genre) {
    genres.value.push(genre); // Neues Genre hinzufügen
  }

  // Methode: Ein Genre entfernen
  function removeGenre(id: string) {
    genres.value = genres.value.filter(g => g.id !== id); // Genre entfernen
    movies.value.forEach(movie => {
      // Genre auch aus allen Filmen entfernen
      movie.genre = movie.genre.filter(g => g !== id);
    });
  }

  // Methode: Empfehlung generieren
  function generateRecommendation(genreId: string) {
    // Filme finden, die zum Genre passen und noch nicht gesehen wurden
    const eligibleMovies = currentMovies.value.filter(movie =>
      movie.genre.includes(genreId) && !movie.watched
    );

    if (eligibleMovies.length === 0) {
      recommendedMovie.value = null; // Keine Empfehlung, wenn keine passenden Filme
      return;
    }

    const randomIndex = Math.floor(Math.random() * eligibleMovies.length); // Zufälligen Film auswählen
    recommendedMovie.value = eligibleMovies[randomIndex]; // Empfehlung setzen
  }

  const fetchGenres = async () => {
    try {
      const response = await axios.get<Genre[]>(`${apiEndpoint}/api/genres`);
      genres.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch genres';
      console.error(err);
    }
  };

  // Daten vom Backend laden
  const fetchMovies = async () => {
    try {
      const response = await axios.get<Movie[]>(`${apiEndpoint}/api/movies`);
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

  // Rückgabe: Alles, was der Store bereitstellt
  return {
    movies,
    genres,
    searchQuery,
    recommendedMovie,
    selectedGenre,
    currentView,
    watchedMovies,
    unwatchedMovies,
    currentMovies,
    moviesByGenre,
    filteredMovies,
    setView,
    setSelectedGenre,
    addMovie,
    updateMovie,
    removeMovie,
    toggleWatched,
    addGenre,
    removeGenre,
    generateRecommendation,
  };
});
