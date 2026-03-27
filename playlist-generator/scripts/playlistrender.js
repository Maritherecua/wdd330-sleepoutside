/* Playlist Render Module
   This module handles rendering the playlist in the DOM.
*/
export function renderPlaylist(songs) {
    const playlistSongs = document.getElementById("playlist-songs");
    const template = document.getElementById("tracklist-card-template");
    playlistSongs.innerHTML = "";

    if (songs.length === 0) {
        playlistSongs.innerHTML = "<li>No songs found for this mood.</li>";
        return;
    }

    songs.forEach((song) => {
        // Clone the template content
        const card = template.content.cloneNode(true);

        // Populate the cloned card with song data
        card.querySelector(".track-title").textContent = song.title;
        card.querySelector(".track-artist").textContent = song.artist;

        if (song.thumbnail) {
            const img = card.querySelector(".track-thumbnail");
            img.src = song.thumbnail;
            img.alt = `${song.title} thumbnail`;
        }

        playlistSongs.appendChild(card);
    });
}