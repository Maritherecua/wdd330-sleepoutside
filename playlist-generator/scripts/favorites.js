import {
    getFavorites,
    removeFavoriteById,
    clearFavorites,
} from "./ls-helpers.js";

const favoritesList = document.getElementById("favorites-list");
const favoritesEmpty = document.getElementById("favorites-empty");
const favoritesCount = document.getElementById("favorites-count");
const clearButton = document.getElementById("clear-favorites-btn");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("favorites-search");

let activeFilter = "all";
let searchTerm = "";

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

function getFavoriteType(item) {
    if (item.type === "playlist") return "playlist";
    return "track";
}

function matchesSearch(item, term) {
    if (!term) return true;
    const haystack = [item.title, item.name, item.artist, item.mood]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    return haystack.includes(term);
}

function renderFavorites() {
    const favorites = getFavorites();
    const filteredFavorites = favorites.filter((item) => {
        const type = getFavoriteType(item);
        const typeMatches = activeFilter === "all" || activeFilter === type;
        const searchMatches = matchesSearch(item, searchTerm);
        return typeMatches && searchMatches;
    });

    favoritesList.innerHTML = "";
    favoritesCount.textContent = `${filteredFavorites.length} of ${favorites.length} saved item${favorites.length === 1 ? "" : "s"}`;

    if (filteredFavorites.length === 0) {
        favoritesEmpty.hidden = false;
        favoritesEmpty.textContent = favorites.length === 0
            ? "No favorites yet. Save a playlist or track from the main screen."
            : "No saved items match this filter.";
        return;
    }

    favoritesEmpty.hidden = true;

    filteredFavorites.forEach((item) => {
        const li = document.createElement("li");
        li.className = "favorite-item";

        const thumb = document.createElement("img");
        thumb.className = "favorite-thumb";
        thumb.src = item.thumbnail || "images/logo.webp";
        thumb.alt = item.title ? `${item.title} artwork` : "Saved item";

        const info = document.createElement("div");
        const title = document.createElement("h3");
        title.className = "favorite-title";
        title.textContent = item.title || item.name || "Untitled";

        const meta = document.createElement("p");
        meta.className = "favorite-meta";
        const artistPart = item.artist ? `${item.artist} | ` : "";
        const moodPart = item.mood ? `Mood: ${item.mood}` : "";
        const datePart = formatDate(item.savedAt);
        const separator = moodPart && datePart ? " | " : "";
        meta.textContent = `${artistPart}${moodPart}${separator}${datePart}`.trim();

        info.appendChild(title);
        info.appendChild(meta);

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.type = "button";
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => {
            removeFavoriteById(item.id);
            renderFavorites();
        });

        li.appendChild(thumb);
        li.appendChild(info);
        li.appendChild(removeBtn);
        favoritesList.appendChild(li);
    });
}

clearButton.addEventListener("click", () => {
    clearFavorites();
    renderFavorites();
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach((btn) => btn.classList.remove("is-active"));
        button.classList.add("is-active");
        renderFavorites();
    });
});

searchInput.addEventListener("input", (event) => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderFavorites();
});

renderFavorites();
