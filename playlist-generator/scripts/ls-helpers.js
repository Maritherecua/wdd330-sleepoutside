/* This file handles the stringifying and parsing JSON*/
const FAVORITES_KEY = "mood-favorites";

//Get favorites from local storage
export function getFavorites() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
}
//Add a song to favorites list
export function addFavorite(song) {
    const favorites = getFavorites();
    // Check if the song is already in favorites to avoid duplicates
    if (favorites.some(fav => fav.id === song.id)) {
        console.log('Song is already in favorites:', song);
        return false;
    }
    favorites.push(song);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    console.log('Added to favorites:', song);
    return true;
}