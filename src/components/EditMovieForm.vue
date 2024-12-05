<script setup lang="ts">
import { ref } from 'vue';
import { useMovieStore } from '@/stores/movieStore';
import type { Movie } from '@/types/movie';

// Reaktive Props für den zu bearbeitenden Film
const props = defineProps<{
  movie: Movie;
}>();

const emit = defineEmits(['close', 'save']); // Ereignisse zum Schließen und Speichern
const store = useMovieStore(); // Zugriff auf den Store

// Initialisierung der Felder mit den Film-Props
const title = ref(props.movie.title);
const releaseYear = ref(props.movie.releaseYear);
const imageUrl = ref(props.movie.imageUrl);
const description = ref(props.movie.description);
const selectedGenres = ref([...props.movie.genre]);

// Funktion: Änderungen speichern
const saveMovie = () => {
  if (!title.value.trim() || !imageUrl.value.trim()) return;

  const updatedMovie: Movie = {
    ...props.movie, // Beibehaltung der ursprünglichen ID und anderer unveränderter Felder
    title: title.value.trim(),
    releaseYear: releaseYear.value,
    genre: selectedGenres.value,
    imageUrl: imageUrl.value.trim(),
    description: description.value.trim(),
  };

  store.updateMovie(updatedMovie); // Aktualisierung des Films im Store
  emit('save'); // Ereignis zum Speichern auslösen
};
</script>
