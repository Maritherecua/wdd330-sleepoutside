/*handles the state of the selected mood and filters*/
/*handles the state of the selected mood and filters*/
import { fetchSongsByMood } from "./apiClient.js";
import { renderPlaylist } from "./playlistrender.js";
import { addFavorite } from "./ls-helpers.js";

document.addEventListener("DOMContentLoaded", () => {
  const moodButtons = document.querySelectorAll(".mood-btn");
  const moodDropdown = document.getElementById("mood-dropdown");
  const generateButton = document.getElementById("generate-playlist");
  const playlistSongs = document.getElementById("playlist-songs");
  const customMoodInput = document.getElementById("custom-mood");
  const saveFavoritesBtn = document.getElementById("save-favorites-btn");
  const shareBtn = document.getElementById("share-btn");
  const actionFeedback = document.getElementById("action-feedback");

  let selectedMood = "happy";
  let currentPlaylistName = "";

  document.addEventListener("track:save", (event) => {
    const song = event.detail;
    if (!song) {
      showFeedback("Could not save this track.");
      return;
    }

    const wasSaved = addFavorite({
      id: `${song.title}-${song.artist}`,
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail || null,
      mood: selectedMood,
      playlist: currentPlaylistName,
      savedAt: new Date().toISOString(),
    });
    showFeedback(
      wasSaved
        ? `Saved ${song.title} to Favorites!`
        : `${song.title} is already in Favorites.`
    );
  });

  function showFeedback(msg) {
    actionFeedback.textContent = msg;
    setTimeout(() => { actionFeedback.textContent = ""; }, 3000);
  }

  moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedMood = button.dataset.mood;
      customMoodInput.style.display =
        selectedMood === "custom" ? "block" : "none";
    });
  });

  moodDropdown.addEventListener("change", () => {
    selectedMood = moodDropdown.value;
    customMoodInput.style.display =
      selectedMood === "custom" ? "block" : "none";
  });

  generateButton.addEventListener("click", async () => {
    const mood =
      selectedMood === "custom" ? customMoodInput.value : selectedMood;
    await generatePlaylist(mood);
  });

  async function generatePlaylist(mood) {
    playlistSongs.innerHTML = "<li>Loading songs...</li>";
    const playlistSection = document.getElementById("playlist");
    const playlistHeading = document.getElementById("playlist-heading");
    const moodLabel = mood.charAt(0).toUpperCase() + mood.slice(1);
    playlistSection.dataset.mood = mood;
    playlistHeading.textContent = `Your ${moodLabel} Playlist`;
    currentPlaylistName = `Your ${moodLabel} Playlist`;

    try {
      const songs = await fetchSongsByMood(mood);
      renderPlaylist(songs);
    } catch (error) {
      playlistSongs.innerHTML =
        "<li>Could not load songs. Please try again.</li>";
    }
  }

  saveFavoritesBtn.addEventListener("click", () => {
    if (!currentPlaylistName) {
      showFeedback("Generate a playlist first!");
      return;
    }
    const wasSaved = addFavorite({
      id: `playlist-${selectedMood}-${currentPlaylistName}`,
      type: "playlist",
      name: currentPlaylistName,
      mood: selectedMood,
      savedAt: new Date().toISOString(),
    });
    showFeedback(wasSaved ? "Saved to Favorites!" : "Playlist is already in Favorites.");
  });

  shareBtn.addEventListener("click", async () => {
    if (!currentPlaylistName) {
      showFeedback("Generate a playlist first!");
      return;
    }
    const shareData = {
      title: currentPlaylistName,
      text: `Check out my ${currentPlaylistName} on Mood Tunes!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled — no action needed
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showFeedback("Link copied to clipboard!");
    }
  });
});
