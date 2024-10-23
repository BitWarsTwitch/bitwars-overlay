// Function to initialize the application
function initializeApp() {
  // Extract the sender_id from the URL
  const urlParts = window.location.pathname.split("/");
  const senderId = urlParts[1]; // Assuming the URL is like localhost:3000/<sender_id>
  console.log(senderId);

  // Connect to the Socket.IO server
  const socket = io("http://localhost:8000", {
    // Adjust the server URL and port as needed
    query: { channel: senderId }, // Send the channel (room) ID as a query parameter
  });

  // Listen for the "attack" event
  socket.on("attack", (attack) => {
    if (attack.channel_id === senderId) {
      console.log("Received new attack for this channel:", attack);
      spawnAnimatedGifWithText(attack);
    }
    console.log("channel_id:", senderId);
  });

  socket.on("damage", () => {
    hurtCastle("left");
  });

  renderCastles("misterhup", "Atrioc");

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
  leftCastle.src = "castle_piskel.png";
  leftCastle.classList.add("castle", "castle-left");

  const leftName = document.createElement("div");
  leftName.textContent = name1;
  leftName.classList.add("player-name", "player-name-left");

  // Create right castle and name
  const rightCastle = document.createElement("img");
  rightCastle.src = "castle_piskel.png";
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

function hurtCastle(side) {
  const castle = document.querySelector(`.castle-${side}`);
  const originalSrc = castle.src;

  // Add shake class and change to red castle
  castle.classList.add("shake");
  castle.src = "castle_piskel_red.png";

  // Remove shake class and revert image after 1 second
  setTimeout(() => {
    castle.classList.remove("shake");
    castle.src = originalSrc;
  }, 1000);
}

function spawnAnimatedGifWithText(attack) {
  // Create a container for both the text and the image
  const animatedContainer = document.createElement("div");
  animatedContainer.classList.add("animatedContainer");

  // Create and append the text element
  const textElement = document.createElement("div");
  textElement.classList.add("animatedText");
  textElement.innerText = attack.user_name;

  // Create and append the GIF image
  const gifElement = document.createElement("img");
  gifElement.src = "walker.gif";
  gifElement.classList.add("animatedImage");

  // Append both elements (text + gif) to the container
  animatedContainer.appendChild(textElement);
  animatedContainer.appendChild(gifElement);

  // Append to the main container
  container.appendChild(animatedContainer);

  // Remove after 5 seconds plus random delay
  setTimeout(() => {
    container.removeChild(animatedContainer);
  }, 5000);
}

// Initialize the app on page load
window.addEventListener("load", initializeApp);

// Handle navigation without reloading the page
window.addEventListener("popstate", initializeApp);
