<script setup lang="ts">
import Header from './components/Header.vue'; // Importiert die Header-Komponente
import Navigation from './components/Navigation.vue'; // Importiert die Navigationsleiste
import MoviesByCategory from './components/MoviesByCategory.vue'; // Zeigt Filme nach Kategorien an
import MovieGrid from './components/MovieGrid.vue'; // Zeigt Filme in einem Raster an
import GenreManager from './components/GenreManager.vue'; // Ermöglicht das Verwalten von Genres
import AddMovieForm from './components/AddMovieForm.vue'; // Formular zum Hinzufügen von Filmen
import { ref, computed } from 'vue'; // Reaktive Daten und berechnete Eigenschaften
import { useMovieStore } from './stores/movieStore'; // Importiert den Pinia-Store

// Zugriff auf den Store
const store = useMovieStore(); // Ruft den Store ab
const activeView = ref('all'); // Speichert die aktive Ansicht (Standard: "all")

// Bestimmt, welche Komponente basierend auf der aktiven Ansicht angezeigt wird
const currentComponent = computed(() => {
  switch (activeView.value) {
    case 'categories':
      return MoviesByCategory;
    case 'watched':
      return MovieGrid;
    case 'unwatched':
      return MovieGrid;
    case 'add':
      return AddMovieForm;
    default:
      return MovieGrid;
  }
});

// Gibt die Filme basierend auf der aktiven Ansicht zurück
const currentMovies = computed(() => {
  switch (activeView.value) {
    case 'watched':
      return store.watchedMovies;
    case 'unwatched':
      return store.unwatchedMovies;
    default:
      return store.filteredMovies;
  }
});
</script>

<template>
  <div class="min-h-screen bg-[#020B34]">
    <!-- Header-Komponente -->
    <Header />

    <!-- Navigationsleiste -->
    <Navigation v-model="activeView" />

    <!-- Hauptinhalt -->
    <main class="container mx-auto px-4 py-6">
      <!-- Rendert die aktuelle Komponente basierend auf der aktiven Ansicht -->
      <component
        :is="currentComponent"
        :movies="currentMovies"
      />

      <!-- Zeigt den GenreManager nur an, wenn die Ansicht "categories" ist -->
      <div v-if="activeView === 'categories'" class="mt-6">
        <GenreManager />
      </div>
    </main>
  </div>
</template>

<style>
/* Hintergrundfarbe und Textfarbe */
body {
  background-color: #020B34;
  color: white;
}
</style>
