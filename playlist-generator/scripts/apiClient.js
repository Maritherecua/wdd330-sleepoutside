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
  } catch {
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
    const songs = (data.results || []).map((item) => ({
      id: item.trackId || `${item.trackName}-${item.artistName}`,
      title: item.trackName,
      artist: item.artistName,
      album: item.collectionName || null,
      genre: item.primaryGenreName || null,
      thumbnail: item.artworkUrl100 || null,
    }));

    if (songs.length === 0) {
      return getFallbackSongs(mood);
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

    return enrichedSongs;
  } catch (error) {
    return getFallbackSongs(mood);
  }
}
