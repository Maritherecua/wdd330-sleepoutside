/* This file handles the stringifying and parsing JSON*/
//Get favorites from local storage
export function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
}
//Add a song to favorites list
export function addFavorite(song) {
    const favorites = getFavorites();
    favorites.push(song);
    localStorage.setItem('mood-favorites', JSON.stringify(favorites));
    console.log('Added to favorites:', song);
}