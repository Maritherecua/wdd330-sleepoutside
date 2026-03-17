const countdownDisplay = document.getElementById("countdown");
const startButton = document.getElementById("startCountdown");
const pauseResumeButton = document.getElementById("pauseResumeCountdown");
const resetButton = document.getElementById("resetCountdown");
const timeInput = document.getElementById("time");
const form = document.querySelector("form");

let intervalId = null;
let remainingTime = 0;
let isPaused = false;

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function resetCountdownDisplay() {
  countdownDisplay.textContent = "00:00:00";
}

function getSecondsUntil(timeValue) {
  const [hours, minutes] = timeValue.split(":").map(Number);
  const now = new Date();
  const target = new Date(now);

  target.setHours(hours, minutes, 0, 0);

  // If the selected time already passed today, count down to tomorrow.
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  return Math.floor((target - now) / 1000);
}

function startCountdown() {
  if (!timeInput.value) {
    countdownDisplay.textContent = "Please choose a time first.";
    return;
  }

  if (intervalId) {
    clearInterval(intervalId);
  }

  remainingTime = getSecondsUntil(timeInput.value);
  isPaused = false;
  pauseResumeButton.textContent = "Pause";
  countdownDisplay.textContent = formatTime(remainingTime);

  intervalId = setInterval(() => {
    remainingTime -= 1;

    if (remainingTime <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      remainingTime = 0;
      isPaused = false;
      pauseResumeButton.textContent = "Pause";
      countdownDisplay.textContent = "Time is up!";
      return;
    }

    countdownDisplay.textContent = formatTime(remainingTime);
  }, 1000);
}

function togglePauseResume() {
  if (!intervalId && remainingTime <= 0) {
    countdownDisplay.textContent = "Start a countdown first.";
    return;
  }

  if (isPaused) {
    isPaused = false;
    pauseResumeButton.textContent = "Pause";

    intervalId = setInterval(() => {
      remainingTime -= 1;

      if (remainingTime <= 0) {
        clearInterval(intervalId);
        intervalId = null;
        remainingTime = 0;
        isPaused = false;
        pauseResumeButton.textContent = "Pause";
        countdownDisplay.textContent = "Time is up!";
        return;
      }

      countdownDisplay.textContent = formatTime(remainingTime);
    }, 1000);

    return;
  }

  clearInterval(intervalId);
  intervalId = null;
  isPaused = true;
  pauseResumeButton.textContent = "Resume";
}

function resetCountdown() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  remainingTime = 0;
  isPaused = false;
  pauseResumeButton.textContent = "Pause";
  timeInput.value = "";
  resetCountdownDisplay();
}

// Prevent page reload from the form submit control while practicing this activity.
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

resetCountdownDisplay();
startButton.addEventListener("click", startCountdown);
pauseResumeButton.addEventListener("click", togglePauseResume);
resetButton.addEventListener("click", resetCountdown);
