<script setup lang="ts">
import { ref } from 'vue';
import { useMovieStore } from '../stores/movieStore';
import AddMovieButton from './AddMovieButton.vue';
import SearchResults from './SearchResults.vue';

const store = useMovieStore();
const searchQuery = ref('');
const showSearchResults = ref(false);

const updateSearch = (event: Event) => {
  const target = event.target as HTMLInputElement;
  store.searchQuery = target.value;
  showSearchResults.value = !!target.value;
};

const closeSearch = () => {
  showSearchResults.value = false;
  store['searchQuery'] = '';
  searchQuery.value = '';
};
</script>

<template>
  <header class="bg-[#020B34] py-4 px-6 relative">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <img src="/logo.svg" alt="MovieMatch Logo" class="h-10 w-10" />
        <h1 class="text-2xl font-bold">
          <span class="text-white">MOVIE</span>
          <span class="text-[#FF6B4A]">MATCH</span>
        </h1>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            @input="updateSearch"
            @focus="showSearchResults = !!searchQuery"
            placeholder="Search movies or genres..."
            class="w-64 px-4 py-2 bg-[#020B34] border border-[#FF6B4A] rounded-full text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]"
          />

          <!-- Search Results Dropdown -->
          <div v-if="showSearchResults"
               class="absolute top-full right-0 mt-2 w-[600px] max-h-[80vh] overflow-y-auto bg-[#020B34] border border-[#FF6B4A]/20 rounded-lg shadow-xl p-4 z-50">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold text-white">Search Results</h3>
              <button
                @click="closeSearch"
                class="text-[#FF6B4A] hover:text-white"
              >
                Close
              </button>
            </div>
            <SearchResults />
          </div>
        </div>
        <AddMovieButton />
      </div>
    </div>
  </header>
</template>
