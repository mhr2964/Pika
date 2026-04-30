const screenNames = {
  welcome: "Welcome",
  "room-decision": "Choose path",
  "create-room": "Create room",
  "join-room": "Join room",
  "host-lobby": "Host lobby",
  "participant-lobby": "Participant lobby",
  "matchup-intro": "Matchup intro",
  "active-matchup": "Active matchup",
  "submitted-waiting": "Waiting",
  "between-matchups": "Between rounds",
  results: "Results",
  "restart-pending": "Restart pending",
  "system-empty": "Empty room",
  "system-error": "Network error"
};

const screens = [...document.querySelectorAll(".screen")];
const navLinks = [...document.querySelectorAll(".flow-link")];
const statusPill = document.getElementById("statusPill");

function showScreen(screenKey) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-visible", screen.id === `screen-${screenKey}`);
  });

  navLinks.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.screen === screenKey);
  });

  statusPill.textContent = screenNames[screenKey] || "Prototype";
}

navLinks.forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

document.querySelectorAll("[data-goto]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.goto));
});

showScreen("welcome");