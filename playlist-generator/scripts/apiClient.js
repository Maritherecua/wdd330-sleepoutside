const FALLBACK_PLAYLISTS = {
  happy: [
    { title: "Walking on Sunshine", artist: "Katrina and the Waves" },
    { title: "Good as Hell", artist: "Lizzo" },
    { title: "Can't Stop the Feeling!", artist: "Justin Timberlake" },
  ],
  sad: [
    { title: "Someone Like You", artist: "Adele" },
    { title: "Fix You", artist: "Coldplay" },
    { title: "Stay", artist: "Rihanna" },
  ],
  energetic: [
    { title: "Titanium", artist: "David Guetta" },
    { title: "Stronger", artist: "Kanye West" },
    { title: "Don't Stop Me Now", artist: "Queen" },
  ],
  relaxed: [
    { title: "Weightless", artist: "Marconi Union" },
    { title: "Sunset Lover", artist: "Petit Biscuit" },
    { title: "Bloom", artist: "The Paper Kites" },
  ],
  productive: [
    { title: "Eye of the Tiger", artist: "Survivor" },
    { title: "Harder, Better, Faster, Stronger", artist: "Daft Punk" },
    { title: "Hall of Fame", artist: "The Script" },
  ],
  chill: [
    { title: "Sunflower", artist: "Post Malone" },
    { title: "Ocean Eyes", artist: "Billie Eilish" },
    { title: "Riptide", artist: "Vance Joy" },
  ],
  melancholy: [
    { title: "Skinny Love", artist: "Bon Iver" },
    { title: "When the Party's Over", artist: "Billie Eilish" },
    { title: "The Night We Met", artist: "Lord Huron" },
  ],
};

const GENERIC_HITS_PLAYLIST = [
  { title: "Blinding Lights", artist: "The Weeknd" },
  { title: "Levitating", artist: "Dua Lipa" },
  { title: "Shake It Off", artist: "Taylor Swift" },
  { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
  { title: "Firework", artist: "Katy Perry" },
  { title: "Happy", artist: "Pharrell Williams" },
  { title: "Good 4 U", artist: "Olivia Rodrigo" },
];

function normalizeMood(mood) {
  const value = (mood || "").trim().toLowerCase();
  return value || "happy";
}

function getFallbackSongs(mood) {
  const key = normalizeMood(mood);
  if (FALLBACK_PLAYLISTS[key]) {
    return FALLBACK_PLAYLISTS[key].map((song) => ({
      ...song,
      thumbnail: null,
      album: null,
      genre: null,
    }));
  }
  return FALLBACK_PLAYLISTS.happy.map((song) => ({
    ...song,
    thumbnail: null,
    album: null,
    genre: null,
  }));
}

function getGenericHitsSongs() {
  return GENERIC_HITS_PLAYLIST.map((song) => ({
    ...song,
    thumbnail: null,
    album: "Hits Collection",
    genre: "Pop",
  }));
}

function toSongKey(song) {
  return `${song.title || ""}-${song.artist || ""}`.trim().toLowerCase();
}

function mergeSongsWithFallbacks(primarySongs, mood, limit) {
  const mergedSongs = [];
  const seenSongs = new Set();

  [...primarySongs, ...getFallbackSongs(mood), ...getGenericHitsSongs()].forEach(
    (song) => {
      if (!song?.title || !song?.artist || mergedSongs.length >= limit) {
        return;
      }

      const key = toSongKey(song);
      if (seenSongs.has(key)) {
        return;
      }

      seenSongs.add(key);
      mergedSongs.push(song);
    }
  );

  return mergedSongs;
}

async function fetchTrackDetails(title, artist) {
  const queryArtist = encodeURIComponent(artist || "");
  const queryTitle = encodeURIComponent(title || "");
  const endpoint = `https://theaudiodb.com/api/v1/json/2/searchtrack.php?s=${queryArtist}&t=${queryTitle}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`TheAudioDB request failed with status ${response.status}`);
    }

    const data = await response.json();
    const match = (data.track || [])[0];
    if (!match) {
      return null;
    }

    return {
      album: match.strAlbum || null,
      genre: match.strGenre || null,
      thumbnail: match.strTrackThumb || match.strAlbumThumb || null,
    };
  } catch (error) {
    console.error(`[fetchTrackDetails] Failed for "${title}" by "${artist}":`, error);
    return null;
  }
}

export async function fetchSongsByMood(mood, limit = 10) {
  const query = encodeURIComponent(normalizeMood(mood));
  const endpoint = `https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=${limit}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const songs = (data.results || [])
      .map((item) => ({
        id: item.trackId || `${item.trackName}-${item.artistName}`,
        title: item.trackName,
        artist: item.artistName,
        album: item.collectionName || null,
        genre: item.primaryGenreName || null,
        thumbnail: item.artworkUrl100 || null,
        previewUrl: item.previewUrl || null,
        releaseDate: item.releaseDate ? item.releaseDate.slice(0, 10) : null,
        duration: item.trackTimeMillis ? Math.round(item.trackTimeMillis / 1000) : null,
      }))
      .filter((song) => song.title && song.artist);

    if (songs.length === 0) {
      return mergeSongsWithFallbacks([], mood, limit);
    }

    const enrichedSongs = await Promise.all(
      songs.map(async (song) => {
        const details = await fetchTrackDetails(song.title, song.artist);
        return {
          ...song,
          album: details?.album || song.album,
          genre: details?.genre || song.genre,
          thumbnail: song.thumbnail || details?.thumbnail || null,
        };
      })
    );

    return mergeSongsWithFallbacks(enrichedSongs, mood, limit);
  } catch (error) {
    console.error(`[fetchSongsByMood] API request failed for mood "${mood}":`, error);
    return mergeSongsWithFallbacks([], mood, limit);
  }
}
