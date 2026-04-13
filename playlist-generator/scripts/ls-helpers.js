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