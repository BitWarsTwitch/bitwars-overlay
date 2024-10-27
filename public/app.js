import { getAvatarPath } from "./avatars.js";
let isInitialized = false;
let globalHealth = 50;
// Function to initialize the application
function initializeApp() {
  // Extract the sender_id from the URL
  const urlParts = window.location.pathname.split("/");
  const senderId = urlParts[1];
  console.log(senderId);

  // Connect to the Socket.IO server
  const socket = io("http://localhost:8000", {
    query: { channel: senderId },
  });

  // Listen for the "attack" event
  socket.on("attack", (attack) => {
    console.log("Received new attack for this channel:", attack);
    spawnAnimatedGifWithText(attack);
    console.log("channel_id:", senderId);

    setTimeout(() => {
      hurtCastle(attack.side, attack.damage);
    }, 5000);
  });

  socket.on("game_over", (result) => {
    // Hide existing elements
    const castles = document.querySelectorAll(".castle");
    const playerNames = document.querySelectorAll(".player-name");
    const animatedContainers = document.querySelectorAll(".animatedContainer");

    [...castles, ...playerNames, ...animatedContainers].forEach((el) => {
      el.style.display = "none";
    });

    // Create winner announcement
    const winner = document.createElement("div");
    winner.classList.add("winner-announcement");
    winner.textContent = `${result.winner} has won!`;
    container.appendChild(winner);

    // Add screen shake
    container.classList.add("screen-shake");

    // Reset everything after animation
    setTimeout(() => {
      // Remove winner announcement and screen shake
      winner.remove();
      container.classList.remove("screen-shake");

      // Show elements again
      [...castles, ...playerNames].forEach((el) => {
        el.style.display = "";
      });

      // Reset health to 50%
      globalHealth = 50;
      updateHealthBar(0);
    }, 3000);
  });

  socket.on("initialize", (session) => {
    console.log(session);
    if (!isInitialized) {
      renderCastles(session.leftName || "Host", session.rightName || "Auto");
      addHealthBar(session.health);
      globalHealth = session.health;
      isInitialized = true;
    }
  });

  // Handle connection and disconnection events
  socket.on("connect", () => {
    console.log("Connected to the server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from the server");
  });
}

function renderCastles(name1, name2) {
  // Create left castle and name
  const leftCastle = document.createElement("img");
  leftCastle.src = "castle_piskel_left.gif";
  leftCastle.classList.add("castle", "castle-left");

  const leftName = document.createElement("div");
  leftName.textContent = name1;
  leftName.classList.add("player-name", "player-name-left");

  // Create right castle and name
  const rightCastle = document.createElement("img");
  rightCastle.src = "castle_piskel_right.gif";
  rightCastle.classList.add("castle", "castle-right");

  const rightName = document.createElement("div");
  rightName.textContent = name2;
  rightName.classList.add("player-name", "player-name-right");

  // Add to container
  const container = document.getElementById("container");
  container.appendChild(leftCastle);
  container.appendChild(rightCastle);
  container.appendChild(leftName);
  container.appendChild(rightName);
}

function hurtCastle(side, damage) {
  const castleSide = side === "left" ? "right" : "left";
  const castle = document.querySelector(`.castle-${castleSide}`);
  const originalSrc = `castle_piskel_${castleSide}.gif`;

  // Add shake class and change to red castle
  castle.classList.add("shake");
  castle.src = "castle_piskel_red.png";

  // Remove shake class and revert image after 1 second
  damage = side === "right" ? -damage : damage;
  updateHealthBar(damage);
  setTimeout(() => {
    castle.classList.remove("shake");
    castle.src = originalSrc;
  }, 500);
}

function addHealthBar(leftPercentage) {
  // Remove existing health bar if any
  const existingBar = document.querySelector(".health-bar");
  if (existingBar) {
    existingBar.remove();
  }

  // Create the main health bar container
  const healthBar = document.createElement("div");
  healthBar.classList.add("health-bar");

  // Create the progress element
  const healthProgress = document.createElement("div");
  healthProgress.classList.add("health-progress");

  // Set the width based on the percentage
  healthProgress.style.width = `${leftPercentage}%`;

  // Assemble and add to the document
  healthBar.appendChild(healthProgress);
  document.getElementById("container").appendChild(healthBar);
}

function updateHealthBar(change) {
  const currentBar = document.querySelector(".health-progress");
  if (currentBar) {
    globalHealth = Math.max(0, Math.min(100, globalHealth + change));
    currentBar.style.width = `${globalHealth}%`;
  } else {
    globalHealth = Math.max(0, Math.min(100, 100 + change));
    addHealthBar(globalHealth);
  }
}

function spawnAnimatedGifWithText(attack) {
  const animatedContainer = document.createElement("div");
  animatedContainer.classList.add("animatedContainer");

  // Set initial position and animation based on side
  if (attack.side === "right") {
    animatedContainer.style.right = "70px";
    animatedContainer.style.left = "auto";
    animatedContainer.style.animation = "moveLeft 5s linear";
  } else {
    animatedContainer.style.left = "70px";
    animatedContainer.style.animation = "moveRight 5s linear";
  }

  const textElement = document.createElement("div");
  textElement.classList.add("animatedText");
  textElement.innerText = attack.user_name;

  const gifElement = document.createElement("img");
  gifElement.src = getAvatarPath(attack.attack_id);
  gifElement.classList.add("animatedImage");

  // Flip the GIF if moving from right to left
  if (attack.side === "right") {
    gifElement.style.transform = "scaleX(-1)";
  }

  animatedContainer.appendChild(textElement);
  animatedContainer.appendChild(gifElement);
  container.appendChild(animatedContainer);

  setTimeout(() => {
    container.removeChild(animatedContainer);
  }, 5000);
}

// Initialize the app on page load
window.addEventListener("load", initializeApp);

// Handle navigation without reloading the page
window.addEventListener("popstate", initializeApp);
