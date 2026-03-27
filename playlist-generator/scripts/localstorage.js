/* Local Storage Module
   This module handles saving and retrieving the user's selected mood from local storage.
*/

export function saveMoodToLocalStorage(mood) {
    localStorage.setItem("selectedMood", mood);
}

export function getMoodFromLocalStorage() {
    return localStorage.getItem("selectedMood") || "happy";
}