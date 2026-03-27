const FALLBACK_PLAYLISTS = {
    happy: [
        { title: "Walking on Sunshine", artist: "Katrina and the Waves" },
        { title: "Good as Hell", artist: "Lizzo" },
        { title: "Can\'t Stop the Feeling!", artist: "Justin Timberlake" }
    ],
    sad: [
        { title: "Someone Like You", artist: "Adele" },
        { title: "Fix You", artist: "Coldplay" },
        { title: "Stay", artist: "Rihanna" }
    ],
    energetic: [
        { title: "Titanium", artist: "David Guetta" },
        { title: "Stronger", artist: "Kanye West" },
        { title: "Don\'t Stop Me Now", artist: "Queen" }
    ],
    relaxed: [
        { title: "Weightless", artist: "Marconi Union" },
        { title: "Sunset Lover", artist: "Petit Biscuit" },
        { title: "Bloom", artist: "The Paper Kites" }
    ]
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
            thumbnail: null
        }));
    }
    return FALLBACK_PLAYLISTS.happy.map((song) => ({
        ...song,
        thumbnail: null
    }));
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
        console.log("iTunes API raw JSON:", data);
        const songs = (data.results || []).map((item) => ({
            title: item.trackName,
            artist: item.artistName,
            thumbnail: item.artworkUrl100 || null
        }));

        if (songs.length === 0) {
            return getFallbackSongs(mood);
        }

        return songs;
    } catch (error) {
        return getFallbackSongs(mood);
    }
}
