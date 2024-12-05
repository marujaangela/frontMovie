import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Movie, Genre } from '@/types/movie';

export const useMovieStore = defineStore('movies', () => {
  // State: Speichert alle Filme
  const movies = ref<Movie[]>([]); // Liste der Filme
  const genres = ref<Genre[]>([]); // Liste der Genres
  const searchQuery = ref(''); // Der aktuelle Suchtext
  const recommendedMovie = ref<Movie | null>(null); // Ein empfohlener Film
  const selectedGenre = ref<string | null>(null); // Das aktuell ausgewählte Genre
  const currentView = ref<'all' | 'watched' | 'unwatched'>('all'); // Aktive Ansicht

  // Füge Testdaten hinzu
  movies.value.push({
    id: '1',
    title: 'Spider Man',
    description: 'This is a test description',
    releaseYear: 2008,
    genre: ['test-genre'],
    imageUrl: 'data:image/webp;base64,UklGRjYKAABXRUJQVlA4ICoKAADQNgCdASqFAJsAPrVQoUynJKMiqrTaaOAWiWJtGPAFquesyqWjffAAI9tpenzcA86P6at683pzGVsV+/PdP++8aXGJ8j4haeyeZ79/7t0aXszYYQy7VY3faE6Hef/tdardzk2/1gBoQknM6hdGvquCMjuE8E69G+d6sKbrPNu5rRHOqsAf036TFaJjDPvFJgdSTLDhPs7IlBt49hLQlT0s5vlaylUKwahAcSpYFRUsgwHx30xynXOUMS/RtAjblsei7vlybDu1SkP3g9gMGZUk0PvAbus8KLlEIhMt9mYdgJs7i0kzqIZFKM2I+ptFPykmFBEIC9L0+5LZWv7/tdgm6yeFy+zYjICcsb04x+UjbhPQZfPf19GFFC4SUugPdGO0ES9jneiCtSaW9YIA9tOaUK+x1Qk216zovTBXE2nSW4LJqoKQtFYQnQ9Jina63fpiPkN54ZCvbay565z+nFKJZtCSGLVAEuPBg6r04Brt/kBPBMwNzTnf6zQhl4s5TQ50lR2ONG89RpVEU+HgTYFqzHtPLktGuUxiV0jJCI4pcY9BgrSr+NM8VQi65P3dDDA/mpdOQYYVvWM6At18msgA/vtcovSSOxW9KOXcXeHmWcAWmRESq9OPbgN8mk1XgzKadDszm1vyU4uhINpxYOeJhs0Q353WHlIPI4BqwJ9QB5o7PjGFnZy/YB4C8TS/RGC5vQjqZ13X3C3QR2Fre7ZbVv81WJ/hHO+5exyJh5N0/9dGe2cz9mHSS+4/cedOnVWhzj7Yy7+gm5qh0hbgTire4ve/8TdBjj6ZWskAh1N1AO9n1lLk1fZDyrLq37td5OPvgW/iIdYDecgFlQVjzT31FcqihK4FClGqiWLcFya/Pms06jJmwaeplMpZE0FrjaMkJZbudW8h/y1BXbp6XVRMWzHltjUccMtJUHN8hlN+6MfqtKSvK2Vcitrj1PJQW7Kvb1Fr3rKd7TWFOFsUgEwYAVWE12IkqNgR/F5/qI7MTsTi/w1EhfnlZZFFJ7X1VJ0/4lQQGhpIriZ2wHVfIa1QDRZmNxXHecaaPeHnf81clToGfM6fwMa3hQtU8fuuENPjzfZzdznhzv5BmyY3uIkec4gYQBrYYUXravGG9W4GmzLXbcLC5DBUbLczcyzT9nLbukY0ChBwEo2AJD3C4Cr/u+k8EFraPuwS7iNeTcO3Yqsd92MIVmlFWPyYCa6M3RgGzr/QRJ1uiz2/UrkHgznRIlPzuj6gZ6Gcri4CyZ70WwUGkY9kufgm9gO0NsHjjPfwApRqHP+KgE+7XJqth8EhFBX6UYD7R3ocUrTVMkhUYKCBU1EAlFAxzBM8fkGbGqAkfRCHVpQFAbqSqVFOoGxpm24AZMQwwv3fM3HYSYd7U74ITSdb1Z4m2RgSN62/exxSPQH8cS482JyXJeAjUBjCfyOx8lQttr3aNALo2RxuTehYy1JEKA01uJOh0oF/Zs91p8cJzW4mRHncXGIEMshjlKVpdVGjw79OFWoxNoptOJIUoAuUFpprRrf4ieGH/pjEmxUfzU8/3AWDdMTAz9jcTz/TKDy2mP3LpPsfSJfwHQxin5twTqRHDZiNwc9KVqKk/p24RvxWcEFYEgKgvz1OxfKmS+qguKqaIWJLD5MVJz7dsq9RPn2LjFLCcb8NN4QUZY1nkW/u7D85tZbgsJvT83Sj0Z/5wpLhaCHnS+ClYXhK1/vEueawsX8eEZEt7b9vxvCmE3lZ5Cpsge1AjxdgFuyuZL+An2X3ihXokm7BtgWTsBY5nDel5DT4LGVjLX//f7a7s9o4IShyZ54wQzqLQNisUb2Nm+kMJQwYORkmInPfBJM2MT/JTaHOwqt9e6CokEQThPorv0cUWAmrOIjaVD9C9cLwju1/rwb6zFMLxu8Vm0DoxBGIFeslESp+Hs0Nzr/K6x8pMBPyqBwKRkfB75sfy4WEr4RqyYSdDoa8mWMty59J3caj9zUhYrkSKNbP3aoAqtdKU7gaF6e/t0FjWHBrItJ5h2cUj7RqpxPHe6ecCzR0fhakQBvJpJoCo+JQ1W808QIW+Tf7Nshd4HltvsYwFO2IeW7/FsNtx930l5qfeqLXVjOaM3F0pP853Z0MOWnyx+C9DTeuZ97VnYVikjY2H1qoDkf2jF+8KCoRtLxWyD1+PRru2qZrlF3wfCn7nZmx+A9SkTmq+Q8bk8FJcXSRIxcGzZmUH5740BDfvRKwm8WoN5TQj6ft1JACAPafatS6ooh9KizBJAsfTKujcn0ytF7UzybiYtWmmHaK970oSjjx6Wtt0ta9HDrqYTDBVUmTPY07n0IdVBi05x42dJNhpINpEuS7ABy6kcLBiUtQOph8mNT4YO2VbIB38WIYv+0OPfA34yhI+wXRq3/v2/NZrgutZN8ba0SYpxKy+ns0fZZWMBlQ/kMiueas6dleNmVWAEGy66k/AZoEtBf+SPFiHpttl7LzuQ3SCY7hjdn71Vsw8K3UC1FjqzNBd38jFDrZz5oPkKqFyLZAKWxO0gf6V60P1fUyQlafaMGSRjH0/kMj5AgIMUumk1D8X+3ktC7/CM2UBPfUeHYJCFsggfWcaja2O06YOPryRwSBIPu9AXjWqU7XQW8ugIPO3Kqq+Ew3JIDtseuB3IakZoJmm6ueoTX59sWoms1DaQYYBKYRwHsVLVnyCuHKq29s06nhRLNTBF/jn9USHzdzrVOzOcFLLsQa8K2GtcpkEZNrVrucenJHhlFKQOgA+NedyiTktjhaUbJybh07nV7692Im0djh93KGSUcEk0UbxKTRTzpiLSUkI0ULr0HuMxrLKwkA0PslYB+I+NmZlYSlgXrorVjajFfBmbrfvcg5QLYvTVaH3LcyP03lncb/1fQk9hQ/hxSPuECZubWQ6GBz3MvPyeTkAK+nnIbWMQ6RnABdVUbgka+oQMqyUYdW+SvG+XpW2H1zi+YnIm3+IRH9CFOqgmgCgpZWuY6FeeKgkNSGeznu2osbXvmevngTsgqscElYWQ3OeMwqEmB/7Y4cHACGSBvEvlLCuQEtMqe3uY99IiHvVvkbnU7C3Hsq5ZxK0wIodo5eNN89ElwiNJV3wPB4IlFiusJ6VrORZK6dBSu8s9ayt9f/zlH2xx0zbuu9q03O95g0XOrlAKQMHJsE4+rMbXAJLisIX15KwbKGt6+iuuSX3rClKfMYjnAbNjlMN4eQpeEiNIb1zr/r6cXB+9+m5sew2gbio3tO0xaU05aLgJ9eIwG2AbWySXFB4O2FpC/ReVMwePEqmycRj8YFXElIBURXgvYkWX7GG/Ehp3ISP4tsurLPSpWGQjeu9l0n8hoA+gTmxZVKLgbmA5bIqgICPUaFeSdX0fVfYqWzK8Ee7/VX7wQ80zOAFlKJVLfTLId4+taWaZEdjztBoTqClWpJ4hv3DPIvUA3dHvQmFuy8pH1azWKDb0Y9g7YbCjH8t8K664YwG6heAAAA',
    watched: false,
  });

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
