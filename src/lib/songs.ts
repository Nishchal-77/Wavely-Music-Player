export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
}

export const songs: Song[] = [
  { id: "1", title: "Midnight Drive", artist: "Neon Waves", album: "After Dark", duration: "3:42", durationSeconds: 222 },
  { id: "2", title: "Ocean Breeze", artist: "Luna Sol", album: "Horizons", duration: "4:15", durationSeconds: 255 },
  { id: "3", title: "City Lights", artist: "Echo Park", album: "Urban Dreams", duration: "3:28", durationSeconds: 208 },
  { id: "4", title: "Golden Hour", artist: "Sunset Collective", album: "Warm Tones", duration: "5:01", durationSeconds: 301 },
  { id: "5", title: "Rainy Monday", artist: "Cloud Nine", album: "Atmosphere", duration: "3:55", durationSeconds: 235 },
  { id: "6", title: "Starfall", artist: "Cosmos", album: "Nebula", duration: "4:33", durationSeconds: 273 },
  { id: "7", title: "Summer Haze", artist: "Daydream", album: "Pastel Skies", duration: "3:18", durationSeconds: 198 },
  { id: "8", title: "Velvet Night", artist: "Neon Waves", album: "After Dark", duration: "4:47", durationSeconds: 287 },
  { id: "9", title: "Electric Feel", artist: "Pulse", album: "Frequency", duration: "3:36", durationSeconds: 216 },
  { id: "10", title: "Wanderlust", artist: "Nomad", album: "Journeys", duration: "4:22", durationSeconds: 262 },
  { id: "11", title: "Crystal Clear", artist: "Prism", album: "Refraction", duration: "3:50", durationSeconds: 230 },
  { id: "12", title: "Deep Blue", artist: "Aqua", album: "Depths", duration: "5:12", durationSeconds: 312 },
];
