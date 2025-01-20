// Definiert die Struktur eines Films
export interface Movie {
  description: string;// Beschreibung des Films
  imageUrl: string;// Film Bild
  releaseYear: number;// Veröffentlichungsjahr des Films
  id?: number; // Eindeutige ID für den Film
  title: string; // Titel des Films
  genre: number; // Liste von Genre-IDs, zu denen der Film gehört
  watched: boolean; // Gibt an, ob der Film gesehen wurde
}

// Definiert die Struktur eines Genres
export interface Genre {
  id?: number; // Eindeutige ID für das Genre
  name: string; // Name des Genres
}
