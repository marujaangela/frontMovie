<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Movie } from '../types/movie';

defineProps<{
  movie: Movie
}>();

defineEmits(['close']);
</script>

<template>
  <div class="bg-[#FF6B4A]/10 backdrop-blur-sm p-6 rounded-lg mb-8 border border-[#FF6B4A]/20">
    <div class="flex justify-between items-start">
      <div class="flex gap-6">
        <img
          :src="movie.imageUrl"
          :alt="movie.title"
          class="w-48 h-72 object-cover rounded-md shadow-lg"
        />
        <div>
          <h2 class="text-2xl font-bold text-white mb-2">Recommended: {{ movie.title }}</h2>
          <p class="text-[#FF6B4A] mb-4">{{ movie.releaseYear }}</p>
          <p class="text-white/80">{{ movie.description }}</p>
        </div>
      </div>
      <button
        @click="$emit('close')"
        class="text-white hover:text-[#FF6B4A] text-xl font-bold"
      >
        ×
      </button>
    </div>
  </div>
</template>
