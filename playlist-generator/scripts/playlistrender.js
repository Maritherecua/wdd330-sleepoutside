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
        const card = template.content.cloneNode(true);
        const image = card.querySelector(".track-thumbnail");

        card.querySelector(".track-title").textContent = song.title;
        card.querySelector(".track-artist").textContent = song.artist;

        if (song.thumbnail) {
            image.src = song.thumbnail;
            image.alt = `${song.title} album artwork`;
        } else {
            image.remove();
        }

        playlistSongs.appendChild(card);
    });
}