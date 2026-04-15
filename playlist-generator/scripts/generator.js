/* Controls mood selection, playlist generation, and save/share actions. */
import { fetchSongsByMood } from "./apiClient.js";
import { renderPlaylist } from "./playlistrender.js";
import { addFavorite, saveSelectedMood, getSelectedMood, saveLastPlaylist, getLastPlaylist } from "./ls-helpers.js";
/* Function that will be called when the user clicks "Generate Playlist". It fetches songs based on the selected mood and renders them. */
document.addEventListener("DOMContentLoaded", () => {
  const moodButtons = document.querySelectorAll(".mood-btn");
  const moodDropdown = document.getElementById("mood-dropdown");
  const generateButton = document.getElementById("generate-playlist");
  const playlistSongs = document.getElementById("playlist-songs");
  const customMoodInput = document.getElementById("custom-mood");
  const saveFavoritesBtn = document.getElementById("save-favorites-btn");
  const shareBtn = document.getElementById("share-btn");
  const actionFeedback = document.getElementById("action-feedback");

  let selectedMood = getSelectedMood();
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
/* Utility to manage mood selection */
  moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedMood = button.dataset.mood;
      saveSelectedMood(selectedMood);
      customMoodInput.style.display =
        selectedMood === "custom" ? "block" : "none";
    });
  });

  moodDropdown.addEventListener("change", () => {
    selectedMood = moodDropdown.value;
    saveSelectedMood(selectedMood);
    customMoodInput.style.display =
      selectedMood === "custom" ? "block" : "none";
  });

  generateButton.addEventListener("click", async () => {
    const rawMood = selectedMood === "custom" ? customMoodInput.value.trim() : selectedMood;
    if (!rawMood) {
      showFeedback("Please enter a custom mood before generating.");
      customMoodInput.focus();
      return;
    }
    await generatePlaylist(rawMood);
  });
/* Main function to generate playlist based on mood, with error handling and user feedback. */
  async function generatePlaylist(mood) {
    playlistSongs.innerHTML = "<li>Loading songs...</li>";
    const playlistSection = document.getElementById("playlist");
    const playlistHeading = document.getElementById("playlist-heading");
    const moodLabel = mood.charAt(0).toUpperCase() + mood.slice(1);
    playlistSection.dataset.mood = mood;
    playlistHeading.textContent = `Your ${moodLabel} Playlist`;
    currentPlaylistName = `Your ${moodLabel} Playlist`;
/* Fetch songs and render playlist, with error handling. */
    try {
      const songs = await fetchSongsByMood(mood);
      renderPlaylist(songs);
      saveLastPlaylist(currentPlaylistName, mood, songs);
    } catch (error) {
      console.error(`[generatePlaylist] Failed to generate playlist for mood "${mood}":`, error);
      playlistSongs.innerHTML =
        "<li>Could not load songs. Please try again.</li>";
    }
  }
/* Save the current playlist to favorites when the user clicks the "Save to Favorites" button. */
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

  // Restore last playlist on page load
  const lastPlaylist = getLastPlaylist();
  if (lastPlaylist) {
    const playlistSection = document.getElementById("playlist");
    const playlistHeading = document.getElementById("playlist-heading");
    playlistSection.dataset.mood = lastPlaylist.mood;
    playlistHeading.textContent = lastPlaylist.name;
    currentPlaylistName = lastPlaylist.name;
    selectedMood = lastPlaylist.mood;
    renderPlaylist(lastPlaylist.songs);
  }
/* Share the current playlist using the Web Share API or fallback to copying the URL. */
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
