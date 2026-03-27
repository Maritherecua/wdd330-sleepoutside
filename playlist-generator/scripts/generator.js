import { fetchSongsByMood } from "./apiClient.js";

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
            customMoodInput.style.display = selectedMood === "custom" ? "block" : "none";
        });
    });

    moodDropdown.addEventListener("change", () => {
        selectedMood = moodDropdown.value;
        customMoodInput.style.display = selectedMood === "custom" ? "block" : "none";
    });

    generateButton.addEventListener("click", async () => {
        const mood = selectedMood === "custom" ? customMoodInput.value : selectedMood;
        await generatePlaylist(mood);
    });

    async function generatePlaylist(mood) {
        playlistSongs.innerHTML = "<li>Loading songs...</li>";

        try {
            const songs = await fetchSongsByMood(mood);
            playlistSongs.innerHTML = "";

            songs.forEach((song) => {
                const li = document.createElement("li");
                li.textContent = `${song.title} by ${song.artist}`;
                playlistSongs.appendChild(li);
            });
        } catch (error) {
            playlistSongs.innerHTML = "<li>Could not load songs. Please try again.</li>";
        }
    }
});