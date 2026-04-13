/* Music Service Module
   This module handles fetching songs from the music API based on the selected mood.
*/

export async function fetchSongsByMood(mood) {
  try {
    const response = await fetch(`https://api.example.com/songs?mood=${mood}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.songs;
  } catch (error) {
    return [];
  }
}
