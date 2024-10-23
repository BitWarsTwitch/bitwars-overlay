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

  // Handle connection and disconnection events
  socket.on("connect", () => {
    console.log("Connected to the server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from the server");
  });
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