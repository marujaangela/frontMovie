<script setup lang="ts">
import { ref } from 'vue';
import { useMovieStore } from '@/stores/movieStore';
import GenreDropdown from './GenreDropdown.vue';

const store = useMovieStore();
const activeTab = ref('all');

const tabs = [
  { id: 'all', label: 'All Movies' },
  { id: 'watched', label: 'Watched' },
  { id: 'unwatched', label: 'Unwatched' }
];
</script>

<template>
  <nav class="bg-[#020B34] border-b border-[#FF6B4A]/20">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between">
        <ul class="flex space-x-6">
          <li v-for="tab in tabs" :key="tab.id">
            <button
              @click="store.setView(tab.id)"
              :class="[
                'px-4 py-3 text-sm font-medium transition-colors relative',
                store.currentView === tab.id
                  ? 'text-[#FF6B4A] border-b-2 border-[#FF6B4A]'
                  : 'text-white hover:text-[#FF6B4A]'
              ]"
            >
              {{ tab.label }}
            </button>
          </li>
        </ul>

        <GenreDropdown />
      </div>
    </div>
  </nav>
</template>
