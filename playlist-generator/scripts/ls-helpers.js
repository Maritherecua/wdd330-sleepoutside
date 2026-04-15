/* Helpers for reading/writing favorites in localStorage. */
const FAVORITES_KEY = "mood-favorites";

export function getFavorites() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
}

export function addFavorite(song) {
    const favorites = getFavorites();
    // Avoid duplicate favorites by stable id.
    if (favorites.some((fav) => fav.id === song.id)) {
        return false;
    }
    favorites.push(song);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
}

export function removeFavoriteById(id) {
    const favorites = getFavorites();
    const updated = favorites.filter((item) => item.id !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
}

export function clearFavorites() {
    localStorage.removeItem(FAVORITES_KEY);
}

/* Selected mood persistence */
const MOOD_KEY = "selectedMood";

export function saveSelectedMood(mood) {
    localStorage.setItem(MOOD_KEY, mood);
}

export function getSelectedMood() {
    return localStorage.getItem(MOOD_KEY) || "happy";
}

/* Last generated playlist persistence */
const LAST_PLAYLIST_KEY = "lastPlaylist";

export function saveLastPlaylist(name, mood, songs) {
    localStorage.setItem(
        LAST_PLAYLIST_KEY,
        JSON.stringify({ name, mood, songs, savedAt: new Date().toISOString() })
    );
}

export function getLastPlaylist() {
    try {
        const data = localStorage.getItem(LAST_PLAYLIST_KEY);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}