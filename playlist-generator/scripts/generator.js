/*handles the state of the selected mood and filters*/
/*handles the state of the selected mood and filters*/
import { fetchSongsByMood } from "./apiClient.js";
import { renderPlaylist } from "./playlistrender.js";

document.addEventListener("DOMContentLoaded", () => {
  const moodButtons = document.querySelectorAll(".mood-btn");
  const moodDropdown = document.getElementById("mood-dropdown");
  const generateButton = document.getElementById("generate-playlist");
  const playlistSongs = document.getElementById("playlist-songs");
  const customMoodInput = document.getElementById("custom-mood");

  let selectedMood = "happy";

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

    try {
      const songs = await fetchSongsByMood(mood);
      renderPlaylist(songs);
    } catch (error) {
      playlistSongs.innerHTML =
        "<li>Could not load songs. Please try again.</li>";
    }
  }
});
