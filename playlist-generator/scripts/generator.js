/*
  Playlist Generator JavaScript
  This script handles the functionality of the Playlist Generator app.
  It listens for mood selection and generates a playlist based on the selected mood.
  It uses Spotify's API and TheAudioDB API to fetch songs and create playlists.
  Playlist Generator JavaScript
  This script handles the functionality of the Playlist Generator app.
  It listens for mood selection and generates a playlist based on the selected mood.
  It uses Spotify's API and TheAudioDB API to fetch songs and create playlists.
  

*/
    document.addEventListener("DOMContentLoaded", () => {
        const moodButtons = document.querySelectorAll(".mood-btn");
        const moodDropdown = document.getElementById("mood-dropdown");
        const generateButton = document.getElementById("generate-playlist");
        const playlistSongs = document.getElementById("playlist-songs");
        const customMoodInput = document.getElementById("custom-mood");

        let selectedMood = "";

        moodButtons.forEach(button => {
            button.addEventListener("click", () => {
                selectedMood = button.dataset.mood;
                if (selectedMood === "custom") {
                    customMoodInput.style.display = "block";
                } else {
                    customMoodInput.style.display = "none";
                }
            });
        });

        moodDropdown.addEventListener("change", () => {
            selectedMood = moodDropdown.value;
            if (selectedMood === "custom") {
                customMoodInput.style.display = "block";
            } else {
                customMoodInput.style.display = "none";
            }
        });

        generateButton.addEventListener("click", () => {
            if (selectedMood === "custom") {
                selectedMood = customMoodInput.value;
            }
            generatePlaylist(selectedMood);
        });

        function generatePlaylist(mood) {
            playlistSongs.innerHTML = "";
            // Fetch songs from Spotify API and TheAudioDB API based on the mood
            // This is a placeholder for the actual API calls
            const songs = [
                { title: "Song 1", artist: "Artist 1" },
                { title: "Song 2", artist: "Artist 2" },
                { title: "Song 3", artist: "Artist 3" }
            ];
            songs.forEach(song => {
                const li = document.createElement("li");
                li.textContent = `${song.title} by ${song.artist}`;
                playlistSongs.appendChild(li);
            });
        }
    });