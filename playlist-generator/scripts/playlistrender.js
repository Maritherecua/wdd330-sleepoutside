/* Playlist Render Module
   This module handles rendering the playlist in the DOM.
*/

function formatDuration(seconds) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

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
    const saveButton = card.querySelector(".track-save-btn");
    const meta = card.querySelector(".track-meta");

    card.querySelector(".track-title").textContent = song.title;
    card.querySelector(".track-artist").textContent = song.artist;

    const metaParts = [
      song.album,
      song.genre,
      song.releaseDate ? song.releaseDate.slice(0, 4) : null,
      formatDuration(song.duration),
    ].filter(Boolean);
    meta.textContent = metaParts.join(" • ");

    saveButton.addEventListener("click", () => {
      const customEvent = new CustomEvent("track:save", {
        detail: song,
      });
      document.dispatchEvent(customEvent);
    });

    if (!meta.textContent) {
      meta.remove();
    }

    if (song.thumbnail) {
      image.src = song.thumbnail;
      image.alt = `${song.title} album artwork`;
    } else {
      image.remove();
    }

    // Add audio preview player if available
    if (song.previewUrl) {
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = song.previewUrl;
      audio.setAttribute("aria-label", `Preview of ${song.title}`);
      audio.className = "track-preview";
      const li = card.querySelector("li") || card.firstElementChild;
      if (li) {
        li.appendChild(audio);
      } else {
        card.appendChild(audio);
      }
    }

    playlistSongs.appendChild(card);
  });
}
