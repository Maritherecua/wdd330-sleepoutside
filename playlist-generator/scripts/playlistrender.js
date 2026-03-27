/* Playlist Render Module
   This module handles rendering the playlist in the DOM.
*/
export function renderPlaylist(songs) {
    const playlistSongs = document.getElementById("playlist-songs");
    playlistSongs.innerHTML = "";

    if (songs.length === 0) {
        playlistSongs.innerHTML = "<li>No songs found for this mood.</li>";
        return;
    }

    songs.forEach((song) => {
        const li = document.createElement("li");
        li.textContent = `${song.title} by ${song.artist}`;
        playlistSongs.appendChild(li);
    });
}